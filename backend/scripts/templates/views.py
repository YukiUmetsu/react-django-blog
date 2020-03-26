from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import Model__
from blog_permissions.permissions import IsOwnerOrStaffUser
from app_name__ import serializers


class Model__ViewSet(viewsets.ModelViewSet):
    authentication_class = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, IsOwnerOrStaffUser)
    queryset = Model__.objects.all()
    serializer_class = serializers.Model__Serializer
