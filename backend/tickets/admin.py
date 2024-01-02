from django import forms
from django.contrib import admin
from django.forms.models import inlineformset_factory
from .models import Ticket, TicketType, SelectedTicket

class TicketTypeInline(admin.TabularInline):
    model = TicketType

@admin.register(TicketType)
class TicketTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'price', 'quantity_available')

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('event', 'status', 'total_quantity')  # Removed 'limit' as it's not a field in Ticket model
    inlines = [TicketTypeInline]

# class SelectedTicketAdminForm(forms.ModelForm):
#     ticket_types = forms.ModelMultipleChoiceField(queryset=TicketType.objects.all(), required=False)
#     ticket_type_quantities = forms.TypedMultipleChoiceField(coerce=int, choices=(), required=False, label='Ticket Type Quantities')

#     class Meta:
#         model = SelectedTicket
#         fields = ['ticket', 'issued_to', 'ticket_types', 'ticket_type_quantities']

#     def __init__(self, *args, **kwargs):
#         super(SelectedTicketAdminForm, self).__init__(*args, **kwargs)
#         if self.instance and self.instance.pk:
#             selected_ticket_types = self.instance.ticket_types.all()
#             self.fields['ticket_types'].initial = selected_ticket_types
#             self.fields['ticket_type_quantities'].choices = [(ticket_type.id, f'{ticket_type.name} - Quantity: {self.instance.quantity_for_ticket_type(ticket_type)}') for ticket_type in selected_ticket_types]

#     def save(self, commit=True):
#         instance = super(SelectedTicketAdminForm, self).save(commit=False)

#         if commit:
#             instance.save()

#         return instance

# class SelectedTicketAdmin(admin.ModelAdmin):
#     form = SelectedTicketAdminForm
#     list_display = ['ticket', 'issued_to', 'quantity', 'status']

#     def save_model(self, request, obj, form, change):
#         obj = form.save(commit=False)
#         ticket_types = form.cleaned_data.get('ticket_types')
#         ticket_type_quantities = form.cleaned_data.get('ticket_type_quantities')
        
#         # Set other fields here if needed
        
#         if ticket_types:
#             for idx, ticket_type in enumerate(ticket_types):
#                 quantity = ticket_type_quantities[idx] if ticket_type_quantities else 1  # Set default quantity to 1 if not provided
#                 obj.ticket_types.add(ticket_type, through_defaults={'quantity': quantity})

#         obj.save()



# admin.site.register(SelectedTicket,SelectedTicketAdmin)
    # def formfield_for_manytomany(self, db_field, request, **kwargs):
    #     if db_field.name == 'ticket_types':
    #         kwargs['queryset'] = TicketType.objects.all()
    #     return super().formfield_for_manytomany(db_field, request, **kwargs)
