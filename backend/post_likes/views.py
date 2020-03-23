from rest_framework import viewsets, mixins
from rest_framework.authentication import TokenAuthentication
from .models import PostLikes
from post_likes import serializers
from blog_permissions.permissions import PostLikesPermissions


class PostLikesViewSet(viewsets.GenericViewSet,
                       mixins.CreateModelMixin,
                       mixins.UpdateModelMixin):
    authentication_classes = []
    permission_classes = (PostLikesPermissions,)
    queryset = PostLikes.objects.all()
    serializer_class = serializers.PostLikesSerializer
