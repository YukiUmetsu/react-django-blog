from rest_framework import viewsets, mixins
from rest_framework.authentication import TokenAuthentication
from .models import BlogConfig
from blog_config import serializers
from blog_permissions.permissions import IsStaffUserOrReadOnly


# Create your views here.
class BlogConfigViewSet(viewsets.GenericViewSet,
                        mixins.RetrieveModelMixin,
                        mixins.UpdateModelMixin):

    """Base viewset for user owned recipe attributes"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsStaffUserOrReadOnly,)

    """Manage tags in the database"""
    queryset = BlogConfig.objects.all()
    serializer_class = serializers.BlogConfigSerializer

