from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated

'''
class OrganiserCanCreate(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_organiser
    if not request.user.is_organiser:
            # If user is authenticated but not an organizer, raise PermissionDenied exception
            raise PermissionDenied("Only organizers can create events.")
'''
class IsOrganiser(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False  # If user is not authenticated, deny permission
        
        if not request.user.is_organiser:
            # If user is authenticated but not an organizer, raise PermissionDenied exception
            raise PermissionDenied("Only organizers has the permission")
        
        # If user is authenticated and is an organizer, grant permission
        return True



class OrganiserCanUpdate(permissions.BasePermission):


    def has_permission(self, request, view):
        # Allow anyone to have read-only access (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True


     # Check if the user is an organizer
        return request.user and request.user.is_authenticated and request.user.is_organiser
   
    def has_object_permission(self, request, view, obj):
        # Check if the requesting user is the organizer of the event
        #if request.method in permissions.SAFE_METHODS:
            #return True
       
        return obj.organiser.user == request.user
   
   
   
class IsAttendee(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_attendee
    
    def has_object_permission(self, request, view, obj):
        # Check if the requesting user is the organizer of the event
        #if request.method in permissions.SAFE_METHODS:
            #return True
       
        return obj.attendee.user == request.user



'''
class AttendeeCanMark(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_attendee



class AttendeeCanRate(permissions.BasePermission):
   
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
       
        return request.user and request.user.is_authenticated and request.user.is_attendee
   
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
       
        return obj.attendee.user == request.user
   
class AttendeeCanReview(permissions.BasePermission):
   
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
       
        return request.user and request.user.is_authenticated and request.user.is_attendee
   
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.attendee.user == request.user
        '''


