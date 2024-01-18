
from rest_framework import generics, status
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import *
from .permissions import IsOwnerOrReadOnly
from .serializers import AttendeeSignUpSerializer, OrganiserSignUpSerializer,AllUserDetails, UserDetailsSerializer, AttendeeSerializer, OrganiserSerializer,AttendeeDetailsSerializer,OrganiserDetailsSerializer

   
class AttendeeSignUpView(generics.CreateAPIView):
    serializer_class = AttendeeSignUpSerializer
    permission_classes= [IsAuthenticated]
    queryset= Attendee.objects.all()

    def perform_create(self, serializer):
        user = self.request.user
        user.is_attendee = True 
        user.save(update_fields=['is_attendee'])
        serializer.save(user=user)
   
class OrganiserSignUpView(generics.CreateAPIView):
    serializer_class = OrganiserSignUpSerializer
    permission_classes= [IsAuthenticated]
    queryset= Organiser.objects.all()

    def perform_create(self, serializer):
        user = self.request.user
        user.is_organiser = True 
        user.save(update_fields=['is_organiser'])
        
        serializer.save(user=user)

class AllUserDetails(ListAPIView):
    serializer_class= AllUserDetails
    queryset=User.objects.all()

class UserDetails(generics.RetrieveUpdateAPIView):
    permission_classes=[IsOwnerOrReadOnly]
    queryset= User.objects.all()
    lookup_field = 'pk' 

    def get_serializer_class(self):
        user = self.get_object()
        if user.is_attendee:
            return AttendeeDetailsSerializer
        elif user.is_organiser:
            return OrganiserDetailsSerializer    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # Customize the response as needed
        response_data = {
            'message': 'DETAILS UPDATED.',
            'instance': serializer.data
        }
        return Response(response_data, status=status.HTTP_200_OK)