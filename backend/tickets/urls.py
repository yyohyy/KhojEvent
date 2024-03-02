from django.urls import path
from .views import *

urlpatterns = [
    path('<int:event_id>/',TicketDetails.as_view(),name='ticket-detail'),
    path('<int:event_id>/create/',CreateTicketView.as_view(),name='create-ticket'),
    path('<int:event_id>/delete/', TicketDeleteView.as_view(), name='ticket-delete'),
    path('cart/<int:attendee_id>/',CartDetails.as_view(),name='cart-detail'),
    path('cart/<int:id>/update/',SelectedTicketDetails.as_view(),name='selected-ticket'),
    path('select/<int:event_id>/',SelectTicketView.as_view(),name='select-tickets'),
    path('selected/<int:ticket_id>/delete/', SelectedTicketDeleteView.as_view(), name='selected-ticket-delete'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('payment/<int:pk>/', PaymentView.as_view(), name='payment'),
    path('orders/<int:pk>/',OrderDetails.as_view(),name='order'),
    path('<int:event_id>/orders/<int:attendee_id>/', AttendeeEventOrders.as_view(), name='attendee_event_orders'),
    path('orders/<int:order_id>/download_receipt/', DownloadReceipt.as_view(), name='download_receipt'),
    path('orders/<int:order_id>/view_receipt/', ViewReceipt.as_view(), name='view_receipt'),
]