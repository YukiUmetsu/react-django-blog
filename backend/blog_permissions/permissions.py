from rest_framework import permissions
from django.contrib.auth import get_user_model


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the snippet.
        return obj.user == request.user


class IsSuperUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_superuser)


class IsStaffUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_staff)


class IsSuperUserOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admin users to edit it.
    """

    def has_permission(self, request, view):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the snippet.
        return bool(request.user and request.user.is_superuser)


class IsStaffUserOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admin users to edit it.
    """

    def has_permission(self, request, view):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the snippet.
        return bool(request.user and request.user.is_staff)


class IsOwnerOrStaffUser(permissions.BasePermission):
    """
    You need to be the owner of the tag or superuser to read or edit
    """

    def has_object_permission(self, request, view, obj):
        if request.user is None:
            return False
        if request.user and request.user.is_staff:
            return True

        return obj.user == request.user


class UserCanCreateOwnObject(permissions.BasePermission):
    """
    You can only create your own object, not other people's object
    """

    def has_permission(self, request, view):
        if request.method == 'POST':
            if request.user is None:
                return False

            if request.user.is_staff:
                return True

            logged_in_user = get_user_model().objects.filter(email=request.user)[0]
            return str(request.data['user']) == str(logged_in_user.id)

        return True


class OwnerCanUpdateOrReadOnly(permissions.BasePermission):
    """
    Anyone can read and create
    Only owner can update
    Owner and Staff users can delete
    """
    def has_object_permission(self, request, view, obj):
        if request.method in ["PUT", "PATCH"]:
            return obj.user == request.user

        if request.method == "DELETE":
            if request.user.is_staff:
                return True
            return obj.user == request.user

        return True
