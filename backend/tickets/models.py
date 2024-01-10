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
    quantity=models.PositiveIntegerField(default=1)
    quantity_available = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f" {self.ticket.event.name}:  {self.name} - {self.price}"

@receiver(post_save, sender=TicketType)
def update_quantity_available(sender, instance, created, **kwargs):
    if created:
        instance.quantity_available = instance.quantity
        instance.save(update_fields=['quantity_available'])


@receiver([post_save, post_delete], sender=TicketType)
def update_ticket_quantity_available(sender, instance, **kwargs):
    ticket = instance.ticket
    if ticket:
        total_quantity_available = TicketType.objects.filter(ticket=ticket).aggregate(total=Sum('quantity_available'))['total'] or 0
        ticket.quantity_available = total_quantity_available
        ticket.save() 
        
class Ticket(models.Model):
    STATUS_CHOICES = [
        ('AVAILABLE', 'Available'),
        ('SOLD_OUT', 'Sold Out'),
    ]
    event = models.ForeignKey(Events, on_delete=models.CASCADE)
    total_quantity = models.PositiveIntegerField(default=0, editable=False)
    quantity_available = models.PositiveIntegerField(default=1)
    max_limit = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='AVAILABLE')
    
    def __str__(self):
        return f"{self.event} - {self.status}"

@receiver(post_save, sender=TicketType)
def update_amount(sender,instance,created, *args,**kwargs):
    if created:
        ticket = instance.ticket  
        total_quantity = ticket.ticket_types.aggregate(total=Sum('quantity'))['total'] or 0
        ticket.total_quantity = total_quantity
        ticket.save(update_fields=['total_quantity'])

class SelectedTicket(models.Model):
    TICKET_STATUS = [
        ('BOOKED', 'Booked'),
        ('CANCELLED', 'Cancelled'),
        ('CONFIRMED', 'Confirmed'),
    ]
    ticket = models.ForeignKey(TicketType, on_delete=models.CASCADE)
    issued_to = models.ForeignKey(Attendee, on_delete=models.CASCADE)
    status = models.CharField(max_length=255, choices=TICKET_STATUS, default='BOOKED')
    quantity = models.PositiveIntegerField(default=1)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        is_new_ticket = self._state.adding  
        if is_new_ticket:
            if self.status == 'BOOKED':
                self.ticket.quantity_available -= self.quantity
            elif self.status == 'CANCELLED':
                self.ticket.quantity_available += self.quantity            
            self.ticket.save(update_fields=['quantity_available'])

        self.amount = self.quantity * self.ticket.price
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.issued_to.first_name} {self.issued_to.last_name} - Status: {self.status} - Amount: {self.amount}"

@receiver([post_save, post_delete], sender=SelectedTicket)
def update_quantity_available(sender, instance, **kwargs):
    ticket_types = TicketType.objects.filter(ticket=instance.ticket.ticket)
    for ticket_type in ticket_types:
        booked_or_confirmed_count = SelectedTicket.objects.filter(ticket=ticket_type, status__in=['BOOKED', 'CONFIRMED']).count()
        related_ticket = Ticket.objects.get(event=ticket_type.ticket.event)  # Fetch the related Ticket object
        related_ticket.quantity_available = related_ticket.total_quantity - booked_or_confirmed_count
        related_ticket.save()

@receiver(post_delete, sender=SelectedTicket)
def increase_tickettype_quantity_on_delete(sender, instance, **kwargs):
    ticket_type = instance.ticket
    ticket_type.quantity_available += instance.quantity
    ticket_type.save(update_fields=['quantity_available'])

class SelectedTickets(models.Model):
    attendee = models.OneToOneField(Attendee, on_delete=models.CASCADE)
    selected_tickets = models.ManyToManyField(SelectedTicket)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def total_amount(self):
        return sum(ticket.amount for ticket in self.selected_tickets.all())

    def add_selected_ticket(self, selected_ticket):
        self.selected_tickets.add(selected_ticket)

    def remove_selected_ticket(self, selected_ticket):
        self.selected_tickets.remove(selected_ticket)

    def clear_cart(self):
        self.selected_tickets.clear()

    def __str__(self):
        return f"Cart for {self.attendee.first_name} {self.attendee.last_name}"