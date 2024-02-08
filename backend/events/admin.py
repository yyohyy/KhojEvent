from django.contrib import admin

# Register your models here.
from .models import Event, Category, Review, Tag , Rating, Interested, EventImage

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("organiser","name", "category", "start_date", "end_date", "start_time","end_time")
    
admin.site.register(Category)

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("event", "attendee","body")
    
admin.site.register(Tag)

@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ("event","attendee","stars")
    
@admin.register(Interested)
class InterestedAdmin(admin.ModelAdmin):
    list_display = ("event", "attendee", "is_interested")
    
@admin.register(EventImage)
class EventImageAdmin(admin.ModelAdmin):
    list_display = ("event", "image")
