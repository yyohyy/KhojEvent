from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework import status
from django.db.models import Q
from .serializers import EventSerializer, CategorySerializer, TagSerializer, InterestedSerializer#, ReviewSerializer, RatingSerializer
from events.models import Event, Tag, Category, Review, Rating, Interested, Attendee
from .permissions import OrganiserCanUpdate, OrganiserCanCreate#, AttendeeCanRate, AttendeeCanReview

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

# class GetEventsView(APIView):
#     def get(self, request):
#         events = Event.objects.all()
#         serializer = EventSerializer(events, many=True)
#         return Response(serializer.data)

#class GetEventDetailView(APIView):
    #def get(self, request, pk):
        #event = Events.objects.get(id=pk)
        #serializer = EventsSerializer(event, many=False)
        #return Response(serializer.data)

class EventCreateView(generics.CreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    ##permission_classes= [OrganiserCanCreate]
    # lookup_field= 'pk'

    def post(self, request, *args, **kwargs):
        print(request.data)
        return super().post(request, *args, **kwargs)
    # def post(self, request):
    #     serializer = EventSerializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    # def post(self, request, *args, **kwargs):
    #     validated_data = request.data
    #     categories_data = validated_data.pop('categories', [])
    #     tags_data = validated_data.pop('tags', [])
    #     categories_instances = category.objects.get_or_create(categories_data)
    #     #print(categories_instances.pk)
    #     # Create or get Tag instances
    #     tags_instances = [Tag.objects.get_or_create(**tag_data)[0] for tag_data in tags_data]

    #     # Create the Event instance with the modified data
    #     event_instance = Event.objects.create(**validated_data)
    
    #     # Add the categories and tags to the Event instance
    #     event_instance.categories.set(categories_instances)
    #     event_instance.tags.set(tags_instances)
    #     return event_instance


class EventDetailsView(generics.RetrieveUpdateDestroyAPIView):
    # http_method_names=['get','patch','delete']
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    #permission_classes = [OrganiserCanUpdate]
    # lookup_field='pk'

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response("Item is successfully deleted!", status=status.HTTP_204_NO_CONTENT)
    
#class GoogleAPIProxy(APIView):
    #def get(self, request):
        # Handle Google API requests here
        # Make API requests using the 'requests' library
        # Return the response to the ReactJS frontend
        #return Response(data, status=status.HTTP_200_OK)
        
    
        
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

class InterestedView(generics.CreateAPIView):
    queryset = Attendee.objects.all()
    serializer_class = InterestedSerializer
    # permission_classes = [IsAuthenticated] # You may want to add permissions

    def post(self, request, *args, **kwargs):
        print(request.data)
        return super().post(request, *args, **kwargs)
        
        
class InterestedDetailView(generics.RetrieveDestroyAPIView):
    def get_queryset(self):
        """
        This method filters the queryset to only include entries related to the authenticated user's attendee.
        """
        user_attendee = self.request.user.attendee
        return Interested.objects.filter(attendee=user_attendee)
    
    serializer_class = InterestedSerializer
    
    
    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response("Item is successfully deleted!", status=status.HTTP_204_NO_CONTENT)

# Additional views for marking interest
#class MarkInterestView(generics.UpdateAPIView):
    #queryset = Interested.objects.all()
    #serializer_class = InterestedSerializer
    #permission_classes = [IsAuthenticated]

''''
class RatingView(generics.CreateAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [AttendeeCanRate]

    def perform_create(self, serializer):
        # Automatically set the attendee based on the logged-in user
        serializer.save(attendee=self.request.user.attendee)
        
class ReviewView(generics.CreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [AttendeeCanReview]

    def perform_create(self, serializer):
        # Automatically set the attendee based on the logged-in user
        serializer.save(attendee=self.request.user.attendee)
    '''
    
    
'''
class InterestedView(APIView):
    queryset = Interested.objects.all()
    serializer_class = InterestedSerializer
    
    def perform_create(self, serializer):
        serializer.save(attendee=self.request.user.attendee)  
    
    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.serializer_class(instance)
        return Response(serializer.data)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response("Item is successfully deleted!", status=status.HTTP_204_NO_CONTENT)
        
'''

