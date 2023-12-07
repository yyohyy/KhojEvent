from django.urls import path
from .views import AttendeeSignUpView, OrganiserSignUpView, UserDetails
#from rest_framework_simplejwt.


urlpatterns = [
    path('attendee/',AttendeeSignUpView.as_view()),
    path('organiser/',OrganiserSignUpView.as_view()),
    path('details/',UserDetails.as_view() ),

]