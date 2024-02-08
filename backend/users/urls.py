from django.urls import path
from .views import *
#from rest_framework_simplejwt.


urlpatterns = [
    path('attendee/',AttendeeSignUpView.as_view()),
    path('attendee/<int:attendee_id>/events/',AttendeeEventsView.as_view() ),
    path('organiser/',OrganiserSignUpView.as_view()),
    path('organiser/<int:_id>/events/',OrganiserEventsView.as_view() ),
    path('me/', CurrentUser.as_view()),
    path('details/',AllUserDetails.as_view() ),
    path('details/<int:pk>/', UserDetails.as_view(), name='user-details'),
    
]