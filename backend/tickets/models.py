from django.db import models
from django.db.models import Sum, F
from django.db import transaction
from users.models import Attendee
from events.models import Event
from decimal import Decimal
import uuid
from django.utils import timezone
from datetime import timedelta



class TicketType(models.Model):
    ticket = models.ForeignKey('Ticket', on_delete=models.CASCADE, related_name='ticket_types')
    name = models.CharField(blank=True, max_length=255)
    description = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity=models.PositiveIntegerField(default=1)
    quantity_available = models.PositiveIntegerField(default=1)
    
    def __str__(self):
        return f" {self.ticket.event.name}:  {self.name} - {self.price}"

class Ticket(models.Model):
    STATUS_CHOICES = [
        ('AVAILABLE', 'Available'),
        ('SOLD_OUT', 'Sold Out'),
    ]
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    total_quantity = models.PositiveIntegerField(default=0, editable=False)
    quantity_available = models.PositiveIntegerField(default=1) 
    max_limit = models.PositiveIntegerField(default=0) 
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='AVAILABLE') 
     
    def __str__(self):
        return f"{self.event} - {self.status}"
    
class Cart(models.Model):
    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)
    attendee = models.OneToOneField(Attendee, on_delete=models.CASCADE)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    expiration_time = models.DateTimeField(null=True, blank=True) 
    
    def update_total_amount(self):
        with transaction.atomic():
            selected_tickets = SelectedTicket.objects.filter(cart=self)
            total_amount = selected_tickets.aggregate(total=Sum('amount'))['total'] or Decimal('0.0')
            self.total_amount = total_amount


    def save(self, *args, **kwargs):
        # update_fields = kwargs.pop('update_fields', None)



        # if not update_fields or 'total_amount' in update_fields:
        #     self.update_total_amount()

        # if not update_fields or 'total_amount' not in update_fields:
        #     # Only call update_total_amount if total_amount is not being explicitly updated
        #     self.update_total_amount()
        
        if not self.pk:  # Check if the cart is being created for the first time
            self.set_expiration_time()
        super().save(*args, **kwargs)

    def __str__(self):
            return f"Cart for {self.attendee.first_name} {self.attendee.last_name} {self.id}"
    def set_expiration_time(self):

        # Set expiration time to 30 minutes from now
        self.expiration_time = timezone.now() + timedelta(minutes=1)
        self.save(update_fields=['expiration_time'])

          
class SelectedTicket(models.Model):
    TICKET_STATUS = [
        ('BOOKED', 'Booked'),
        ('PROCESSING','Processing'),
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
    cart=models.ForeignKey(Cart,on_delete=models.CASCADE,related_name="tickets",null=True,blank=True)
    
    def save(self, *args, **kwargs):
        if self.status=='BOOKED':
            self.cart = Cart.objects.get_or_create(attendee=self.issued_to)[0]
        else:
            self.cart = None
        # Calculate the amount based on the quantity and ticket price
        self.amount = self.quantity * self.ticket.price

        # Get the previous quantity before saving
        previous_quantity = SelectedTicket.objects.get(pk=self.pk).quantity if self.pk else 0
        #self.cart = Cart.objects.get_or_create(attendee=self.issued_to)[0]
        super().save(*args, **kwargs)
        # Calculate the difference in quantity
        quantity_difference = self.quantity - previous_quantity

        # Update the quantity_available of the associated TicketType
        ticket_type = self.ticket
        ticket_type.quantity_available = F('quantity_available') - quantity_difference
        ticket_type.save(update_fields=['quantity_available'])

        # Update the quantity_available of the associated Ticket
        ticket = ticket_type.ticket
        ticket.quantity_available = F('quantity_available') - quantity_difference
        ticket.save(update_fields=['quantity_available'])
        # Update the associated Cart's total amount
        if self.cart:
            # Subtract the previous amount and add the new amount
            self.cart.total_amount = F('total_amount') - (self.ticket.price * previous_quantity) + self.amount
            self.cart.save(update_fields=['total_amount'])

    def __str__(self):
        return f"{self.issued_to.first_name} {self.issued_to.last_name} - Status: {self.status} - Amount: {self.amount}"

class Order(models.Model):
    ORDER_STATUS = [
        ('PENDING', 'Pending'),
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
    ]
    cart=models.ForeignKey(Cart,on_delete=models.CASCADE,related_name='order')
    total_amount=models.DecimalField(max_digits=10,decimal_places=2)
    status=models.CharField(max_length=255,default='PENDING')
    created_at=models.DateTimeField(auto_now_add=True)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='tickets')
    ticket = models.ForeignKey(SelectedTicket, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()    