from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import Tickets
from blog_permissions.permissions import AnyoneCanCreateButReadEditOwnerOnly
from tickets import serializers


class TicketsViewSet(viewsets.ModelViewSet):
    authentication_class = (TokenAuthentication,)
    permission_classes = (AnyoneCanCreateButReadEditOwnerOnly,)
    queryset = Tickets.objects.all()
    serializer_class = serializers.TicketsSerializer

    def get_queryset(self):
        # needed to filter objects in list view since has_object_permission won't work in list view
        user = self.request.user

        if not user.is_authenticated:
            return []
        if user.is_staff:
            return Tickets.objects.all()
        else:
            return Tickets.objects.filter(user=user)
