from rest_framework import serializers
from .models import Quizzes


class QuizzesSerializer(serializers.ModelSerializer):

    class Meta:
        model = Quizzes
        fields = "__all__"
        read_only_fields = ('id',)