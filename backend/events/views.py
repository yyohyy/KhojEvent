from django.db.models import Q, Avg
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveUpdateDestroyAPIView, get_object_or_404
from rest_framework.response import Response
from rest_framework import status, serializers, generics
from .serializers import *
from events.models import *
from .permissions import *
from users.models import User
from users.serializers import UserDetailsSerializer


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
    queryset = Event.objects.all()
    serializer_class = EventSerializer

   
   
   
class EventUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer


class SearchView(APIView):
    def get(self, request, *args, **kwargs):
        query = self.request.query_params.get('query', '')


        # Search in Event names, Category names, and Tag names
        event_results = Event.objects.filter(
            Q(name__icontains=query) |
            Q(category__name__icontains=query) |
            Q(tags__name__icontains=query)
        ).filter(is_approved=True).distinct()


        event_serializer = EventSerializer(event_results, many=True)


        return Response({
            'event_results': event_serializer.data,
        }, status=status.HTTP_200_OK)
     
        
        
class PaidEventView(ListAPIView):
    queryset = Event.objects.filter(is_paid=True, is_approved=True)
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
        

class ReviewRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filter reviews by the logged-in attendee
        return Review.objects.filter(attendee=self.request.user.attendee)

    def get_object(self):
        queryset = self.get_queryset()
        # Get the review based on the event_id
        obj = generics.get_object_or_404(queryset, event_id=self.kwargs["event_id"])
        self.check_object_permissions(self.request, obj)
        return obj

    def perform_update(self, serializer):
        serializer.save()

    def perform_destroy(self, instance):
        instance.delete()
     
'''
class EventReviewListView(APIView):
    def get(self, request, event_id):
        # Retrieve reviews for the specified event
        reviews = Review.objects.filter(event_id=event_id)
        
        # Serialize the reviews and return the response
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data) 
'''

class AttendeeReviewedEventsAPIView(APIView):
    def get(self, request, attendee_id):
        try:
            reviewed_events = Event.objects.filter(review__attendee_id=attendee_id)

            if reviewed_events.exists():
                event_data = []
                for event in reviewed_events:
                    review = Review.objects.filter(event=event, attendee_id=attendee_id).first()
                    if review:
                        event_serializer = EventSerializer(event)
                        event_dict = event_serializer.data
                        event_dict['review'] = review.body
                        event_data.append(event_dict)
                return Response({'success': True, 'reviewed_events': event_data}, status=status.HTTP_200_OK)
            else:
                return Response({'success': False, 'error': 'No events have been reviewed by the specified attendee'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'success': False, 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            

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


# class EventRatingsAndReviewsAPIView(APIView):
#     def get(self, request, event_id, **kwargs):
#             # Retrieve all ratings for the specified event
#             event_ratings = Rating.objects.filter(event_id=event_id)
#             # Retrieve reviews for the specified event
#             reviews = Review.objects.filter(event_id=event_id)
            
#             # Serialize the event ratings data
#             rating_serializer = RatingSerializer(event_ratings, many=True)
#             # Serialize the reviews
#             review_serializer = ReviewSerializer(reviews, many=True)
            
#             return Response({

#                 'event_ratings': rating_serializer.data,
#                 'event_reviews': review_serializer.data
#             }, status=status.HTTP_200_OK)
        
class EventRatingsAndReviewsAPIView(APIView):
    def get(self, request, event_id, **kwargs):
        # Retrieve all ratings for the specified event
        event_ratings = Rating.objects.filter(event_id=event_id)
        # Retrieve all reviews for the specified event
        reviews = Review.objects.filter(event_id=event_id)

        # Retrieve distinct attendees who have rated or reviewed the event
        distinct_attendees = set(event_ratings.values_list('attendee', flat=True)) | set(reviews.values_list('attendee', flat=True))

        # Create a list to store data for each attendee
        attendee_data = []
        for attendee_id in distinct_attendees:
            attendee_details = {'id': attendee_id, 'details': {'rating': None, 'review': None}}
            attendee_data.append(attendee_details)

        # Populate the list with ratings and reviews for each attendee
        for rating in event_ratings:
            for attendee_details in attendee_data:
                if attendee_details['id'] == rating.attendee.user.id:
                    attendee_details['details']['rating'] = rating.stars
                    break
        for review in reviews:
            for attendee_details in attendee_data:
                if attendee_details['id'] == review.attendee.user.id:
                    attendee_details['details']['review'] = review.body
                    break

        # Serialize the user details
        for attendee_details in attendee_data:
            user_id = attendee_details['id']
            user = User.objects.get(pk=user_id)  # Retrieve user object using user ID
            user_serializer = UserDetailsSerializer(user)
            attendee_details['details']['user_details'] = user_serializer.data

        return Response(attendee_data, status=status.HTTP_200_OK)
    
    

class InterestedCountView(APIView):
    #permission_classes = [IsAuthenticated]

    def get(self, request, event_id, **kwargs):
        try:
            # Get the specific event
            #event = get_object_or_404(Event, id=event_id)
            
            # Count the number of attendees interested in this event
            interested_count = Interested.objects.filter(event_id=event_id).count()

            # Serialize the event data
            #serializer = EventSerializer(event)

            return Response({'success': True, 'interested_count': interested_count}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'success': False, 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CreateTestimonial(generics.CreateAPIView):
    queryset = Testimonial.objects.all()
    serializer_class = CreateTestimonialSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(organiser=self.request.user.organiser)
   

class ViewTestimonial(generics.ListAPIView):
    queryset = Testimonial.objects.filter(is_approved=True)
    serializer_class = TestimonialSerializer