from django.urls import path
from .views import CartDetails,TicketDetails

urlpatterns = [
    path('<int:pk>/',TicketDetails.as_view(),name='ticket-detail'),
    path('cart/<str:pk>/',CartDetails.as_view(),name='cart-detail'),
]