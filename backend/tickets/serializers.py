from rest_framework import serializers,status
from rest_framework.response import Response
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
            ticket_type.save()
        instance.max_limit = validated_data.get('max_limit', instance.max_limit)
        instance.status = validated_data.get('status', instance.status)

        instance.quantity_available = sum(ticket_type.quantity for ticket_type in instance.ticket_types.all())

        instance.save()

        return instance

class SelectedTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model= SelectedTicket
        fields='__all__'

class CartSerializer(serializers.ModelSerializer):
    attendee= AttendeeSerializer(source='ticket.attendee',read_only=True)
    selected_tickets=SelectedTicketSerializer(many=True)

    class Meta:
        model= SelectedTickets
        fields=['attendee','selected_tickets','total_amount','updated_at']
