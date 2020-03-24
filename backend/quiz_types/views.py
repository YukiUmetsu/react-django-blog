from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from .models import QuizTypes
from quiz_types import serializers
from blog_permissions.permissions import IsStaffUserOrReadOnly


class QuizTypesViewSet(viewsets.ModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsStaffUserOrReadOnly,)
    queryset = QuizTypes.objects.all()
    serializer_class = serializers.QuizTypesSerializer

