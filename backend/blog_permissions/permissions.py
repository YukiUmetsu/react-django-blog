from rest_framework import permissions
from django.contrib.auth import get_user_model
from quizzes.models import Quizzes
from quiz_options.models import QuizOptions


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
        return bool(request.user.is_authenticated and request.user.is_staff)


class IsOwnerOrStaffUser(permissions.BasePermission):
    """
    You need to be the owner of the object or superuser to read or edit
    """

    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
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
            if not request.user.is_authenticated:
                return False

            if request.user.is_staff:
                return True

            if isinstance(request.data, list):
                results = [is_object_owned_by_user(target_obj.get('user'), request.user) for target_obj in request.data]
                return all(results)
            else:
                return is_object_owned_by_user(request.data.get('user'), request.user)

        return True


def is_object_owned_by_user(target_obj_user_id, user_email):
    logged_in_user = get_user_model().objects.filter(email=user_email)[0]
    return str(target_obj_user_id) == str(logged_in_user.id)


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


class PostLikesPermissions(permissions.BasePermission):
    """
    ip address and post are unique
    """

    def has_object_permission(self, request, view, obj):
        if request.method not in ["PUT", "PATCH"]:
            return True

        if request.user and obj.user:
            return obj.user == request.user
        else:
            return obj.ip_address == request.data.get('ip_address')


class CanSeeQuizIfQuizGroupIsPublic(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            # owner and staff can see. otherwise, quiz group has to be public.
            if request.user and request.user.is_staff:
                return True

            if obj.user == request.user:
                return True

            return self.is_quiz_group_public(obj)

        else:
            # owner or staff users can edit.
            if not request.user.is_authenticated:
                return False
            if request.user and request.user.is_staff:
                return True
            return obj.user == request.user

    def is_quiz_group_public(self, obj):
        if isinstance(obj, Quizzes):
            public_group_count = Quizzes.objects.get(id=obj.id).quizgroups_set.filter(is_public=True).count()
            return public_group_count > 0
        elif isinstance(obj, QuizOptions):
            quiz = QuizOptions.objects.get(id=obj.id).quiz
            if not quiz:
                return False
            public_group_count = Quizzes.objects.get(id=quiz.id).quizgroups_set.filter(is_public=True).count()
            return public_group_count > 0
        else:
            return False


class CanSeeQuizGroupIfPublic(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            # owner and staff can see. otherwise, quiz group has to be public.
            if request.user and request.user.is_staff:
                return True

            if obj.user == request.user:
                return True

            return obj.is_public

        else:
            # owner or staff users can edit.
            if not request.user.is_authenticated:
                return False
            if request.user and request.user.is_staff:
                return True
            return obj.user == request.user


class CanSeeQOptionsIfPublicEditIfOwned(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method == "POST":
            return self.check_create_permission(request)
        return True

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return self.check_read_permission(request, obj)
        else:
            return self.check_edit_permission(request, obj)

    def check_create_permission(self, request):
        if not request.user.is_authenticated:
            return False
        if request.user.is_staff:
            return True
        if isinstance(request.data, list):
            results = [self.is_quiz_owned_by_user(target_obj.get('quiz'), request.user) for target_obj in
                       request.data]
            return all(results)
        return self.is_quiz_owned_by_user(request.data.get('quiz'), request.user)

    def check_read_permission(self, request, obj):
        if request.user and request.user.is_staff:
            return True
        if self.is_quiz_owned_by_user(obj.quiz, request.user):
            return True
        return self.is_quiz_group_public(obj)

    def check_edit_permission(self, request, obj):
        if not request.user.is_authenticated:
            return False
        if request.user and request.user.is_staff:
            return True
        return self.is_quiz_owned_by_user(obj.quiz, request.user)

    def is_quiz_owned_by_user(self, quiz_obj, user):
        if quiz_obj is None:
            return False
        owner = None
        if isinstance(quiz_obj, (str, int)):
            owner = Quizzes.objects.get(id=quiz_obj).user
        if isinstance(quiz_obj, Quizzes):
            owner = Quizzes.objects.get(id=quiz_obj.id).user
        if owner is None:
            return False
        return str(owner) == str(user)

    def is_quiz_group_public(self, obj):
        if isinstance(obj, QuizOptions):
            quiz = QuizOptions.objects.get(id=obj.id).quiz
            if not quiz:
                return False
            public_group_count = Quizzes.objects.get(id=quiz.id).quizgroups_set.filter(is_public=True).count()
            return public_group_count > 0
        else:
            return False


class AnyoneCanCreateButReadEditOwnerOnly(permissions.BasePermission):

    def has_permission(self, request, view):
        is_post = request.method == 'POST'
        is_logged_in = request.user.is_authenticated
        obj = request.data
        obj_user_exist = obj.get('user') is not None
        if is_post and is_logged_in and obj_user_exist:
            return str(request.data.get('user')) == str(request.user.id)

        if not is_post and not request.user.is_authenticated:
            return False

        return True

    def has_object_permission(self, request, view, obj):

        if not request.user.is_authenticated:
            return False
        if request.user and request.user.is_staff:
            return True
        return obj.user == request.user


class AdminCrudUserPermission(permissions.BasePermission):
    # staff can create normal user but not other staff nor superuser

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if not request.user.is_staff:
            return False

        if request.method in permissions.SAFE_METHODS:
            return True

        # unsafe methods
        is_self_superuser = request.user.is_superuser
        is_new_user_staff = str(request.data['is_staff']).lower() == 'true'
        is_new_user_superuser = str(request.data['is_superuser']).lower() == 'true'

        if not is_new_user_staff and not is_new_user_superuser:
            return True

        if is_self_superuser:
            return True

        return False
