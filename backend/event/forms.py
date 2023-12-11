from django.forms import ModelForm
from .models import Event 

class EventForm(ModelForm):
    class Meta:
        model = Event
        fields = ['name', 'description', 'venue', 'site_link','source_link', 'tags']