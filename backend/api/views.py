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
        {'POST':'/api/create-event/'},
        {'PUT':'/api/update-event/'},
        {'Delete':'/api/delete-event/'},
    ]
    
    return Response(routes)

@api_view(['GET'])
def getEvents(request):
    events = Events.objects.all()  #queries the events
    serializer = EventsSerializer(events, many=True)  #serializes the data
    return Response(serializer.data)

@api_view(['GET'])
def getEventdetail(request, pk):
    event = Events.objects.get(id=pk)  #queries the events
    serializer = EventsSerializer(event, many=False)  #serializes the data
    return Response(serializer.data)

@api_view(['POST'])
def postEventCreate(request):
    serializer = EventsSerializer(data=request.data)  #serializes the data
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(['PUT'])
def putEventUpdate(request, pk):
    event = Events.objects.get(id=pk)  #queries the events
    serializer = EventsSerializer(instance=event, data=request.data)  #serializes the data
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(['DELETE'])
def deleteEventDelete(request, pk):
    event = Events.objects.get(id=pk)  #queries the events
    event.delete()
    return Response("Item is successfully deleted!")



