from django.db import transaction
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from events.serializers import EventSerializer
from users.serializers import AttendeeSerializer,OrganiserSerializer
from .models import *

class TicketTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketType
        fields = ['id','name','description','price','quantity','quantity_available']

class CreateTicketSerializer(serializers.ModelSerializer):
    ticket_types = TicketTypeSerializer(many=True)
    
    class Meta:
        model = Ticket
        fields = ['event', 'max_limit', 'total_quantity', 'quantity_available', 'ticket_types']
        read_only_fields=['event']
    def create(self, validated_data):
        event=validated_data.get('event')
        event_id = self.context.get('event_id')
        
        ticket = Ticket.objects.filter(event_id=event_id).first()
        #ticket.event=event
        if not ticket:
            event = Event.objects.get(pk=event_id)
            ticket = Ticket.objects.create(event=event)
        else:
            validated_data['max_limit'] = validated_data.get('max_limit', ticket.max_limit)
            validated_data['total_quantity'] = ticket.total_quantity
            validated_data['quantity_available'] = ticket.quantity_available            
        
        ticket_types_data = validated_data.pop('ticket_types')
        for ticket_type_data in ticket_types_data:
            quantity = ticket_type_data.pop('quantity', 0)
            ticket_type_data['ticket'] = ticket
            ticket_type_data['quantity']=quantity
            ticket_type_data['quantity_available'] = quantity
            TicketType.objects.create(**ticket_type_data)

        ticket.total_quantity += sum(ticket_type_data['quantity'] for ticket_type_data in ticket_types_data)
        ticket.quantity_available += sum(ticket_type_data['quantity_available'] for ticket_type_data in ticket_types_data)
        ticket.max_limit = validated_data.get('max_limit', ticket.max_limit)
        ticket.save() 

        return ticket

class TicketSerializer(serializers.ModelSerializer):
    organiser= OrganiserSerializer(source='event.organizer',read_only=True)
    ticket_types = TicketTypeSerializer(many=True)

    class Meta:
        model = Ticket
        fields = ['id', 'event','organiser','total_quantity', 'quantity_available','max_limit','status','ticket_types']
  
    def update(self, instance, validated_data):
        ticket_types_data = validated_data.pop('ticket_types')
        ticket_types = instance.ticket_types.all()

        for ticket_type_data, ticket_type in zip(ticket_types_data, ticket_types):
            ticket_type.name = ticket_type_data.get('name', ticket_type.name)
            ticket_type.description = ticket_type_data.get('description', ticket_type.description)
            ticket_type.price = ticket_type_data.get('price', ticket_type.price)
            ticket_type.quantity= ticket_type_data.get('quantity', ticket_type.quantity)
            ticket_type.quantity_available= ticket_type_data.get('quantity_available', ticket_type.quantity_available)
            ticket_type.save()

        instance.max_limit = validated_data.get('max_limit', instance.max_limit)
        instance.status = validated_data.get('status', instance.status)
        instance.total_quantity = sum(ticket_type.quantity for ticket_type in instance.ticket_types.all())
        instance.quantity_available = sum(ticket_type.quantity_available for ticket_type in instance.ticket_types.all())
        instance.save()
        return instance

class SelectTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = SelectedTicket
        fields = ['id', 'ticket', 'issued_to', 'status', 'quantity', 'amount', 'created_at', 'updated_at', 'cart']
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {
            'cart': {'required': False},
            'issued_to': {'required': False},
        }
    def validate_tickets(self, tickets_data):
        for ticket_data in tickets_data:
            # Assuming SelectedTicket has a foreign key to TicketType named 'ticket'
            event = ticket_data['ticket'].ticket.event
            total_selected_tickets = SelectedTicket.objects.filter(ticket__ticket__event=event).aggregate(total=Sum('quantity'))['total'] or 0
            quantity = ticket_data.get('quantity')
            ticket_max_limit = ticket_data['ticket'].ticket.max_limit

            if total_selected_tickets + quantity > ticket_max_limit:
                raise ValidationError(f"Invalid quantity. Limit exceeded for the event or ticket type.")

        return tickets_data
   

    def create(self, validated_data):
        ticket_type_data = validated_data.pop('ticket')
        quantity = validated_data.pop('quantity')

        # Extract the 'id' from the 'ticket' object
        ticket_type_id = ticket_type_data.get('id') if isinstance(ticket_type_data, dict) else ticket_type_data.id

        ticket_type = TicketType.objects.get(id=ticket_type_id)

        # Check if the requested quantity is available
        if quantity <= ticket_type.quantity_available:
            
            self.validate_tickets([{'ticket': ticket_type, 'quantity': quantity}])
            # Fetch or create the Cart associated with the user's attendee
            attendee = self.context['request'].user.attendee
            print(attendee)
            cart, created = Cart.objects.get_or_create(attendee=attendee)
            print(cart)
            # Ensure that 'issued_to' is an instance of Attendee
            if not isinstance(attendee, Attendee):
                raise serializers.ValidationError("Invalid 'issued_to' value.")

            # Manually create the SelectedTicket instance
            selected_ticket = SelectedTicket(
                ticket=ticket_type,
                issued_to=attendee,  # Ensure 'issued_to' is an instance of Attendee
                status='BOOKED',
                quantity=quantity,
                amount=ticket_type.price * quantity,
                cart=cart
            )
            selected_ticket.save()

            return selected_ticket
        else:
            # Handle case where requested quantity is not available
            raise serializers.ValidationError("Requested quantity exceeds available quantity.")
          

