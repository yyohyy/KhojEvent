from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import generics
from .permissions import IsAuthenticated
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
    #permission_classes= [OrganiserCanCreate]
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
<<<<<<< HEAD
    #permission_classes = [OrganiserCanUpdate]
=======
    #permission_classes = [AttendeeCanView]
>>>>>>> c716350fe4f8a167e75534bcc76317d4677edf32
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
       


class RatingView(APIView):
    def post(self, request):
        # Assuming the rating data is sent in the request body as JSON
        rating = request.data.get('rating')
        stars = request.data.get('stars')  # Get the stars data
        event_id = request.data.get('event_id')  # Assuming the event ID is also sent
        
        # Get the attendee from the request user
        attendee = request.user.attendee
        
        # Validate the data
        if rating is None or stars is None or event_id is None:
            return Response({'error': 'Rating data incomplete'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if the attendee has already rated the event
        existing_rating = Rating.objects.filter(event_id=event_id, attendee=attendee).first()
        if existing_rating:
            return Response({'error': 'Attendee has already rated this event'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create or update the event rating
        try:
            event_rating, created = Rating.objects.get_or_create(event_id=event_id, attendee=attendee)
            event_rating.rating = rating
            event_rating.stars = stars  # Assign stars value
            event_rating.save()
            return Response({'success': True, 'message': 'Rating added successfully'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        

class ToggleInterestAPIView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure that only authenticated users can access this endpoint
    
    def post(self, request, event_id, **kwargs):
        try:
            event = Event.objects.get(id=event_id)
            
            # Ensure that the user is authenticated before accessing the attendee attribute
            if not request.user.is_anonymous:
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
            else:
                return Response({'success': False, 'error': 'User is not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
                
        except Event.DoesNotExist:
            return Response({'success': False, 'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)



       
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



class ReviewView(APIView):
    def post(self, request, event_id):
        # Get the review body from the request data
        body = request.data.get('body')

        # Check if the body is empty
        if not body:
            return Response({"error": "Review text is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Get the logged-in user's attendee instance
        attendee = request.user.attendee

        # Get the event instance corresponding to the event_id
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Response({"error": "Event not found."}, status=status.HTTP_404_NOT_FOUND)

        # Check if the attendee has already reviewed this event
        existing_review = Review.objects.filter(attendee=attendee, event=event).exists()
        if existing_review:
            return Response({"error": "You have already reviewed this event."}, status=status.HTTP_400_BAD_REQUEST)

        # Create the review
        review = Review.objects.create(
            attendee=attendee,
            event=event,
            body=body
        )

        return Response({"message": "Review submitted successfully."}, status=status.HTTP_201_CREATED)

  
       

