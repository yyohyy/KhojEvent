
from rest_framework import generics
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from .models import *
from .permissions import IsCurrentUser
from .serializers import AttendeeSignUpSerializer, OrganiserSignUpSerializer,AllUserDetails, UserDetails

   
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

# class CurrentUserDetails(RetrieveUpdateDestroyAPIView):
#     serializer_class= CurrentUserDetails
#     queryset= User.objects.all()


# class PatchEventdetailView(generics.RetrieveUpdateDestroyAPIView):
#     # http_method_names=['get','patch','delete']
#     queryset = Events.objects.all()
#     serializer_class = EventsSerializer
#     permission_classes = [OrganiserCanUpdate]

#     def delete(self, request, *args, **kwargs):
#         instance = self.get_object()
#         self.perform_destroy(instance)
#         return Response("Item is successfully deleted!", status=status.HTTP_204_NO_CONTENT)    

class AllUserDetails(ListAPIView):
    serializer_class= AllUserDetails
    queryset=User.objects.all()

class UserDetails(generics.RetrieveUpdateAPIView):
    serializer_class = UserDetails
    permission_classes=[IsCurrentUser]
    queryset= User.objects.all()
    lookup_field = 'pk' 

