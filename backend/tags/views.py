from rest_framework import viewsets, mixins
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import Tags
from tags import serializers
from blog_permissions.permissions import IsOwnerOrStaffUser, UserCanCreateOwnObject


# Create your views here.
class TagsViewSet(viewsets.GenericViewSet,
                  mixins.ListModelMixin,
                  mixins.CreateModelMixin,
                  mixins.UpdateModelMixin,
                  mixins.RetrieveModelMixin,
                  mixins.DestroyModelMixin):

    """Base viewset for user owned recipe attributes"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, IsOwnerOrStaffUser, UserCanCreateOwnObject)

    """Manage tags in the database"""
    queryset = Tags.objects.all()
    serializer_class = serializers.TagsSerializer
