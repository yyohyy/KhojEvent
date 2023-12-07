
from rest_framework import generics
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from .models import *
from .serializers import UserSerializer, AttendeeSignUpSerializer, OrganiserSignUpSerializer,UserDetails, CurrentUserDetails

   
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

class CurrentUserDetails(RetrieveUpdateDestroyAPIView):
    serializer_class= CurrentUserDetails
    querset= User.objects.all()

class UserDetails(ListAPIView):
    serializer_class= UserDetails
    queryset=User.objects.all()

