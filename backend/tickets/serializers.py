from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from users.serializers import AttendeeSerializer,OrganiserSerializer
from .models import *

class TicketTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketType
        fields = ['id','name','description','price','quantity','quantity_available']

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
        instance.quantity_available = sum(ticket_type.quantity for ticket_type in instance.ticket_types.all())
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

            ticket_type.quantity_available -= quantity
            ticket_type.save()

            return selected_ticket
        else:
            # Handle case where requested quantity is not available
            raise serializers.ValidationError("Requested quantity exceeds available quantity.")
            

class SelectedTicketSerializer(serializers.ModelSerializer):

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

    def update(self, instance, validated_data):
        tickets_data = validated_data.pop('tickets', [])
        existing_tickets = {str(ticket.id): ticket for ticket in instance.tickets.all()}

        for ticket_data in tickets_data:
            ticket_id = str(ticket_data.get('id'))
            quantity = int(ticket_data.get('quantity'))

            if ticket_id in existing_tickets:
                # Update the quantity for existing tickets
                existing_ticket = existing_tickets[ticket_id]
                existing_ticket_serializer = SelectedTicketSerializer(existing_ticket, data=ticket_data, partial=True)
                existing_ticket_serializer.is_valid(raise_exception=True)
                existing_ticket_serializer.save()

                # Update the quantity_available for the associated TicketType
                self.update_ticket_type_quantity(existing_ticket, quantity)
            else:
                # Try to find an existing SelectedTicket with the same cart and ticket
                existing_selected_ticket = SelectedTicket.objects.filter(cart=instance, ticket=ticket_data['ticket']).first()

                if existing_selected_ticket:
                    # Update the quantity of the existing SelectedTicket
                    existing_selected_ticket.quantity += quantity
                    existing_selected_ticket.amount = existing_selected_ticket.quantity * existing_selected_ticket.ticket.price
                    existing_selected_ticket.save()

                    # Update the quantity_available for the associated TicketType
                    self.update_ticket_type_quantity(existing_selected_ticket, quantity)
                else:
                    # Create a new SelectedTicket instance without specifying 'id'
                    selected_ticket = SelectedTicket.objects.create(cart=instance, **ticket_data)
                    # Set the quantity to the created ticket's quantity
                    quantity = selected_ticket.quantity

            # Handle deletions by checking if an existing ticket ID is missing in the payload
            ticket_ids_to_delete = set(existing_tickets) - set(str(ticket_data.get('id')) for ticket_data in tickets_data)

            # Delete any remaining tickets that were not in the request
            deleted_tickets = instance.tickets.filter(id__in=ticket_ids_to_delete)
            for deleted_ticket in deleted_tickets:
                # Update quantity_available for the associated TicketType
                self.update_ticket_type_quantity(deleted_ticket, 0)  # Set quantity to 0
                deleted_ticket.delete()

        instance.total_amount = validated_data.get('total_amount', instance.total_amount)
        instance.attendee = validated_data.get('attendee', instance.attendee)
        instance.save()

        return instance

    def update_ticket_type_quantity(self, selected_ticket, quantity):
        ticket_type = selected_ticket.ticket
        ticket_type.quantity_available = F('quantity_available') + selected_ticket.quantity - quantity
        ticket_type.save(update_fields=['quantity_available'])

# class CartDetailsSerializer(serializers.ModelSerializer):
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
    def update_ticket_type_quantity(self, ticket, quantity):
        ticket.quantity_available -= quantity
        ticket.save()

    def update(self, instance, validated_data):
        tickets_data = validated_data.pop('tickets', [])

        existing_tickets = {str(ticket.id): ticket for ticket in instance.tickets.all()}

        for ticket_data in tickets_data:
            ticket_id = str(ticket_data.get('id'))
            quantity = int(ticket_data.get('quantity'))
            print("N",quantity)

            if ticket_id in existing_tickets:
                # Update the quantity for existing tickets
                existing_ticket = existing_tickets[ticket_id]
                previous_quantity = existing_ticket.quantity  
                print("P",previous_quantity)               
                existing_ticket_serializer = SelectedTicketSerializer(existing_ticket, data=ticket_data, partial=True)
                existing_ticket_serializer.is_valid(raise_exception=True)
                existing_ticket_serializer.save()
                self.update_ticket_type_quantity(existing_ticket, quantity)
            # Store the quantity updates for each ticket type

                # # Update quantity_available for the associated TicketType
                # ticket_type = existing_ticket.ticket
                # ticket_type.quantity_available = F('quantity_available') + previous_quantity - quantity
                # ticket_type.save(update_fields=['quantity_available'])
            else:
                # Create a new SelectedTicket instance without specifying 'id'
                SelectedTicket.objects.create(cart=instance, **ticket_data)
 
        # Handle deletions by checking if an existing ticket ID is missing in the payload
        ticket_ids_to_delete = set(existing_tickets) - set(str(ticket_data.get('id')) for ticket_data in tickets_data)

        # Delete any remaining tickets that were not in the request
        deleted_tickets = instance.tickets.filter(id__in=ticket_ids_to_delete)
        for deleted_ticket in deleted_tickets:
            # Update quantity_available for the associated TicketType
            ticket_type = deleted_ticket.ticket
            ticket_type.quantity_available = F('quantity_available') + deleted_ticket.quantity
            ticket_type.save(update_fields=['quantity_available'])

        deleted_tickets.delete()

        instance.total_amount = validated_data.get('total_amount', instance.total_amount)
        instance.attendee = validated_data.get('attendee', instance.attendee)
        instance.save()
        self.update_ticket_type_quantity(ticket_type, quantity)
        return instance

    # def create(self, validated_data):
    #     tickets_data = validated_data.pop('tickets', [])
    #     cart = Cart.objects.create(**validated_data)

    #     for ticket_data in tickets_data:
    #         # Create a new SelectedTicket instance without specifying 'id'
    #         selected_ticket=SelectedTicket.objects.create(cart=cart, **ticket_data)
    #         selected_ticket.save()

    #     return cart


