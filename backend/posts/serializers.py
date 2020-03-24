from rest_framework import serializers
from .models import Posts


class PostsSerializer(serializers.ModelSerializer):
    """Serializer for posts"""
    """TODO: 1. Get post pictures, 2. number of likes of a post, 3. post comments in detail page"""
    total_likes = serializers.IntegerField()

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
        read_only_fields = ('id','total_likes')
