from rest_framework import permissions
from .models import *
from events.models import Event

class IsCurrentUser(permissions.BasePermission):
    def has_permission(self, request, view):
            return bool(request.user.is_authenticated and request.user.is_active and int(request.user.pk) == int(view.kwargs['pk']))


class IsOrganiserOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        event_id = view.kwargs.get('event_id')
        event = Event.objects.get(id=event_id)
        return event.organiser.pk==request.user.pk


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view,obj):
        if request.method in permissions.SAFE_METHODS:
            return True  
        return obj.event.organiser.pk== request.user.pk

class DeletionPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        ticket_type_id = view.kwargs.get('pk')
        if ticket_type_id:
            # Check if there are any SelectedTickets associated with the TicketType
            selected_tickets_exist = SelectedTicket.objects.filter(ticket_id=ticket_type_id).exists()
            # If there are SelectedTickets, check if any of them are associated with orders
            if selected_tickets_exist:
                orders_exist = Order.objects.filter(cart__selected_tickets__ticket_id=ticket_type_id).exists()
                return not orders_exist  # Return False if orders exist, True otherwise
        return True  # If no TicketType ID or no SelectedTickets, allow deletion

class IsCartOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view,obj):

        return obj.attendee.pk== request.user.pk    

class IsSelectedTicketOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions are only allowed to the owner of the selected ticket
        return obj.issued_to.pk == request.user.pk  