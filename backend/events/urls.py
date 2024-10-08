from django.urls import path
from .views import *

urlpatterns = [
    #path('routes/', GetRoutesView.as_view(), name='get_routes'),
    path('events/', AllEventsView.as_view(), name='get_events'),
    path('events/<str:pk>/', EventDetailsView.as_view(), name='get_event_detail'),
    path('event-update/<str:pk>/', EventUpdateView.as_view(), name='event_update'),
    path('create-event/', EventCreateView.as_view(), name='create_event'),
    path('event/<int:pk>/image/',EventImageView.as_view(), name='event-image'),
   #path('create-tag/', TagCreateView.as_view(), name='create-tag'),    
    path('search/', SearchView.as_view(), name='search-view'),
    path('paid-events/', PaidEventView.as_view(), name='paid-event-list'),
    path('events/<int:event_id>/interested/', ToggleInterestAPIView.as_view(), name='toggle_interest'),
    path('interested-events/', GetInterestedEventsView.as_view(), name='interested_events'),
    path('interested-event/<int:event_id>/', GetInterestedEventView.as_view(), name='interested_event'),
    path('interested-detail/<int:attendee_id>/', InterestedListView.as_view(), name='interested-detail'),
    path('events/<int:event_id>/count/', InterestedCountView.as_view(), name='interested_event'),

    path('rate-event/', CreateRateView.as_view(), name='rate-event'),
    path('attendee-ratings/', AttendeeRatingsView.as_view(), name='attendee-ratings'),
    path('events/<int:event_id>/ratings/', GetAvgRatingsAPIView.as_view(), name='event_ratings'),
    path('event-ratings/<int:event_id>/', RateUpdateView.as_view(), name='event-ratings'),
    #path('rated-events/<int:event_id>/', GetEventRatingsAPIView.as_view(), name='event_ratings'),
    path('attendee-rated-events/<int:attendee_id>/', GetAttendeeRatedEventsAPIView.as_view(), name='attendee_rated_events'),

    path('reviews/', ReviewView.as_view(), name='review-list'),
    path('reviews/<int:event_id>/', ReviewRetrieveUpdateDestroyAPIView.as_view(), name='review-detail'),
    path('attendees/<int:attendee_id>/reviews/', AttendeeReviewedEventsAPIView.as_view(), name='attendee-reviewed-events'),
    #path('event/<int:event_id>/reviews/', EventReviewListView.as_view(), name='event_reviews'),
    path('organizer/reviews/<int:event_id>/', OrganizerReviewListView.as_view(), name='organizer_reviews'),
    path('events/<int:event_id>/ratings-and-reviews/', EventRatingsAndReviewsAPIView.as_view(), name='event_ratings_and_reviews'),

    path('testimonial/create/', CreateTestimonial.as_view(), name='create-testimonial'),
    path('testimonials/', ViewTestimonial.as_view(), name='testimonials'),

] 
