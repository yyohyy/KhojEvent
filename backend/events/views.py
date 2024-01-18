from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework import status
from .serializers import EventsSerializer
from events.models import Events
from .permissions import OrganiserCanUpdate

class GetRoutesView(APIView):
    def get(self, request):
        routes = [
            {'GET': '/events'},
            {'PATCH': '/events/id'},
            {'POST': '/create-event/'}
        ]
        return Response(routes)

class GetEventsView(APIView):
    def get(self, request):
        events = Events.objects.all()
        serializer = EventsSerializer(events, many=True)
        return Response(serializer.data)

#class GetEventDetailView(APIView):
    #def get(self, request, pk):
        #event = Events.objects.get(id=pk)
        #serializer = EventsSerializer(event, many=False)
        #return Response(serializer.data)

class PostEventCreateView(APIView):
    def post(self, request):
        serializer = EventsSerializer(data=request.data)
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
    
#class GoogleAPIProxy(APIView):
    #def get(self, request):
        # Handle Google API requests here
        # Make API requests using the 'requests' library
        # Return the response to the ReactJS frontend
        #return Response(data, status=status.HTTP_200_OK)

