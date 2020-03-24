from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import Files
from files import serializers
from blog_permissions.permissions import IsOwnerOrStaffUser, UserCanCreateOwnObject
from rest_framework.decorators import action


# Create your views here.
class FilesViewSet(viewsets.ModelViewSet):

    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, IsOwnerOrStaffUser, UserCanCreateOwnObject)

    queryset = Files.objects.all()
    serializer_class = serializers.FilesSerializer

    @action(detail=False, methods=['post'])
    def get_request(self, request):
        print("get request func in view")
        print(request)

    def get_queryset(self):
        """
        In listing page, return what you have access to
        """
        user = self.request.user

        if user.is_staff:
            return Files.objects.all()
        else:
            return Files.objects.filter(user=user.id)

    def get_serializer(self, *args, **kwargs):
        """
        This enables uploading multiple files at once!
        :param args:
        :param kwargs:
        :return: serializer
        """
        if "data" in kwargs:
            data = kwargs["data"]

            if isinstance(data, list):
                kwargs["many"] = True

        return super(FilesViewSet, self).get_serializer(*args, **kwargs)
