from rest_framework import viewsets, mixins
from rest_framework.authentication import TokenAuthentication
from .models import Posts
from posts import serializers
from blog_permissions.permissions import IsStaffUserOrReadOnly
from django.db.models import Count


class PostsViewSet(viewsets.GenericViewSet,
                   mixins.ListModelMixin,
                   mixins.CreateModelMixin,
                   mixins.RetrieveModelMixin,
                   mixins.UpdateModelMixin,
                   mixins.DestroyModelMixin):

    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsStaffUserOrReadOnly,)

    queryset = Posts.objects.all()
    serializer_class = serializers.PostsSerializer

    def get_queryset(self):
        return Posts.objects.annotate(
            total_likes=Count('postlikes'),
        )

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return serializers.PostsSerializerWithComments
        return serializers.PostsSerializer
