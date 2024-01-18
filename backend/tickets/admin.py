from django import forms
from django.contrib import admin
from django.forms.models import inlineformset_factory
from .forms import SelectedTicketForm
from .models import Ticket, TicketType, SelectedTicket, SelectedTickets

class TicketTypeInline(admin.TabularInline):
    model = TicketType
    list_display = ('name', 'description', 'price', 'quantity')
    fields=('name','description','price','quantity',)

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('event', 'status', 'total_quantity','quantity_available') 
    inlines = [TicketTypeInline]
    def get_fields(self, request, obj=None):
        if obj:  # Change form
            return ('event', 'max_limit','status')
        return ('event','max_limit', 'status')

@admin.register(TicketType)
class TicketTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'price','quantity','quantity_available',]
    def get_fields(self, request, obj=None):
        if obj:  # Change form
            return ('ticket', 'name', 'description', 'price', 'quantity')
        return ('ticket', 'name', 'description', 'price', 'quantity')

@admin.register(SelectedTicket)
class SelectedTicketAdmin(admin.ModelAdmin):
    list_display = ['issued_to', 'status', 'amount', 'created_at', 'updated_at']
    readonly_fields = ('amount',)  # Make the amount field read-only
    form = SelectedTicketForm
    def get_fields(self, request, obj=None):
        if obj:  # Change form
            return ('ticket', 'issued_to', 'status', 'quantity', 'amount')
        return ('ticket', 'issued_to', 'status', 'quantity')
    
class SelectedTicketsAdmin(admin.ModelAdmin):
    model = SelectedTickets
    list_display = ['attendee', 'total_amount', 'created_at', 'updated_at']
    readonly_fields = ['total_amount', 'created_at', 'updated_at']
    filter_horizontal = ['selected_tickets']

    def get_readonly_fields(self, request, obj=None):
        if obj:  # Existing object - Allow removal
            return ['total_amount', 'created_at', 'updated_at']
        return []

admin.site.register(SelectedTickets, SelectedTicketsAdmin)


# class TicketPurchaseAdmin(admin.ModelAdmin):
#     list_display = ['user', 'event', 'quantity', 'price', 'payment_status']
#     actions = ['generate_invoice']

#     def generate_invoice(self, request, queryset):
#         for ticket_purchase in queryset:
#             if ticket_purchase.payment_status:
#                 # Generate the invoice using WeasyPrint
#                 # For brevity, assume you have a method to generate the invoice
#                 invoice_pdf = generate_invoice_pdf(ticket_purchase)

#                 # Display the PDF invoice in the browser
#                 response = HttpResponse(invoice_pdf, content_type='application/pdf')
#                 response['Content-Disposition'] = f'inline; filename="invoice_{ticket_purchase.id}.pdf"'
#                 return response
#             else:
#                 self.message_user(request, "Invoice not available for selected tickets.", level='ERROR')

#     generate_invoice.short_description = "Generate and View Invoice"

# admin.site.register(TicketPurchase, TicketPurchaseAdmin)