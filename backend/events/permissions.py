from rest_framework import permissions
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated

class OrganiserCanCreate(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_organiser

class OrganiserCanUpdate(permissions.BasePermission):

    def has_permission(self, request, view):
        # Allow anyone to have read-only access (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True

     # Check if the user is an organizer
        return request.user and request.user.is_authenticated and request.user.is_organiser
    
    def has_object_permission(self, request, view, obj):
        # Check if the requesting user is the organizer of the event
        return obj.organizer.user == request.user

class AttendeeCanRate(permissions.BasePermission):
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return request.user and request.user.is_authenticated and request.user.is_attendee
    
    def has_object_permission(self, request, view, obj):
        return obj.attendee.user == request.user
    
class AttendeeCanReview(permissions.BasePermission):
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return request.user and request.user.is_authenticated and request.user.is_attendee
    
    def has_object_permission(self, request, view, obj):
        return obj.attendee.user == request.user
    