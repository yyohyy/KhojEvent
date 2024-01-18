from rest_framework import status
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from .models import *
from .permissions import IsOwnerOrReadOnly,IsCartOwnerOrReadOnly
from .serializers import CartSerializer,TicketSerializer

class TicketDetails(RetrieveUpdateDestroyAPIView):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes= [IsOwnerOrReadOnly]
    lookup_field = 'pk'  # Change this to your desired lookup field

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Ticket deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

class CartDetails(RetrieveUpdateDestroyAPIView):
    queryset = SelectedTickets.objects.all()
    serializer_class = CartSerializer
    permission_classes= [IsCartOwnerOrReadOnly]
    lookup_field = 'pk'