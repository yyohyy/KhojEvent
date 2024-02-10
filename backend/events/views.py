from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework import serializers
from django.http import Http404
from .serializers import EventSerializer, CategorySerializer, TagSerializer, InterestedSerializer, InterestedDetailSerializer, ReviewSerializer, RatingSerializer, EventImageSerializer
from events.models import Event, Tag, Category, Review, Rating, Interested, Attendee
from .permissions import OrganiserCanUpdate, OrganiserCanCreate, AttendeeCanView, AttendeeCanMark#, AttendeeCanRate, AttendeeCanReview




class GetRoutesView(APIView):
    def get(self, request):
        routes = [
            {'GET': '/events'},
            {'PATCH': '/events/id'},
            {'POST': '/create-event/'},
            {'GET':'/interested/id/'}
        ]
        return Response(routes)




class AllEventsView(ListAPIView):
    serializer_class= EventSerializer
    queryset=Event.objects.all()
    #permission_classes = [AttendeeCanView]



class EventCreateView(generics.CreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes= [OrganiserCanCreate]
    # lookup_field= 'pk'


    def post(self, request, *args, **kwargs):
        print(request.data)
        return super().post(request, *args, **kwargs)
    

class EventImageView(generics.RetrieveUpdateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventImageSerializer  




class EventDetailsView(generics.RetrieveAPIView):
    # http_method_names=['get','patch','delete']
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    #permission_classes = [AttendeeCanView]
    # lookup_field='pk'
   
   
   
class EventUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    #permission_classes = [OrganiserCanUpdate]


    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response("Item is successfully deleted!", status=status.HTTP_204_NO_CONTENT)
   
         

class SearchView(APIView):
    def get(self, request, *args, **kwargs):
        query = self.request.query_params.get('query', '')


        # Search in Event names, Category names, and Tag names
        event_results = Event.objects.filter(
            Q(name__icontains=query) |
            Q(category__name__icontains=query) |
            Q(tags__name__icontains=query)
        ).distinct()


        event_serializer = EventSerializer(event_results, many=True)


        return Response({
            'event_results': event_serializer.data,
        }, status=status.HTTP_200_OK)
       


class ToggleInterestAPIView(APIView):
    def post(self, request, **kwargs):
        event_id = kwargs.get('event_id')
        if event_id is not None:
            try:
                event = Event.objects.get(id=event_id)
                attendee = request.user.attendee
                interested, created = Interested.objects.get_or_create(
                    attendee=attendee,
                    event=event
                )
                if created:
                    # If the interested object is newly created, mark it
                    return Response({'success': True, 'message': 'Added to Interested'}, status=status.HTTP_201_CREATED)
                else:
                    # If the interested object already exists, delete it to remove the interest
                    interested.delete()
                    return Response({'success': True, 'message': 'Removed from Interested'}, status=status.HTTP_200_OK)
            except Event.DoesNotExist:
                return Response({'success': False, 'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'success': False, 'error': 'Event ID not provided'}, status=status.HTTP_400_BAD_REQUEST)



       
class InterestedListView(generics.ListAPIView):
    serializer_class = InterestedDetailSerializer
    # permission_classes = [IsAuthenticated] # You can add permissions here if needed

    def get_queryset(self):
        """
        Get the events marked as interested by the authenticated attendee.
        """
        attendee_id = self.kwargs.get('attendee_id')  # Fetching 'attendee_id' from URL kwargs
        attendee = self.request.user.attendee  # Fetching authenticated user's attendee

        # Filter Interested objects based on attendee_id and attendee
        return Interested.objects.filter(attendee_id=attendee_id, attendee=attendee)




class RatingView(generics.CreateAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    #permission_classes = [AttendeeCanRate]


    def perform_create(self, serializer):
        # Check if the user has already rated the event
        existing_rating = Rating.objects.filter(attendee=self.request.user.attendee, event=serializer.validated_data['event']).exists()
        if existing_rating:
            raise serializers.ValidationError("You have already rated this event.")


        # Automatically set the attendee based on the logged-in user
        serializer.save(attendee=self.request.user.attendee)
   


class ReviewView(generics.CreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    #permission_classes = [AttendeeCanReview]


    def perform_create(self, serializer):
        # Automatically set the attendee based on the logged-in user
         # Check if the user has already rated the event
        existing_review = Review.objects.filter(attendee=self.request.user.attendee, event=serializer.validated_data['event']).exists()
        if existing_review:
            raise serializers.ValidationError("You have already reviewed this event.")
           
        serializer.save(attendee=self.request.user.attendee)    
       

