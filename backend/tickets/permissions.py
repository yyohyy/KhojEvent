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
    def has_object_permission(self, request, view, obj):
        # Allow GET, HEAD or OPTIONS requests (read-only)
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Check if the user is the organizer of the event
        if obj.ticket.event.organiser.pk == request.user.pk:
            ticket_type_id = view.kwargs.get('pk')
            print(ticket_type_id)
            
            if ticket_type_id:
                # Check if there are any order items associated with the ticket type
                orders_exist = OrderItem.objects.filter(ticket__ticket_id=ticket_type_id).exists()
                print(orders_exist)
                return not orders_exist  # Return False if orders exist, True otherwise
            
            return False 
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