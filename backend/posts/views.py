from rest_framework import viewsets, mixins
from rest_framework.authentication import TokenAuthentication
from .models import Posts
from posts import serializers
from blog_permissions.permissions import IsStaffUserOrReadOnly


class PostsViewSet(viewsets.GenericViewSet,
                   mixins.ListModelMixin,
                   mixins.CreateModelMixin,
                   mixins.RetrieveModelMixin,
                   mixins.UpdateModelMixin,
                   mixins.DestroyModelMixin):

    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsStaffUserOrReadOnly,)

    """Manage post states in the database"""
    queryset = Posts.objects.all()
    serializer_class = serializers.PostsSerializer
