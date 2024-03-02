import pdfkit
from django.template.loader import render_to_string
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from django.http import HttpResponse
from django.db import transaction
from django.shortcuts import get_object_or_404
from jinja2 import Environment, FileSystemLoader
from rest_framework import generics,status
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import *
from .permissions import *
from .serializers import *
from .utils import generate_order_receipt_pdf


class CreateTicketView(generics.ListCreateAPIView):
    serializer_class = CreateTicketSerializer
    #permission_classes= [IsOrganiserOrReadOnly]

    def get_queryset(self):
        event_id = self.kwargs.get('event_id')
        return Ticket.objects.filter(event_id=event_id)

    def perform_create(self, serializer):
        event_id = self.kwargs.get('event_id')
        serializer.context['event_id'] = event_id
        serializer.save()

class SelectedTicketDeleteView(generics.ListAPIView, generics.DestroyAPIView):
    queryset = SelectedTicket.objects.all()
    serializer_class = SelectedTicketSerializer
    permission_classes=[IsSelectedTicketOwnerOrReadOnly]

    def destroy(self, request, *args, **kwargs):
        with transaction.atomic():
            instance = self.get_object()
            self.perform_destroy(instance)
            
            ticket_type = instance.ticket
            ticket_type.quantity_available += instance.quantity
            ticket_type.save(update_fields=['quantity_available'])

            ticket = ticket_type.ticket
            ticket.quantity_available += instance.quantity
            ticket.save(update_fields=['quantity_available'])

            instance.cart.total_amount -= instance.amount
            print(instance.cart.total_amount)
            instance.cart.save(update_fields=['total_amount'])
            return Response(status=status.HTTP_204_NO_CONTENT)
            
class TicketDetails(RetrieveUpdateDestroyAPIView):
    serializer_class = TicketSerializer
    #permission_classes = [IsOwnerOrReadOnly]
    lookup_field = 'event_id'  # Use the URL keyword argument for event ID lookup

    def get_queryset(self):
        event = self.kwargs.get(self.lookup_field)
        print(event)
        return Ticket.objects.filter(event_id=event)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Ticket deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class TicketDeleteView(generics.RetrieveAPIView, generics.DestroyAPIView):
    queryset = TicketType.objects.all()
    serializer_class = TicketTypeSerializer
    permission_classes = [DeletionPermission]

    def destroy(self, request, *args, **kwargs):
        with transaction.atomic():
            instance = self.get_object()

            # Get the associated ticket
            ticket = instance.ticket

            # Subtract the quantity and quantity_available of the deleted ticket type from the associated ticket
            ticket.total_quantity -= instance.quantity
            ticket.quantity_available -= instance.quantity_available
            ticket.save(update_fields=['total_quantity','quantity_available'])

            # Call the parent class method to delete the ticket type
            self.perform_destroy(instance)
            
            return Response(status=status.HTTP_204_NO_CONTENT)
    
class SelectTicketView(generics.ListCreateAPIView):
    serializer_class = SelectTicketSerializer

    def get_queryset(self):
        event_id = self.kwargs.get('event_id')
        return SelectedTicket.objects.filter(ticket__ticket__event_id=event_id)

class SelectedTicketDetails(generics.RetrieveUpdateDestroyAPIView):

    queryset = SelectedTicket.objects.all()
    serializer_class = SelectedTicketSerializer
   # permission_classes = [IsCartOwnerOrReadOnly]
    lookup_field = 'id'
      
    def destroy(self, request, *args, **kwargs):
        with transaction.atomic():
            instance = self.get_object()
            previous_quantity = instance.quantity
            ticket_type = instance.ticket

            # Subtract the quantity of the deleted selected ticket from the associated tickettype
            ticket_type.quantity_available += instance.quantity
            ticket_type.save(update_fields=['quantity_available'])
            cart = instance.cart
            if cart:
                print(cart.total_amount)
                cart.total_amount -=(instance.amount)
                print(instance.amount)
                print(cart.total_amount)
                cart.save(update_fields=['total_amount'])
            ticket=ticket_type.ticket
            ticket.quantity_available += instance.quantity
            ticket.save(update_fields=['quantity_available'])


            # Call the parent class method to delete the selected ticket instance
            self.perform_destroy(instance)

            return Response(status=status.HTTP_204_NO_CONTENT)
        
class CartDetails(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CartDetailsSerializer
    permission_classes = [IsCartOwnerOrReadOnly]
    lookup_field = 'attendee_id'

    def get_serializer(self, *args, **kwargs):
        # Pass the instance and context dynamically to the serializer
        kwargs['context'] = self.get_serializer_context()
        return self.serializer_class(*args, **kwargs)

    def get_queryset(self):
        attendee = self.kwargs.get(self.lookup_field)
        return Cart.objects.filter(attendee_id=attendee)
    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance):
        # Update quantity available for each ticket type
        for selected_ticket in instance.tickets.all():
            ticket = selected_ticket.ticket
            ticket.quantity_available += selected_ticket.quantity
            ticket.save()
        
        # Delete the cart
        instance.delete()
