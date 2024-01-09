from rest_framework import serializers
from users.serializers import OrganiserSerializer
from .models import *

class TicketTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketType
        fields = '__all__'

class TicketSerializer(serializers.ModelSerializer):
    ticket_types = TicketTypeSerializer(many=True)

    class Meta:
        model = Ticket
        fields = ['id', 'event','total_quantity', 'ticket_types']

    def update(self, instance, validated_data):
        ticket_types_data = validated_data.pop('ticket_types')
        ticket_types = instance.ticket_types.all()

        for ticket_type_data, ticket_type in zip(ticket_types_data, ticket_types):
            ticket_type.name = ticket_type_data.get('name', ticket_type.name)
            ticket_type.description = ticket_type_data.get('description', ticket_type.description)
            ticket_type.price = ticket_type_data.get('price', ticket_type.price)
            ticket_type.quantity_available = ticket_type_data.get('quantity_available', ticket_type.quantity_available)
            ticket_type.save()

        return instance

class SelectedTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model= SelectedTicket
        fields='__all__'