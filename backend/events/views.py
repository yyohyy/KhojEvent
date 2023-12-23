from django.shortcuts import render #, redirect
from django.http import HttpResponse
from .models import Events
#from .forms import EventForm

#def events(request):
    #return render(request, 'events/events.html')

#def eventdetail(request, pk):
    #return render(request, 'events/eventdetail.html')

#def events(request):
    #events = Events.objects.all
    #context= {'events':events}
    #return render(request,'events/events.html', context)     #rendering templates

def events(request):
    return HttpResponse('events') 

def eventdetail(request, pk):
    return HttpResponse('eventdetail' + ' ' + str(pk)) 
    
#def eventdetail(request, pk):       #pk is an id or primary key
    #eventdetailObj = Events.objects.get(id=pk)
    #return render(request, 'events/eventdetail.html', {'eventdetail':eventdetailObj}) 
#def createEvent(request):
    #form = EventForm()
     
    #if request.method == 'POST':
        #form = EventForm(request.POST)
        #if form.is_valid():
            #form.save()
            #return redirect('events')
        
    #context = {'form' : form}
    #return render(request, "events/event_form.html", context)

#def updateEvent(request, pk):
    #eventdetail = Events.objects.get(id=pk)
    #form = EventForm(instance=eventdetail)
     
    #if request.method == 'POST':
        #form = EventForm(request.POST, instance=eventdetail)
        #if form.is_valid():
            #form.save()
            #return redirect('events')
        
    #context = {'form' : form}
    #return render(request, "events/event_form.html", context)

#def deleteEvent(request, pk):
    #eventdetail = Events.objects.get(id=pk)
    #if request.method =="POST":
        #eventdetail.delete()
        #return redirect('events')
    #context={'object': eventdetail}
    #return render(request, 'events/delete_template.html', context) 