class SelectedTicketSerializer(serializers.ModelSerializer):
    ticket = TicketTypeSerializer()
    issued_to= AttendeeSerializer()
    class Meta:
        model= SelectedTicket
        fields=['id','ticket','status','quantity','amount','issued_to']
        

class CartDetailsSerializer(serializers.ModelSerializer):
    tickets = SelectedTicketSerializer(many=True, partial=True)

    class Meta:
        model = Cart
        fields = ['id', 'tickets', 'total_amount', 'created_at', 'updated_at', 'attendee']

    def validate_tickets(self, tickets_data):
        total_selected_tickets = self.instance.tickets.aggregate(total=Sum('quantity'))['total'] or 0

        for ticket_data in tickets_data:
            quantity = ticket_data.get('quantity')

            if total_selected_tickets + quantity > ticket_data['ticket'].ticket.max_limit:
                raise ValidationError(f"Cannot select more than {ticket_data['ticket'].ticket.max_limit} tickets for {ticket_data['ticket'].ticket.event.name}. Limit exceeded.")

        return tickets_data
    def to_representation(self, instance):
        data = super().to_representation(instance)
        booked_tickets = instance.tickets.filter(status='BOOKED')
        data['tickets'] = SelectedTicketSerializer(booked_tickets, many=True).data
        tickets_data = data['tickets']
        for ticket_data in tickets_data:
            ticket_type_id = ticket_data.get('ticket')
            if ticket_type_id:
                ticket_type = TicketType.objects.get(pk=ticket_type_id)
                ticket_type_serializer = TicketTypeSerializer(ticket_type)
                ticket_data['ticket'] = ticket_type_serializer.data
                event = ticket_type.ticket.event
                ticket_data['event'] = {
                    'name': event.name,
                    'image': self.get_absolute_image_url(event.image) if event.image else None,
                }
        return data

    def get_absolute_image_url(self, image):
        if image:
            request = self.context.get('request')
            return request.build_absolute_uri(image.url)
        return None

        
    def update(self, instance, validated_data):
        tickets_data = validated_data.pop('tickets', [])
        existing_tickets = {str(ticket.id): ticket for ticket in instance.tickets.all()}
 
        with transaction.atomic():
            for ticket_data in tickets_data:
                ticket_id = str(ticket_data.get('id'))
                quantity = int(ticket_data.get('quantity'))

                if ticket_id in existing_tickets:
                    # Update the quantity for existing tickets
                    existing_ticket = existing_tickets[ticket_id]
                    existing_ticket_serializer = SelectedTicketSerializer(existing_ticket, data=ticket_data, partial=True)
                    existing_ticket_serializer.is_valid(raise_exception=True)
                    existing_ticket_serializer.save()
                else:
                    # Try to find an existing SelectedTicket with the same cart and ticket
                    existing_selected_ticket = SelectedTicket.objects.filter(cart=instance, ticket=ticket_data['ticket']).first()
                    if existing_selected_ticket:
                        existing_selected_ticket.quantity = quantity
                        existing_selected_ticket.amount = existing_selected_ticket.ticket.price * quantity
                        existing_selected_ticket.save()
                    else:
                        SelectedTicket.objects.create(cart=instance, **ticket_data)
    
            instance.total_amount = instance.tickets.aggregate(total=Sum(F('quantity') * F('ticket__price'), output_field=DecimalField()))['total'] or Decimal('0.0')
            instance.attendee = validated_data.get('attendee', instance.attendee)
            instance.save()

        return instance

class OrderItemSerializer(serializers.ModelSerializer):
    event = EventSerializer(source='ticket.ticket.ticket.event')
    ticket = SelectedTicketSerializer()
    class Meta:
        model=OrderItem
        fields = ['id', 'quantity', 'ticket','event']

class OrderSerializer(serializers.ModelSerializer):
    
    tickets=OrderItemSerializer(many=True,read_only=True)
    class Meta:
        model=Order
        fields=['id','cart','total_amount','status','tickets','created_at']

        
