from django.db import models
from django.core.exceptions import ValidationError
from django.db.models import Sum, F
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
   
class Ticket(models.Model):
    STATUS_CHOICES = [
        ('AVAILABLE', 'Available'),
        ('SOLD_OUT', 'Sold Out'),
    ]
    event = models.ForeignKey(Events, on_delete=models.CASCADE)
    total_quantity = models.PositiveIntegerField(default=0, editable=False)
    quantity_available = models.PositiveIntegerField(default=1) #not updating
    max_limit = models.PositiveIntegerField(default=0) #limit logic left
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

        if self.status == 'BOOKED' or self.status == 'CONFIRMED':
            total_selected_tickets = SelectedTicket.objects.filter(
                issued_to=self.issued_to,
                ticket__ticket__event=self.ticket.ticket.event,
                status__in=['BOOKED', 'CONFIRMED']
            ).exclude(id=self.id).aggregate(total=Sum('quantity'))['total'] or 0

            if total_selected_tickets + self.quantity > self.ticket.ticket.max_limit:
                raise ValidationError(f"Cannot select more than {self.ticket.ticket.max_limit} tickets for {self.ticket.ticket.event.name}.Limit exceeded.")
    
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


@receiver([post_save, post_delete], sender=SelectedTicket)
def update_quantity_available(sender, instance, **kwargs):
    ticket_type = instance.ticket
    total_selected_quantity = SelectedTicket.objects.filter(
        ticket=ticket_type,
        issued_to=instance.issued_to,
        status__in=['BOOKED', 'CONFIRMED']
    ).exclude(id=instance.id).aggregate(total=Sum('quantity'))['total'] or 0

    remaining_quantity = ticket_type.quantity - total_selected_quantity
    if instance.quantity > remaining_quantity:
        raise ValidationError(f"Cannot select more than {remaining_quantity} tickets for {ticket_type.name}.")

    Ticket.objects.filter(event=ticket_type.ticket.event).update(
        quantity_available=F('total_quantity') - total_selected_quantity
    )

#rename this cart for convenience
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
    
    