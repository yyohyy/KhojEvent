from rest_framework import permissions

class IsCurrentUser(permissions.BasePermission):
    def has_permission(self, request, view):
            return bool(request.user.is_authenticated and request.user.is_active and int(request.user.pk) == int(view.kwargs['pk']))

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view,obj):
        if request.method in permissions.SAFE_METHODS:
            return True  
        return obj.event.organiser.pk== request.user.pk
    
class IsCartOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view,obj):

        return obj.attendee.pk== request.user.pk    

    