from django.urls import path
from . import views

urlpatterns = [
    path('', views.getRoutes),
    path('events/', views.getEvents),
    path('event-detail/<str:pk>/', views.getEventdetail),
    path('create-event/', views.postEventCreate),
    path('update-event/<str:pk>/', views.putEventUpdate),
    path('delete-event/<str:pk>/', views.deleteEventDelete),
]