from rest_framework import viewsets, mixins
from rest_framework.authentication import TokenAuthentication
from .models import CustomUser
from django.contrib.auth import get_user_model
from blog_permissions.permissions import AdminCrudUserPermission
from users import serializers


class UsersViewSet(viewsets.ModelViewSet):

    authentication_class = (TokenAuthentication,)
    permission_classes = (AdminCrudUserPermission,)
    queryset = get_user_model().objects.all()
    serializer_class = serializers.UserSerializer

