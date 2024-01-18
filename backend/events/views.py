from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework import status
from .serializers import EventSerializer, RatingSerializer, ReviewSerializer
from events.models import Event, Rating, Review
from .permissions import OrganiserCanUpdate, AttendeeCanRate, AttendeeCanReview
from .permissions import IsAuthenticatedOrReadOnly, IsAuthenticated

class GetRoutesView(APIView):
    def get(self, request):
        routes = [
            {'GET': '/events'},
            {'PATCH': '/events/id'},
            {'POST': '/create-event/'},
            {'PATCH':'/rate-event/id'},
            {'PATCH':'/review-event/id'}
        ]
        return Response(routes)

class GetEventsView(APIView):
    def get(self, request):
        events = Event.objects.all()
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)

#class GetEventDetailView(APIView):
    #def get(self, request, pk):
        #event = Events.objects.get(id=pk)
        #serializer = EventsSerializer(event, many=False)
        #return Response(serializer.data)

class EventCreateView(APIView):
    def post(self, request):
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PatchEventdetailView(generics.RetrieveUpdateDestroyAPIView):
    # http_method_names=['get','patch','delete']
    queryset = Events.objects.all()
    serializer_class = EventsSerializer
    permission_classes = [OrganiserCanUpdate]

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response("Item is successfully deleted!", status=status.HTTP_204_NO_CONTENT)
    
    
class RatingView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Rating.objects.all()
    serializer_class = RatingSerializer
    permission_classes = [AttendeeCanReview, IsAuthenticatedOrReadOnly]
    
    
    def update(self, request, *args, **kwargs):
        # Your custom update logic here
        # Make sure to call the super method if you're extending the default behavior
        return super().update(request, *args, **kwargs)
    
    #def partial_update(self, request, *args, **kwargs):
        # Your partial update logic here
        # ...

        #return Response({"message": "Resource partially updated"}, status=200)

    #def delete(self, request, *args, **kwargs):
        #instance = self.get_object()
        #self.perform_destroy(instance)
        #return Response("Item is successfully deleted!", status=status.HTTP_204_NO_CONTENT)
 

class ReviewView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [AttendeeCanRate, IsAuthenticatedOrReadOnly]
    
#class GoogleAPIProxy(APIView):
    #def get(self, request):
        # Handle Google API requests here
        # Make API requests using the 'requests' library
        # Return the response to the ReactJS frontend
        #return Response(data, status=status.HTTP_200_OK)

