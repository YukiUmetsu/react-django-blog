from rest_framework import serializers
from .models import Countries


class CountriesSerializer(serializers.ModelSerializer):
    """Serializer for tag Objects"""

    class Meta:
        model = Countries
        fields = ('id', 'numeric_code', 'two_code', 'three_code', 'description')
        read_only_fields = ('id',)
