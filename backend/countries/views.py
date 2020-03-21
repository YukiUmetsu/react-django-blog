from rest_framework import viewsets, mixins
from rest_framework.authentication import TokenAuthentication
from .models import Countries
from countries import serializers
from blog_permissions.permissions import IsStaffUserOrReadOnly


# Create your views here.
class CountriesViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.CreateModelMixin):
    """Base viewset for user owned recipe attributes"""
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsStaffUserOrReadOnly,)

    """Manage tags in the database"""
    queryset = Countries.objects.all()
    serializer_class = serializers.CountriesSerializer

