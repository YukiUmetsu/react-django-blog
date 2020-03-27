from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import QuizUserSubmissions
from blog_permissions.permissions import IsOwnerOrStaffUser, UserCanCreateOwnObject
from quiz_user_submissions import serializers


class QuizUserSubmissionsViewSet(viewsets.ModelViewSet):
    authentication_class = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, IsOwnerOrStaffUser, UserCanCreateOwnObject)
    queryset = QuizUserSubmissions.objects.all()
    serializer_class = serializers.QuizUserSubmissionsSerializer

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return QuizUserSubmissions.objects.all()
        else:
            return QuizUserSubmissions.objects.filter(user=user)


    def get_serializer(self, *args, **kwargs):
        """
        This enables creating multiple objects at once!
        :param args:
        :param kwargs:
        :return: serializer
        """
        if "data" in kwargs:
            data = kwargs["data"]

            if isinstance(data, list):
                kwargs["many"] = True

        return super(QuizUserSubmissionsViewSet, self).get_serializer(*args, **kwargs)