from rest_framework import serializers
from .models import PostLikes


class PostLikesSerializer(serializers.ModelSerializer):
    """Serializers for comments"""

    class Meta:
        model = PostLikes
        fields = ('id', 'like', 'created_at', 'user', 'post')
        read_only_fields = ('id',)
