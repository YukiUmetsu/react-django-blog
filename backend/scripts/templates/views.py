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

    def get_queryset(self):
        # needed to filter objects in list view since has_object_permission won't work in list view
        user = self.request.user

        if user.is_staff:
            return Model__.objects.all()
        else:
            return Model__.objects.filter(user=user)
