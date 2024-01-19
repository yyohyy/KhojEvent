from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework import status
from .serializers import EventSerializer
from events.models import Event # Tag, Category
from .permissions import OrganiserCanUpdate, OrganiserCanCreate


class GetRoutesView(APIView):
    def get(self, request):
        routes = [
            {'GET': '/events'},
            {'PATCH': '/events/id'},
            {'POST': '/create-event/'}
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
    permission_classes= [OrganiserCanCreate]

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
    permission_classes = [OrganiserCanUpdate]

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