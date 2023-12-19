from django.forms import ModelForm
from .models import Events

class EventForm(ModelForm):
    class Meta:
        model = Events
        fields = ['name', 'description', 'venue', 'site_link','source_link', 'tags']