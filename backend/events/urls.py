from django.urls import path
from .views import GetRoutesView, AllEventsView, EventCreateView, EventDetailsView , SearchView, ToggleInterestAPIView, InterestedListView, EventUpdateView, EventImageView, CreateRateView, RateUpdateView, AttendeeRatingsView, GetInterestedEventsView, GetInterestedEventView


urlpatterns = [
    path('routes/', GetRoutesView.as_view(), name='get_routes'),
    path('events/', AllEventsView.as_view(), name='get_events'),
    path('events/<str:pk>/', EventDetailsView.as_view(), name='get_event_detail'),
    path('event-update/<str:pk>/', EventUpdateView.as_view(), name='event_update'),
    path('create-event/', EventCreateView.as_view(), name='create_event'),
    path('event/<int:pk>/image/',EventImageView.as_view(), name='event-image'),
   #path('create-tag/', TagCreateView.as_view(), name='create-tag'),    
    path('search/', SearchView.as_view(), name='search-view'),
    path('events/<int:event_id>/interested/', ToggleInterestAPIView.as_view(), name='toggle_interest'),
    path('interested-events/', GetInterestedEventsView.as_view(), name='interested_events'),
    path('interested-event/<int:event_id>/', GetInterestedEventView.as_view(), name='interested_event'),
    path('interested-detail/<int:attendee_id>/', InterestedListView.as_view(), name='interested-detail'),
    path('rate-event/', CreateRateView.as_view(), name='rate-event'),
    path('attendee-ratings/', AttendeeRatingsView.as_view(), name='attendee-ratings'),
    path('event-ratings/<int:event_id>/', RateUpdateView.as_view(), name='event-ratings'),

]