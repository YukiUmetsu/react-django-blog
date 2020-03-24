from rest_framework import serializers
from .models import Files


class FilesSerializer(serializers.ModelSerializer):

    class Meta:
        model = Files
        fields = "__all__"
        read_only_fields = ('id',)
