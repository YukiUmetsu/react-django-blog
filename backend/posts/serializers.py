from rest_framework import serializers
from .models import Posts


class PostsSerializer(serializers.ModelSerializer):
    """Serializer for posts"""

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
            'tags'
        )
        read_only_fields = ('id',)
