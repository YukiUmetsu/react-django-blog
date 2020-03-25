from rest_framework import serializers
from .models import Posts


class PostsSerializer(serializers.ModelSerializer):
    """Serializer for posts"""
    """todo: post comments in detail page"""
    total_likes = serializers.IntegerField(required=False)

    class Meta:
        model = Posts
        fields = (
            'id',
            'title',
            'content',
            'meta_desc',
            'youtube_url',
            'created_at',
            'published_at',
            'category',
            'user',
            'post_state',
            'tags',
            'total_likes',
        )
        read_only_fields = ('id', 'total_likes')
