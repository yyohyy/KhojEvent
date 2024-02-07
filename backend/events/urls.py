from django.urls import path
#from .views import GoogleAPIProxy
from .views import GetRoutesView, AllEventsView, EventCreateView, EventDetailsView , SearchView, InterestedView, InterestedDetailView#, RatingView, ReviewView
urlpatterns = [
    path('routes/', GetRoutesView.as_view(), name='get_routes'),
    path('events/', AllEventsView.as_view(), name='get_events'),
    path('events/<str:pk>/', EventDetailsView.as_view(), name='get_event_detail'),
    path('create-event/', EventCreateView.as_view(), name='create_event'),
    path('search/', SearchView.as_view(), name='search-view'),
    path('interested/', InterestedView.as_view(), name='interested-list'),
    path('interested-detail/<str:pk>/', InterestedDetailView.as_view(), name='interested-detail'),

    #path('interested/mark/<int:pk>/', MarkInterestView.as_view(), name='mark-interest'),
    #path('rate-event/<str:pk>/', RatingView.as_view(), name='rate_event'),
    #path('review-event/<str:pk>/', ReviewView.as_view(), name='review_event'),

    #path('google-api/', GoogleAPIProxy.as_view(), name='google-api'),
    
]
