from django.urls import path
#from .views import GoogleAPIProxy
from .views import GetRoutesView, GetEventsView, PostEventCreateView #, RatingView, ReviewView, GetEventDetailView

urlpatterns = [
    path('routes/', GetRoutesView.as_view(), name='get_routes'),
    path('events/', GetEventsView.as_view(), name='get_events'),
   # path('events/<str:pk>/', GetEventDetailView.as_view(), name='get_event_detail'),
    path('create-event/', PostEventCreateView.as_view(), name='create_event'),
    # path('rate-event/<str:pk>/', RatingView.as_view(), name='rate_event'),
    # path('review-event/<str:pk>/', ReviewView.as_view(), name='review_event'),

    #path('google-api/', GoogleAPIProxy.as_view(), name='google-api'),
    
]
