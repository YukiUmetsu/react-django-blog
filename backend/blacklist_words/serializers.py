from rest_framework import serializers
from .models import BlacklistWords


class BlacklistWordsSerializer(serializers.ModelSerializer):

    class Meta:
        model = BlacklistWords
        fields = "__all__"
        read_only_fields = ('id',)