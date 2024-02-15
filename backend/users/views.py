from django.shortcuts import get_object_or_404
from djoser.views import UserViewSet as DjoserUserViewSet
from rest_framework import generics, status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import *
from .permissions import IsOwnerOrReadOnly
from .serializers import *
from events.serializers import *
from tickets.models import *
from tickets.serializers import *



class CurrentUser(RetrieveUpdateAPIView):
    serializer_class = CurrentUserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Return the current user
        return self.request.user

    def get(self, request, *args, **kwargs):
        # Serialize the current user instance
        serializer = self.get_serializer(instance=self.get_object())
        # Return the serialized current user data
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        # Serialize the current user instance with data from request
        serializer = self.get_serializer(instance=self.get_object(), data=request.data)
        serializer.is_valid(raise_exception=True)
        # Save the updated user instance
        serializer.save()
        # Return the serialized updated user data
        return Response(serializer.data)


class AttendeeSignUpView(generics.CreateAPIView):
    serializer_class = AttendeeSignUpSerializer
    permission_classes= [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset= Attendee.objects.all()

def post(self, request, *args, **kwargs):
        user = self.request.user
        user.is_attendee = True
        user.save(update_fields=['is_attendee'])

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)   

class OrganiserSignUpView(generics.CreateAPIView):
    serializer_class = OrganiserSignUpSerializer
    permission_classes= [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    queryset= Organiser.objects.all()
    
def post(self, request, *args, **kwargs):
        user = self.request.user
        user.is_organiser = True
        user.save(update_fields=['is_organiser'])

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED) 
   
class AllUserDetails(ListAPIView):
    serializer_class= AllUserDetails
    queryset=User.objects.all()

class UserDetails(generics.RetrieveUpdateAPIView):
    permission_classes = [IsOwnerOrReadOnly]
    queryset = User.objects.all()
    lookup_field = 'pk'

    def get_serializer_class(self):
        user = self.get_object()
        if user:
            if user.is_attendee:
                return AttendeeDetailsSerializer
            elif user.is_organiser:
                return OrganiserDetailsSerializer
        return UserDetailsSerializer  # Provide a default serializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance is None:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer_class = self.get_serializer_class()
        
        if serializer_class is None:
            return Response({'error': 'Serializer class not found.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        serializer = serializer_class(instance, data=request.data, partial=kwargs.pop('partial', False))
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        response_data = {
            'message': 'DETAILS UPDATED.',
            'instance': serializer.data
        }
        return Response(response_data, status=status.HTTP_200_OK)
    
class OrganiserEventsView(generics.ListAPIView):

    serializer_class=EventSerializer

    def get_queryset(self):
        organiser_id=self.kwargs.get('organiser_id')
        return Event.objects.filter(organiser_id=organiser_id)
    
# class AttendeeEventsView(generics.ListAPIView):
#     serializer_class = EventSerializer

#     def get_queryset(self):
#         # Retrieve the attendee object
#         attendee_id = self.kwargs['attendee_id']
#         attendee = get_object_or_404(Attendee, pk=attendee_id)

#         # Retrieve events for which the attendee has placed an order
#         order_items = OrderItem.objects.filter(ticket__issued_to=attendee)
#         print(order_items)
#         event_ids = order_items.values_list('ticket__ticket__ticket__event__id', flat=True).distinct()
#         print(event_ids)
#         # Retrieve the events based on the event IDs
#         events = Event.objects.filter(id__in=event_ids)
#         return events

class UserSelectedTicketsDetails(generics.ListAPIView):
    serializer_class = SelectedTicketSerializer

    def get_queryset(self):
        user_id = self.kwargs['attendee_id']
        return SelectedTicket.objects.filter(issued_to_id=user_id)    
    
class PurchasedTicketsDetails(generics.ListAPIView):
    serializer_class = SelectedTicketSerializer

    def get_queryset(self):
        user_id = self.kwargs['attendee_id']
        return SelectedTicket.objects.filter(issued_to_id=user_id, status='CONFIRMED')    
    
class BookedTicketsDetails(generics.ListAPIView):
    serializer_class = SelectedTicketSerializer

    def get_queryset(self):
        user_id = self.kwargs['attendee_id']
        return SelectedTicket.objects.filter(issued_to_id=user_id, status__in=[ 'BOOKED', 'PROCESSING'])    
    
# class EventOrders(generics.ListAPIView):
#     serializer_class = OrderSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         # Retrieve the attendee based on the currently logged-in user
#         attendee = self.request.user.attendee

#         # Get event_id from URL parameter
#         event_id = self.kwargs.get('event_id')

#         # Filter orders for the given event and attendee
#         queryset = Order.objects.filter(cart__order__tickets__ticket__event_id=event_id, 
#                                          cart__order__tickets__issued_to=attendee)
#         return queryset    
    
class AttendedEvents(generics.ListAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Retrieve the attendee based on the currently logged-in user
        attendee = self.request.user.attendee

        # Get unique event IDs for the attendee's orders
        event_ids = SelectedTicket.objects.filter(issued_to=attendee).values_list('ticket__ticket__event_id', flat=True).distinct()

        # Retrieve events associated with the event IDs
        queryset = Event.objects.filter(id__in=event_ids)
        return queryset
