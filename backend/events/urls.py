from django.urls import path
from .views import GetRoutesView, GetEventsView, PatchEventdetailView, PostEventCreateView

urlpatterns = [
    path('routes/', GetRoutesView.as_view(), name='get_routes'),
    path('events/', GetEventsView.as_view(), name='get_events'),
    path('events/<str:pk>/', PatchEventdetailView.as_view(), name='get_event_detail'),
    path('create-event/', PostEventCreateView.as_view(), name='create_event'),
    
]
