from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import Quizzes
from blog_permissions.permissions import CanSeeQuizIfQuizGroupIsPublic, UserCanCreateOwnObject
from quizzes import serializers
from django.db.models import Q


class QuizzesViewSet(viewsets.ModelViewSet):
    authentication_class = (TokenAuthentication,)
    permission_classes = (CanSeeQuizIfQuizGroupIsPublic, UserCanCreateOwnObject)
    queryset = Quizzes.objects.all()
    serializer_class = serializers.QuizzesSerializer

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return Quizzes.objects.all()
        else:
            # return your own quizzes or quizzes whose group is public
            return Quizzes.objects.filter(
                Q(user=user.id) | Q(quizgroups__is_public=True)
            )

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

        return super(QuizzesViewSet, self).get_serializer(*args, **kwargs)
