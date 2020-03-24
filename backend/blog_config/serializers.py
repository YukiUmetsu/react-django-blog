from rest_framework import serializers
from .models import BlogConfig


class BlogConfigSerializer(serializers.ModelSerializer):
    """Serializer for tag Objects"""

    class Meta:
        model = BlogConfig
        fields = "__all__"
        read_only_fields = ('id',)
