from django.urls import path
#from .views import GoogleAPIProxy
from .views import GetRoutesView, AllEventsView, EventCreateView, EventDetailsView , SearchView
urlpatterns = [
    path('routes/', GetRoutesView.as_view(), name='get_routes'),
    path('events/', AllEventsView.as_view(), name='get_events'),
    path('events/<str:pk>/', EventDetailsView.as_view(), name='get_event_detail'),
    path('create-event/', EventCreateView.as_view(), name='create_event'),
    path('search/', SearchView.as_view(), name='search-view'),
    # path('rate-event/<str:pk>/', RatingView.as_view(), name='rate_event'),
    # path('review-event/<str:pk>/', ReviewView.as_view(), name='review_event'),

    #path('google-api/', GoogleAPIProxy.as_view(), name='google-api'),
    
]
