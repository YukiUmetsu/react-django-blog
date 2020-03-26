from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from .models import QuizOptions
from blog_permissions.permissions import CanSeeQOptionsIfPublicEditIfOwned
from quiz_options import serializers
from django.db.models import Q


class QuizOptionsViewSet(viewsets.ModelViewSet):
    authentication_class = (TokenAuthentication,)
    permission_classes = (CanSeeQOptionsIfPublicEditIfOwned,)
    queryset = QuizOptions.objects.all()
    serializer_class = serializers.QuizOptionsSerializer

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return QuizOptions.objects.all()
        else:
            # return quiz options whose quiz is your own or
            # quiz options whose quizzes belong to a public quiz group
            return QuizOptions.objects.filter(
                Q(quiz__user=user.id) | Q(quiz__quizgroups__is_public=True)
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

        return super(QuizOptionsViewSet, self).get_serializer(*args, **kwargs)