class CheckoutView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes=[IsAuthenticated]

    def create(self, request, *args, **kwargs):
        with transaction.atomic():
        # Get the current logged-in attendee
            attendee = request.user.attendee

            # Retrieve the cart associated with the attendee
            cart = Cart.objects.filter(attendee=attendee).first()

            # Proceed only if the attendee has a cart
            if cart:
                #if cart.tickets.filter(status='PROCESSING').exists():
                  #  return Response({"message": "Selected tickets in the cart have already been processed"}, status=status.HTTP_400_BAD_REQUEST)
                total_amount = cart.total_amount  # Dummy data, replace with actual calculation
                # Create an order
                order = Order.objects.create(cart=cart, total_amount=total_amount)

                # Create order items from selected tickets in the cart
                for selected_ticket in cart.tickets.all():
                    OrderItem.objects.create(order=order, ticket=selected_ticket, quantity=selected_ticket.quantity)
                    selected_ticket.status= 'PROCESSING'
                    selected_ticket.save()
                
                cart.total_amount=0
                cart.save()

                serializer = self.get_serializer(order)
                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
            else:
                return Response({"message": "No cart found for the attendee"}, status=status.HTTP_404_NOT_FOUND)

class PaymentView(generics.UpdateAPIView,generics.ListAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.status = 'SUCCESS'
        instance.save()
        for ticket in instance.tickets.all():
            ticket.ticket.status = 'CONFIRMED'
            ticket.ticket.save()

        order_serializer = self.get_serializer(instance)
        order_item_serializer = OrderItemSerializer(instance.tickets.all(), many=True)

        return Response({
            'order': order_serializer.data,
            'order_items': order_item_serializer.data
        }, status=status.HTTP_200_OK)
    
class OrderDetails(generics.RetrieveAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer    

class AttendeeEventOrders(generics.ListAPIView):
    serializer_class = OrderItemSerializer

    def get_queryset(self):
        # Get the attendee ID and event ID from the URL parameters
        attendee_id = self.kwargs['attendee_id']
        event_id = self.kwargs['event_id']

        # Filter OrderItem objects based on attendee and event
        order_items = OrderItem.objects.filter(ticket__ticket__ticket__event_id=event_id, ticket__issued_to_id=attendee_id)
        print(order_items)
        # Get the orders associated with the filtered OrderItem objects
        #orders = Order.objects.filter(orderitem__in=order_items)
        return order_items 

# def DownloadReceipt(request, order_id):
#     # Fetch the order and related ticket information
#     order = get_object_or_404(Order, pk=order_id)
#     order_items = OrderItem.objects.filter(order=order)

#     # Set up response
#     response = HttpResponse(content_type='application/pdf')
#     response['Content-Disposition'] = f'attachment; filename="order_{order_id}.pdf"'

#     # Create a ReportLab PDF document
#     pdf = SimpleDocTemplate(response, pagesize=letter)
    
#     # Define styles
#     style = TableStyle([('BACKGROUND', (0, 0), (-1, 0), colors.grey),
#                         ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
#                         ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
#                         ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
#                         ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
#                         ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
#                         ('GRID', (0, 0), (-1, -1), 1, colors.black)])

#     # Create a table for the order details
#     order_data = [
#         ["Order ID", "Total Amount", "Status", "Created At"],
#         [order.id, order.total_amount, order.status, order.created_at],
#     ]

#     order_table = Table(order_data)
#     order_table.setStyle(style)

#     # Create a table for the order items
#     order_item_data = [
#         ["Event Name", "Ticket Name", "Quantity", "Price"]
#     ]
#     for order_item in order_items:
#         order_item_data.append([
#             order_item.ticket.ticket.ticket.event.name,
#             order_item.ticket.ticket.name,
#             order_item.quantity,
#             order_item.ticket.ticket.price
#         ])

#     order_item_table = Table(order_item_data)
#     order_item_table.setStyle(style)

#     # Build the PDF document
#     pdf_content = []
#     pdf_content.append(order_table)
#     pdf_content.append(order_item_table)

#     # Build PDF
#     pdf.build(pdf_content)

#     return response
    
class ViewReceipt(APIView):
    def get(self, request, *args, **kwargs):
        order = get_object_or_404(Order, pk=self.kwargs['order_id'])
        order_items = OrderItem.objects.filter(order=order)

        # Generate PDF content
        pdf = generate_order_receipt_pdf(order, order_items)

        # Return the PDF file as response
        return HttpResponse(open("order_receipt.pdf", "rb"), content_type='application/pdf')

class DownloadReceipt(ViewReceipt):
    def get(self, request, *args, **kwargs):
        order = get_object_or_404(Order, pk=self.kwargs['order_id'])
        order_items = OrderItem.objects.filter(order=order)

        # Generate PDF content
        pdf = generate_order_receipt_pdf(order, order_items)

        # Create a response with PDF file as attachment
        response = HttpResponse(open("order_receipt.pdf", "rb"), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="order_{order.id}_receipt.pdf"'
        return response    