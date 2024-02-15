from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.response import Response
from rest_framework import generics
from django.db.models import Avg
from .permissions import IsAuthenticated
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework import serializers
from tickets.models import SelectedTicket
from django.http import Http404
from .serializers import EventSerializer, CategorySerializer, TagSerializer, InterestedSerializer, InterestedDetailSerializer, ReviewSerializer, RatingSerializer, EventImageSerializer
from events.models import Event, Tag, Category, Review, Rating, Interested, Attendee, Organiser
from .permissions import OrganiserCanUpdate, IsOrganiser, IsAttendee#, AttendeeCanMark, AttendeeCanRate, AttendeeCanReview



class AllEventsView(ListAPIView):
    serializer_class = EventSerializer
    
    def get_queryset(self):
        # Filter events to only include those that are approved
        return Event.objects.filter(is_approved=True)



class EventCreateView(CreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        organiser = request.user.organiser

        serializer.validated_data['organiser'] = organiser

        # Set is_approved to False for events created by regular users
        serializer.validated_data['is_approved'] = False

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    

    
    
class EventImageView(generics.RetrieveUpdateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventImageSerializer  




class EventDetailsView(generics.RetrieveAPIView):
    # http_method_names=['get','patch','delete']
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    #permission_classes = [IsAttendee]
    # lookup_field='pk'
   
   
   
class EventUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    #permission_classes = [OrganiserCanUpdate]


    #def delete(self, request, *args, **kwargs):
        #instance = self.get_object()
        #self.perform_destroy(instance)
        #return Response("Item is successfully deleted!", status=status.HTTP_204_NO_CONTENT)
'''      
class RateEventAPIView(generics.CreateAPIView):
    queryset = Event.objects.all()  # Specify the queryset for the view
    serializer_class = RatingSerializer  # Specify the serializer class for the view

    def create(self, request, *args, **kwargs):
        event_id = kwargs.get('event_id')
        rating = request.data.get('rating')
        
        if rating is not None:
            try:
                rating_value = float(rating)
                if 0 <= rating_value <= 5:  # Assuming ratings are between 0 and 5
                    event = self.get_object()
                    event.rating = rating_value 
                    event.save()

                    serializer = self.get_serializer(event)
                    return Response({'event': serializer.data})
                else:
                    return Response({'error': 'Rating value must be between 0 and 5'}, status=status.HTTP_400_BAD_REQUEST)
            except ValueError:
                return Response({'error': 'Invalid rating value'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Rating value is missing'}, status=status.HTTP_400_BAD_REQUEST)
'''
    

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
     
        
        
class PaidEventView(ListAPIView):
    queryset = Event.objects.filter(is_paid=True)
    serializer_class = EventSerializer


        
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



class GetInterestedEventsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, **kwargs):
        try:
            # Get the attendee associated with the current authenticated user
            attendee = request.user.attendee

            # Retrieve all events marked as interested by the attendee
            interested_events = Event.objects.filter(interested__attendee=attendee)

            # Serialize the interested events data if needed
            # Example assuming you have a serializer for Event model
            serializer = EventSerializer(interested_events, many=True)
    
            return Response({'success': True, 'interested_events': serializer.data}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'success': False, 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)



class GetInterestedEventView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, event_id, **kwargs):
        try:
            # Get the attendee associated with the current authenticated user
            attendee = request.user.attendee

            # Retrieve the specific event marked as interested by the attendee based on event ID
            interested_event = Event.objects.filter(id=event_id, interested__attendee=attendee).first()

            if interested_event:
                # Serialize the interested event data
                serializer = EventSerializer(interested_event)
                return Response({'success': True, 'interested_event': serializer.data}, status=status.HTTP_200_OK)
            else:
                return Response({'success': False, 'error': 'Event not found or not marked as interested by the attendee'}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({'success': False, 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)   
        
        
          
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



class CreateRateView(generics.CreateAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    #permission_classes = [IsAttendee]

    def perform_create(self, serializer):
        # Check if the user has already rated the event
        existing_rating = Rating.objects.filter(attendee=self.request.user.attendee, event=serializer.validated_data['event']).exists()
        if existing_rating:
            raise serializers.ValidationError("You have already rated this event.")

        # Automatically set the attendee based on the logged-in user
        serializer.save(attendee=self.request.user.attendee)



class AttendeeRatingsView(generics.ListAPIView):
    serializer_class = RatingSerializer
    permission_classes = [IsAttendee]


    def get_queryset(self):
        # Retrieve ratings rated by the logged-in attendee
        attendee = self.request.user.attendee
        return Rating.objects.filter(attendee=attendee) 



class RateUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = RatingSerializer
    permission_classes = [IsAttendee]

    def get_object(self):
        # Retrieve the rating for the specific event and attendee
        event_id = self.kwargs['event_id']
        attendee = self.request.user.attendee
        obj, created = Rating.objects.get_or_create(event_id=event_id, attendee=attendee)
        return obj

    def update(self, request, *args, **kwargs):
        # Update the rating
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
    
    
class GetEventRatingsAPIView(APIView):
    #permission_classes = [IsAttendee]

    def get(self, request, event_id, **kwargs):
        try:
            # Retrieve all ratings for the specified event
            event_ratings = Rating.objects.filter(event_id=event_id)

            if event_ratings.exists():
                # Serialize the event ratings data
                serializer = RatingSerializer(event_ratings, many=True)
                return Response({'success': True, 'event_ratings': serializer.data}, status=status.HTTP_200_OK)
            else:
                return Response({'success': False, 'error': 'No ratings found for the specified event'}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({'success': False, 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
  
  
  
  
class GetAvgRatingsAPIView(APIView):
    #permission_classes = [IsOrganiser]

    def get(self, request, event_id, **kwargs):
        try:
            # Retrieve all ratings for the specified event
            event_ratings = Rating.objects.filter(event_id=event_id)

            if event_ratings.exists():
                # Calculate the average rating
                avg_rating = event_ratings.aggregate(Avg('stars'))['stars__avg']
                if avg_rating is not None:
                    return Response({'success': True, 'average_rating': avg_rating}, status=status.HTTP_200_OK)
                else:
                    return Response({'success': False, 'error': 'No ratings found for the specified event'}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({'success': False, 'error': 'No ratings found for the specified event'}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            return Response({'success': False, 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST) 
    
    
    
    
class GetAttendeeRatedEventsAPIView(APIView):
    #permission_classes = [IsOrganiser]

    def get(self, request, attendee_id, **kwargs):
        try:
            # Retrieve all events rated by the specified attendee
            rated_events = Event.objects.filter(rating__attendee_id=attendee_id)

            if rated_events.exists():
                event_data = []
                for event in rated_events:
                    rating = Rating.objects.filter(event=event, attendee_id=attendee_id).first()
                    if rating:
                        event_serializer = EventSerializer(event)
                        event_dict = event_serializer.data
                        event_dict['rating'] = rating.stars
                        event_data.append(event_dict)
                return Response({'success': True, 'rated_events': event_data}, status=status.HTTP_200_OK)
            else:
                return Response({'success': False, 'error': 'No events have been rated by the specified attendee'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'success': False, 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        

class ReviewView(generics.CreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    

    def perform_create(self, serializer):
                # Check if the user has already rated the event
        existing_review = Review.objects.filter(attendee=self.request.user.attendee, event=serializer.validated_data['event']).exists()
        if existing_review:
            raise serializers.ValidationError("You have already rated this event.")
        serializer.save(attendee=self.request.user.attendee)
        
'''
class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReviewSerializer
    lookup_url_kwarg = 'event_id'  # Specify the lookup URL keyword argument
    
    def get_queryset(self):
        # Get the event ID from the URL parameter
        event_id = self.kwargs['event_id']
        # Filter reviews by the event ID
        return Review.objects.filter(event_id=event_id)
'''


class ReviewDetailView(APIView):

    def get(self, request, event_id=None):
        if event_id is not None:
            reviews = Review.objects.filter(event_id=event_id)
        else:
            reviews = Review.objects.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    def put(self, request, event_id):
        try:
            review = Review.objects.get(event_id=event_id)
        except Review.DoesNotExist:
            raise Http404
        serializer = ReviewSerializer(review, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, event_id):
        try:
            review = Review.objects.get(event_id=event_id)
        except Review.DoesNotExist:
            raise Http404
        review.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
     

class EventReviewListView(APIView):
    def get(self, request, event_id):
        # Retrieve reviews for the specified event
        reviews = Review.objects.filter(event_id=event_id)
        
        # Serialize the reviews and return the response
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data) 


class AttendeeReviewedEventsAPIView(APIView):
    def get(self, request, attendee_id):
        #try:
            # Retrieve all reviews given by the specified attendee
            reviews = Review.objects.filter(attendee_id=attendee_id)

            # Serialize the reviews data
            review_serializer = ReviewSerializer(reviews, many=True)
            
            # Extract the events associated with these reviews
            #reviewed_events = [review.event for review in reviews]

            # Serialize the reviewed events data
            #event_serializer = EventSerializer(reviewed_events, many=True)
            
            return Response({
                #'success': True,
                #'reviewed_events': event_serializer.data,
                'reviews': review_serializer.data
            }, status=status.HTTP_200_OK)
        
        #except Exception as e:
            #return Response({'success': False, 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            

class OrganizerReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    
    def get_queryset(self):
        # Get the organizer associated with the current user
        organiser = self.request.user.organiser
        
        # Get the event id from the URL parameters
        event_id = self.kwargs.get('event_id')
        
        # Check if the organizer owns the event
        event = get_object_or_404(Event, id=event_id, organiser=organiser)
        
        # Get reviews for the specified event
        reviews = Review.objects.filter(event=event).select_related('attendee')
        
        # Return reviews along with attendee information
        return reviews

