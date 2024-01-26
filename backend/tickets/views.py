from rest_framework import generics,status
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from .models import *
from .permissions import IsOwnerOrReadOnly,IsCartOwnerOrReadOnly
from .serializers import CartSerializer,SelectedTicketSerializer,AddRemoveUpdateTicketSerializer, TicketSerializer, CartDetailsSerializer

class TicketDetails(RetrieveUpdateDestroyAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes= [IsOwnerOrReadOnly]
    lookup_field = 'pk'  # Change this to your desired lookup field

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Ticket deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

# class CartDetails(generics.ListCreateAPIView):
#     queryset = SelectedTicket.objects.all()
#     serializer_class = SelectedTicketSerializer

class CartDetails(generics.RetrieveUpdateAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartDetailsSerializer
    lookup_field = 'pk'

    def get(self, request, *args, **kwargs):
        cart = self.get_object()
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        cart = self.get_object()
        serializer = self.get_serializer(cart, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

#         return Response(serializer.data)
# class CartDetails(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Cart.objects.all()
#     serializer_class = CartSerializer

#     def get_object(self):
#         cart_id = self.kwargs.get('pk')
#         return Cart.objects.get(id=cart_id)

#     def update(self, request, *args, **kwargs):
#         instance = self.get_object()
#         serializer = AddRemoveUpdateTicketSerializer(data=request.data)

#         if serializer.is_valid():
#             ticket_id = serializer.validated_data['ticket_id']
#             quantity = serializer.validated_data['quantity']

#             try:
#                 selected_ticket = SelectedTicket.objects.get(ticket_id=ticket_id, cart=instance)
#             except SelectedTicket.DoesNotExist:
#                 return Response({"detail": "Selected Ticket not found in the cart."}, status=status.HTTP_404_NOT_FOUND)

#             # Update quantity and amount
#             selected_ticket.quantity = quantity
#             selected_ticket.amount = selected_ticket.ticket.price * quantity
#             selected_ticket.save()

#             # Update total_amount in the cart
#             instance.total_amount = sum(ticket.amount for ticket in instance.tickets.all())
#             instance.save()

#             return Response({"detail": "Ticket quantity and amount updated successfully."}, status=status.HTTP_200_OK)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#     def create(self, request, *args, **kwargs):
#         ticket_type_id = request.data.get('ticket_type')
#         quantity = int(request.data.get('quantity', 1))

#         ticket_type = TicketType.objects.get(pk=ticket_type_id)

#         if ticket_type.quantity_available >= quantity:
#             serializer = self.get_serializer(data=request.data)
#             serializer.is_valid(raise_exception=True)
#             serializer.save()

#             headers = self.get_success_headers(serializer.data)
#             return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

#         return Response({"error": "Not enough tickets available."}, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request, *args, **kwargs):
# # views.py (continued)
#         selected_ticket_id = kwargs.get('pk')
#         selected_ticket = SelectedTicket.objects.get(pk=selected_ticket_id)

#         # Update quantity and price in TicketType when a SelectedTicket is deleted
#         selected_ticket.ticket.quantity_available += selected_ticket.quantity
#         selected_ticket.ticket.save()

#         # Update quantity and status in Ticket
#         ticket = selected_ticket.ticket.ticket
#         ticket.quantity_available += selected_ticket.quantity
#         ticket.save()

#         # Remove the SelectedTicket from the user's cart
#         selected_ticket.cart.selected_tickets.remove(selected_ticket)

#         selected_ticket.delete()

#         return Response({"message": "SelectedTicket deleted successfully."}, status=status.HTTP_200_OK)
