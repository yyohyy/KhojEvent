from django.db import transaction
from rest_framework import generics,status
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import *
from .permissions import *
from .serializers import *


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
            
            # Update the quantity_available of the associated TicketType
            ticket_type = instance.ticket
            ticket_type.quantity_available += instance.quantity
            ticket_type.save(update_fields=['quantity_available'])
            
            # Update the quantity_available of the associated Ticket
            ticket = ticket_type.ticket
            ticket.quantity_available += instance.quantity
            ticket.save(update_fields=['quantity_available'])
            
            # Update the associated Cart's total amount
            instance.cart.total_amount -= instance.amount
            instance.cart.save(update_fields=['total_amount'])
            return Response(status=status.HTTP_204_NO_CONTENT)
            
 

class TicketDetails(RetrieveUpdateDestroyAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes= [IsOwnerOrReadOnly]
    lookup_field = 'pk' 

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

class CartDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset=Cart.objects.all()
    serializer_class=CartDetailsSerializer
    permission_classes= [IsCartOwnerOrReadOnly]

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

# class PaymentProcessView(generics.UpdateAPIView):
#     queryset = Order.objects.all()
#     serializer_class = OrderSerializer

#     def update(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)

#         instance = self.get_object()
#         instance.payment_status = serializer.validated_data.get('payment_status')
#         instance.save()

#         return Response({"message": f"Payment {instance.payment_status}"}, status=status.HTTP_200_OK)    