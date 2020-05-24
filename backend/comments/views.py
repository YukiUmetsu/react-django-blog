from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from .models import Comments
from comments import serializers
from blog_permissions.permissions import OwnerCanUpdateOrReadOnly


class CommentsViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (OwnerCanUpdateOrReadOnly,)
    queryset = Comments.objects.all()
    serializer_class = serializers.CommentsSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['depth'] = self.request.query_params.get('depth', 1)
        return context
