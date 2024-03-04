from django.contrib import admin
from .models import *

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("organiser","name", "category", "start_date", "end_date", "start_time","end_time", "is_approved")
    list_filter = ["is_approved"]
    
admin.site.register(Category)

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("attendee","event","body")

admin.site.register(Tag)

@admin.register(Rating)
class RatingAdmin(admin.ModelAdmin):
    list_display = ("event","attendee","stars")
    
@admin.register(Interested)
class InterestedAdmin(admin.ModelAdmin):
    list_display = ("event", "attendee")

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ("content", "organiser","is_approved")    
    readonly_fields=("content","organiser")
    
