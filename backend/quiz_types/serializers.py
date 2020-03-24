from rest_framework import serializers
from .models import QuizTypes


class QuizTypesSerializer(serializers.ModelSerializer):
    """Serializer for tag Objects"""

    class Meta:
        model = QuizTypes
        fields = "__all__"
        read_only_fields = ('id',)
