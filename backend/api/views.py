from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import EventsSerializer
from events.models import Events

@api_view(['GET']) 
def getRoutes(request):
    routes = [
        {'GET':'/api/events'},
        {'GET':'/api/events/id'},
        {'POST':'/api/events/id/vote'},
    ]
    
    return Response(routes)

@api_view(['GET'])
def getEvents(request):
    events = Events.objects.all()  #queries the events
    serializer = EventsSerializer(events, many=True)  #serializes the data
    return Response(serializer.data)

@api_view(['GET'])
def getEvent(request, pk):
    event = Events.objects.get(id=pk)  #queries the events
    serializer = EventsSerializer(event, many=False)  #serializes the data
    return Response(serializer.data)