# from django.db.models.signals import m2m_changed
# from django.dispatch import receiver
# from .models import Ticket, TicketTicketType

# @receiver(m2m_changed, sender=Ticket.ticket_types.through)
# def update_total_quantity(sender, instance, action, **kwargs):
#     if action in ['post_add', 'post_remove', 'post_clear']:
#         ticket_types = instance.tickettype_set.all()  # Access the related model through the field name
#         total_quantity = sum(ticket_type.quantity_available for ticket_type in ticket_types)
#         instance.total_quantity = total_quantity
#         instance.save()
