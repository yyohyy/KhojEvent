from django.urls import path
from .views import *


urlpatterns = [
    path('attendee/',AttendeeSignUpView.as_view()),
    path('organiser/',OrganiserSignUpView.as_view()),

    path('me/', CurrentUser.as_view()),
    path('details/',AllUserDetails.as_view() ),
    path('details/<int:pk>/', UserDetails.as_view(), name='user-details'),

    path('<int:organiser_id>/events/',OrganiserEventsView.as_view() ),

    path('<int:attendee_id>/tickets/', UserSelectedTicketsDetails.as_view(), name='alltickets'),
    path('<int:attendee_id>/tickets/selected/', BookedTicketsDetails.as_view(), name='booked-tickets'),
    path('<int:attendee_id>/tickets/purchased/', PurchasedTicketsDetails.as_view(), name='confirmed-tickets'),
    path('events/', AttendedEvents.as_view(), name='attendee_event_orders'),
]
    
