from django.urls import path
from .views import AttendeeSignUpView, OrganiserSignUpView, OrganiserEventsView, UserDetails, AllUserDetails
#from rest_framework_simplejwt.


urlpatterns = [
    path('attendee/',AttendeeSignUpView.as_view()),
    path('organiser/',OrganiserSignUpView.as_view()),
    path('organiser/<int:organiser_id>/events/',OrganiserEventsView.as_view() ),
    path('details/',AllUserDetails.as_view() ),
    path('details/<int:pk>/', UserDetails.as_view(), name='user-details'),
    
]