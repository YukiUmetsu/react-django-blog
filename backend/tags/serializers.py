from rest_framework import serializers
from .models import Tags


class TagsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tags
        fields = ('id', 'name', 'user')
        read_only_fields = ('id',)