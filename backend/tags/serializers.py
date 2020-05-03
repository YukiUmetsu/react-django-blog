from rest_framework import serializers
from .models import Tags


class TagsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tags
        fields = ('id', 'name', 'user')
        read_only_fields = ('id',)

    def create(self, validated_data):
        tag, created = Tags.objects.get_or_create(**validated_data)
        return tag
