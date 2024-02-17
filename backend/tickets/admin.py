from django import forms
from django.contrib import admin
from .forms import SelectedTicketForm
from .models import *

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
            return ('event', 'max_limit','status','quantity_available')
        return ('event','max_limit', 'status','quantity_available')

@admin.register(TicketType)
class TicketTypeAdmin(admin.ModelAdmin):
    list_display = ['ticket','name', 'price','quantity','quantity_available',]
    def get_fields(self, request, obj=None):
        if obj:  # Change form
            return ('ticket', 'name', 'description', 'price', 'quantity','quantity_available')
        return ('ticket', 'name', 'description', 'price', 'quantity','quantity_available')

@admin.register(SelectedTicket)
class SelectedTicketAdmin(admin.ModelAdmin):
    list_display = ['issued_to','cart', 'status', 'amount', 'created_at', 'updated_at']
    readonly_fields = ('amount',)  # Make the amount field read-only
    form = SelectedTicketForm

    def get_readonly_fields(self, request, obj=None):
        if obj:  # Change read-only fields for existing objects
            return ('amount',)
        return ()  
      
    def get_fields(self, request, obj=None):
        if obj:  # Change form
            return ('ticket', 'issued_to', 'cart','status', 'quantity', 'amount')
        return ('ticket', 'issued_to','cart', 'status', 'quantity')

class SelectedTicketInline(admin.TabularInline):
    model = SelectedTicket
    extra = 0   
    fields = ('ticket','status','quantity', 'amount')
    readonly_fields = ('amount',)    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # Existing object - Allow removal
            return ['amount']
        return []

    def get_formset(self, request, obj=None, **kwargs):
        formset = super().get_formset(request, obj, **kwargs)
        formset.request = request
        return formset
    
class CartAdmin(admin.ModelAdmin):
    model = Cart
    list_display = ['attendee','total_amount', 'created_at', 'updated_at']
    readonly_fields = ['total_amount', 'created_at', 'updated_at']
    inlines = [SelectedTicketInline]
    #filter_horizontal = ['selected_tickets']

    def get_readonly_fields(self, request, obj=None):
        if obj:  # Existing object - Allow removal
            return ['total_amount', 'created_at', 'updated_at']
        return []

class OrderItemInline(admin.TabularInline):

    model = OrderItem
    list_display = ('ticket', 'quantity')
    readonly_fields=('ticket','quantity')

class OrderAdmin(admin.ModelAdmin):
    model = Order
    list_display = ['Issued_to','total_amount', 'status','created_at']
    readonly_fields = ['cart','total_amount','status', 'created_at']
    inlines=[OrderItemInline]
    #filter_horizontal = ['selected_tickets']
    def Issued_to(self, obj):
        first_name = obj.cart.attendee.first_name if obj.cart.attendee else ''
        last_name = obj.cart.attendee.last_name if obj.cart.attendee else ''
        # Concatenate the first name and last name to form the full name
        full_name = f"{first_name} {last_name}" if first_name or last_name else None
        return full_name 

    def get_readonly_fields(self, request, obj=None):
        if obj:  # Existing object - Allow removal
            return ['cart','total_amount','status', 'created_at']
        return []

admin.site.register(Cart, CartAdmin)
admin.site.register(Order,OrderAdmin)

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