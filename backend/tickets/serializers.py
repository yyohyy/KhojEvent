from rest_framework import serializers
from users.serializers import AttendeeSerializer,OrganiserSerializer
from .models import *

class TicketTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketType
        fields = ['name','description','price','quantity','quantity_available']

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


class AddRemoveUpdateTicketSerializer(serializers.Serializer):
    ticket_id = serializers.IntegerField()
    quantity = serializers.IntegerField()

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Quantity should be a positive integer.")
        return value        


class SelectedTicketSerializer(serializers.ModelSerializer):
    #cart=CartSerializer

    class Meta:
        model= SelectedTicket
        fields=['status','quantity','amount',]
    # def validate_quantity(self, value):
    #     # Custom validation for quantity
    #     ticket_type = self.instance.ticket
    #     total_selected_quantity = SelectedTicket.objects.filter(
    #         ticket=ticket_type,
    #         issued_to=self.instance.issued_to,
    #         status__in=['BOOKED', 'CONFIRMED']
    #     ).exclude(id=self.instance.id).aggregate(total=Sum('quantity'))['total'] or 0

    #     remaining_quantity = ticket_type.quantity - total_selected_quantity
    #     if value > remaining_quantity:
    #         raise serializers.ValidationError(f"Cannot select more than {remaining_quantity} tickets for {ticket_type.name}.")
    #     return value

    # def create(self, validated_data):
    #     ticket_type = validated_data['ticket']
    #     quantity = validated_data['quantity']

    #     if validated_data['status'] == 'BOOKED':
    #         ticket_type.quantity_available -= quantity
    #     elif validated_data['status'] == 'CANCELLED':
    #         ticket_type.quantity_available += quantity
    #     ticket_type.save(update_fields=['quantity_available'])

    #     validated_data['amount'] = quantity * ticket_type.price
    #     return super().create(validated_data)

    # def update(self, instance, validated_data):
    #     old_status = instance.status
    #     old_quantity = instance.quantity

    #     updated_instance = super().update(instance, validated_data)

    #     if updated_instance.status == 'BOOKED' and old_status == 'CANCELLED':
    #         updated_instance.ticket.quantity_available -= updated_instance.quantity
    #     elif updated_instance.status == 'CANCELLED' and old_status == 'BOOKED':
    #         updated_instance.ticket.quantity_available += updated_instance.quantity
    #     updated_instance.ticket.save(update_fields=['quantity_available'])

    #     return updated_instance


class CartSerializer(serializers.ModelSerializer):
    selected_tickets = SelectedTicketSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = '__all__'
        read_only_fields = ['total_amount', 'created_at', 'updated_at']

class CartDetailsSerializer(serializers.ModelSerializer):
    tickets = SelectedTicketSerializer(many=True)

    class Meta:
        model = Cart
        fields = '__all__'
        read_only_fields = ['total_amount', 'created_at', 'updated_at']

    def update(self, instance, validated_data):
        tickets_data = validated_data.pop('tickets', [])

        # Update or create selected tickets
        for ticket_data in tickets_data:
            ticket_instance, created = SelectedTicket.objects.update_or_create(
                cart=instance,
                ticket_id=ticket_data.get('ticket', {}).get('id'),
                defaults={'status': ticket_data.get('status'),
                          'quantity': ticket_data.get('quantity', 0)}
            )

            # Update amount for existing selected tickets
            if not created:
                ticket_instance.amount = ticket_instance.calculate_amount()
                ticket_instance.save()

        return instance



# class CartSerializer(serializers.ModelSerializer):
#     tickets = SelectedTicketSerializer(many=True, read_only=True)

#     class Meta:
#         model = Cart
#         fields = '__all__'
#         read_only_fields = ['total_amount', 'created_at', 'updated_at']

#     def create(self, validated_data):
#         selected_tickets_data = validated_data.pop('selected_tickets', [])
#         cart = Cart.objects.create(**validated_data)

#         for selected_ticket_data in selected_tickets_data:
#             SelectedTicket.objects.create(cart=cart, **selected_ticket_data)

#         return cart

#     def update(self, instance, validated_data):
#         selected_tickets_data = validated_data.pop('selected_tickets', [])

#         instance.attendee = validated_data.get('attendee', instance.attendee)
#         instance.save()

#         # Update or create selected tickets
#         for selected_ticket_data in selected_tickets_data:
#             selected_ticket, created = SelectedTicket.objects.update_or_create(
#                 cart=instance,
#                 ticket=selected_ticket_data.get('ticket'),
#                 defaults={'status': selected_ticket_data.get('status'),
#                           'quantity': selected_ticket_data.get('quantity')}
#             )

#             # Update amount for existing selected tickets
#             if not created:
#                 selected_ticket.amount = selected_ticket.calculate_amount()
#                 selected_ticket.save()

#         return instance
