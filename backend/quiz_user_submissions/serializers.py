from rest_framework import serializers
from .models import QuizUserSubmissions


class QuizUserSubmissionsSerializer(serializers.ModelSerializer):

    class Meta:
        model = QuizUserSubmissions
        fields = "__all__"
        read_only_fields = ('id',)