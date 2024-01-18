from django import forms
from django.core.exceptions import ValidationError
from django.db.models import Sum
from .models import SelectedTicket

class SelectedTicketForm(forms.ModelForm):
    class Meta:
        model = SelectedTicket
        fields = '__all__'

    def clean(self):
        cleaned_data = super().clean()
        status = cleaned_data.get('status')
        quantity = cleaned_data.get('quantity')
        ticket = cleaned_data.get('ticket')

        if status in ['BOOKED', 'CONFIRMED']:
            total_selected_tickets = SelectedTicket.objects.filter(
                issued_to=cleaned_data.get('issued_to'),
                ticket__ticket__event=ticket.ticket.event,
                status__in=['BOOKED', 'CONFIRMED']
            ).exclude(id=cleaned_data.get('id') if cleaned_data.get('id') else None).aggregate(total=Sum('quantity'))['total'] or 0

            if total_selected_tickets + quantity > ticket.ticket.max_limit:
                raise ValidationError(f"Cannot select more than {ticket.ticket.max_limit} tickets for {ticket.ticket.event.name}. Limit exceeded.")

        return cleaned_data
