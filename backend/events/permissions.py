from rest_framework import permissions

class OrganiserCanUpdate(permissions.BasePermission):
    """
    Custom permission to only allow organizers to edit events.
    """

    def has_permission(self, request, view):
        # Allow anyone to have read-only access (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True

        # Check if the user is an organizer
        return request.user and request.user.is_authenticated and request.user.is_organiser
