from django.urls import path
from . import views

urlpatterns=[
     path('events/', views.events, name="events"),
     path('eventdetail/<str:pk>/', views.eventdetail, name="eventdetail"),  #dynamic value,can be int, str, slug
     #path('create-event/', views.createEvent, name="create-event"),
     #path('update-event/<str:pk>/', views.updateEvent, name="update-event"),
     #path('delete-event/<str:pk>/', views.deleteEvent, name="delete-event"),
] 