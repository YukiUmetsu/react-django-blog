from rest_framework import serializers
from .models import Categories


class CategoriesSerializer(serializers.ModelSerializer):
    """Serializer for tag Objects"""

    class Meta:
        model = Categories
        fields = ('id', 'name', 'parent')
        read_only_fields = ('id',)
