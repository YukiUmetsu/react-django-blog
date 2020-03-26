from rest_framework import serializers
from .models import QuizOptions


class QuizOptionsSerializer(serializers.ModelSerializer):

    class Meta:
        model = QuizOptions
        fields = "__all__"
        read_only_fields = ('id',)