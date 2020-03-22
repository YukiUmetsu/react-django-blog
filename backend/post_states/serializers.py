from rest_framework import serializers
from .models import PostStates


class PostStatesSerializer(serializers.ModelSerializer):
    """Serializer for tag post states"""
    
    class Meta:
        model = PostStates
        fields = ('id', 'name')
        read_only_fields = ('id',)
