from django.contrib import admin

# Register your models here.
from .models import Event, category, Review, Tag , Rating
admin.site.register(Event)
admin.site.register(category)
admin.site.register(Review)
admin.site.register(Tag)
admin.site.register(Rating)