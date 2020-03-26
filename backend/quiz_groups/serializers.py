from rest_framework import serializers
from .models import QuizGroups


class QuizGroupsSerializer(serializers.ModelSerializer):

    class Meta:
        model = QuizGroups
        fields = "__all__"
        read_only_fields = ('id',)