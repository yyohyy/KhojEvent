from django.urls import path
from .views import TicketDetails

urlpatterns = [
    path('<int:pk>/',TicketDetails.as_view(),name='ticket-detail'),
]