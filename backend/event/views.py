#for business logics
from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import Event
from .forms import EventForm


#def event(request):
    #return HttpResponse('here are the events')

def event(request):
    event = Event.objects.all
    context= {'event':event}
    return render(request,'event/event.html', context)     #rendering templates

#def eventdetail(request, pk):
    #return HttpResponse('eventdetail' + ' ' + str(pk)) 
    
def eventdetail(request, pk):       #pk is an id or primary key
    eventdetailObj = Event.objects.get(id=pk)
    return render(request, 'event/eventdetail.html', {'eventdetail':eventdetailObj}) 

def createEvent(request):
    form = EventForm()
     
    if request.method == 'POST':
        form = EventForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('event')
        
    context = {'form' : form}
    return render(request, "event/event_form.html", context)

def updateEvent(request, pk):
    eventdetail = Event.objects.get(id=pk)
    form = EventForm(instance=eventdetail)
     
    if request.method == 'POST':
        form = EventForm(request.POST, instance=eventdetail)
        if form.is_valid():
            form.save()
            return redirect('eventdetail')
        
    context = {'form' : form}
    return render(request, "event/event_form.html", context)

def deleteEvent(request, pk):
    eventdetail = Event.objects.get(id=pk)
    if request.method =="POST":
        eventdetail.delete()
        return redirect('event')
    context={'object': eventdetail}
    return render(request, 'event/delete_template.html', context)