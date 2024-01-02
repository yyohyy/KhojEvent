from django.db import models
from django.core.exceptions import ValidationError
from django.db.models import Sum
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from users.models import Attendee
from events.models import Events

class TicketType(models.Model):
    ticket = models.ForeignKey('Ticket', on_delete=models.CASCADE, related_name='ticket_types')
    name = models.CharField(blank=True, max_length=255)
    description = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity=models.PositiveIntegerField()
    quantity_available = models.PositiveIntegerField()

    def __str__(self):
        return f" {self.ticket.event.name}:  {self.name} - {self.price}"

class Ticket(models.Model):
    STATUS_CHOICES = [
        ('AVAILABLE', 'Available'),
        ('SOLD_OUT', 'Sold Out'),
    ]
    event = models.ForeignKey(Events, on_delete=models.CASCADE)
    total_quantity = models.PositiveIntegerField(default=0, editable=False)
    quantity_available = models.PositiveIntegerField()
    max_limit = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='AVAILABLE')
    
    def __str__(self):
        return f"{self.event} - {self.status}"

@receiver(post_save, sender=TicketType)
def update_amount(sender,instance,created, *args,**kwargs):
    if created:
        ticket = instance.ticket  # Access the Ticket instance related to this TicketType
        total_quantity = ticket.ticket_types.aggregate(total=Sum('quantity'))['total'] or 0
        ticket.total_quantity = total_quantity
        ticket.save(update_fields=['total_quantity'])

class SelectedTickets(models.Model):
    TICKET_STATUS = [
        ('BOOKED', 'Booked'),
        ('CANCELLED', 'Cancelled'),
        ('CONFIRMED', 'Confirmed'),
    ]
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
    issued_to = models.ForeignKey(Attendee, on_delete=models.CASCADE)
    #status = models.CharField(max_length=255, choices=TICKET_STATUS, default='AVAILABLE')
    #quantity = models.PositiveIntegerField(default=1)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.ticket} - Status: {self.status} - Amount: {self.amount}"
    
class SelectedTicket(models.Model):
    selected_tickets=models.ForeignKey(SelectedTickets,on_delete=models.PROTECT,related_name='tickets')
    ticket=models.ForeignKey(Ticket, on_delete=models.PROTECT,related_name='event_tickets')
    quantity=models.PositiveIntegerField()
    price=models.DecimalField(max_digits=6,decimal_places=2)    