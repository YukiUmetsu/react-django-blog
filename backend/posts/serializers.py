from rest_framework import serializers
from .models import Posts
from files.serializers import FilesSerializer
from categories.serializers import CategoriesSerializer
from tags.serializers import TagsSerializer
from post_states.serializers import PostStatesSerializer


class PostsSerializer(serializers.ModelSerializer):
    """Serializer for posts"""
    """todo: post comments in detail page"""
    total_likes = serializers.IntegerField(required=False)
    main_img = FilesSerializer()
    category = CategoriesSerializer()
    tags = TagsSerializer(many=True)
    post_state = PostStatesSerializer()

    class Meta:
        model = Posts
        fields = "__all__"
        read_only_fields = ('id', 'total_likes', 'main_img')
