from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import BlacklistWords
from blog_permissions.permissions import IsStaffUser
from blacklist_words import serializers


class BlacklistWordsViewSet(viewsets.ModelViewSet):
    authentication_class = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, IsStaffUser)
    queryset = BlacklistWords.objects.all()
    serializer_class = serializers.BlacklistWordsSerializer

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

        return super(BlacklistWordsViewSet, self).get_serializer(*args, **kwargs)