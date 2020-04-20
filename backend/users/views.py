from rest_framework import viewsets, mixins
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth import get_user_model
from blog_permissions.permissions import AdminCrudUserPermission
from users import serializers
from rest_framework.response import Response


class UsersViewSet(viewsets.ModelViewSet):

    authentication_class = (TokenAuthentication,)
    permission_classes = (AdminCrudUserPermission,)
    queryset = get_user_model().objects.all()
    serializer_class = serializers.UserSerializer

    def retrieve(self, request, pk=None):
        """
        If provided 'pk' is "me" then return the current user.
        """
        if request.user and pk == 'me':
            return Response(serializers.UserSerializer(request.user).data)
        return super(UsersViewSet, self).retrieve(request, pk)

    def get_queryset(self):
        user = self.request.user
        if not user.is_staff:
            return get_user_model().objects.filter(id=user.id)
        return get_user_model().objects.all()
