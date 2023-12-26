from django.urls import path
from . import views

urlpatterns=[
     path('events/', views.events, name="events"),
     path('eventdetail/<str:pk>/', views.eventdetail, name="eventdetail"),  #dynamic value,can be int, str, slug
] 