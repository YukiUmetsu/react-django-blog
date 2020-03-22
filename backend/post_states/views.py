from rest_framework import viewsets, mixins
from rest_framework.authentication import TokenAuthentication
from .models import PostStates
from post_states import serializers
from blog_permissions.permissions import IsStaffUserOrReadOnly


# Create your views here.
class PostStatesViewSet(viewsets.GenericViewSet,
                        mixins.ListModelMixin,
                        mixins.CreateModelMixin,
                        mixins.RetrieveModelMixin,
                        mixins.UpdateModelMixin,
                        mixins.DestroyModelMixin):

    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsStaffUserOrReadOnly,)

    """Manage post states in the database"""
    queryset = PostStates.objects.all()
    serializer_class = serializers.PostStatesSerializer
