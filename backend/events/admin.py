from django.contrib import admin

# Register your models here.
from .models import Event, Category, Review, Tag , Rating
admin.site.register(Event)
admin.site.register(Category)
admin.site.register(Review)
admin.site.register(Tag)
admin.site.register(Rating)