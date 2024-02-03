
from rest_framework import generics, status
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import *
from .permissions import IsOwnerOrReadOnly
from .serializers import AttendeeSignUpSerializer, OrganiserSignUpSerializer,AllUserDetails, UserDetailsSerializer, AttendeeSerializer, OrganiserSerializer,AttendeeDetailsSerializer,OrganiserDetailsSerializer

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
   
# class OrganiserSignUpView(generics.CreateAPIView):
#     serializer_class = OrganiserSignUpSerializer
#     permission_classes= [IsAuthenticated]
#     queryset= Organiser.objects.all()

#     def perform_create(self, serializer):
#         user = self.request.user
#         user.is_organiser = True 
#         user.save(update_fields=['is_organiser'])
        
#         serializer.save(user=user)

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