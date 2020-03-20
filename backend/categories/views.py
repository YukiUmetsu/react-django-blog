from rest_framework import viewsets, mixins
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Categories
from categories import serializers
from blog_permissions.permissions import IsSuperUserOrReadOnly


# Create your views here.
class CategoriesViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.CreateModelMixin):
    """Base viewset for user owned recipe attributes"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsSuperUserOrReadOnly,)

    """Manage tags in the database"""
    queryset = Categories.objects.all()
    serializer_class = serializers.CategoriesSerializer

