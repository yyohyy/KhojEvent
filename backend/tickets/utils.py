from django.db.models import F
from .models import TicketType, Ticket

def update_quantity_available(ticket_type, quantity, previous_quantity=0):
    ticket_type.quantity_available = F('quantity_available') - previous_quantity + quantity
    ticket_type.save(update_fields=['quantity_available'])

    ticket = ticket_type.ticket
    ticket.quantity_available = F('quantity_available') - previous_quantity + quantity
    ticket.save(update_fields=['quantity_available'])