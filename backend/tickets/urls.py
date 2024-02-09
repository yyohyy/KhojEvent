from django.urls import path
from .views import *

urlpatterns = [
    path('<int:event_id>/',TicketDetails.as_view(),name='ticket-detail'),
    path('<int:event_id>/create/',CreateTicketView.as_view(),name='create-ticket'),
    path('<int:event_id>/delete/', TicketDeleteView.as_view(), name='ticket-delete'),
    path('cart/<int:attendee_id>/',CartDetails.as_view(),name='cart-detail'),
    path('select/<int:event_id>/',SelectTicketView.as_view(),name='select-tickets'),
    path('selected/<int:pk>/delete/', SelectedTicketDeleteView.as_view(), name='selected-ticket-delete'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    # path('payment/process/<int:pk>/', PaymentProcessView.as_view(), name='payment-process'),

]