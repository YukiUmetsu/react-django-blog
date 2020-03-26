from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from .models import QuizGroups
from blog_permissions.permissions import CanSeeQuizGroupIfPublic, UserCanCreateOwnObject
from quiz_groups import serializers
from django.db.models import Q


class QuizGroupsViewSet(viewsets.ModelViewSet):
    authentication_class = (TokenAuthentication,)
    permission_classes = (CanSeeQuizGroupIfPublic, UserCanCreateOwnObject)
    queryset = QuizGroups.objects.all()
    serializer_class = serializers.QuizGroupsSerializer

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return QuizGroups.objects.all()
        else:
            # return your own quizzes or quizzes whose group is public
            return QuizGroups.objects.filter(
                Q(user=user.id) | Q(is_public=True)
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

        return super(QuizGroupsViewSet, self).get_serializer(*args, **kwargs)
