from rest_framework import generics,status
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from .models import *
from .permissions import IsOwnerOrReadOnly,IsCartOwnerOrReadOnly
from .serializers import CartDetailsSerializer,SelectTicketSerializer,TicketSerializer

class TicketDetails(RetrieveUpdateDestroyAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes= [IsOwnerOrReadOnly]
    lookup_field = 'pk' 

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Ticket deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

class SelectTicketView(generics.ListCreateAPIView):
    serializer_class = SelectTicketSerializer

    def get_queryset(self):
        event_id = self.kwargs.get('event_id')
        return SelectedTicket.objects.filter(ticket__ticket__event_id=event_id)

class CartDetails(generics.RetrieveUpdateDestroyAPIView):
    queryset=Cart.objects.all()
    serializer_class=CartDetailsSerializer
    permission_classes= [IsCartOwnerOrReadOnly]
