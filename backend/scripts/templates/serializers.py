from rest_framework import serializers
from .models import Model__


class Model__Serializer(serializers.ModelSerializer):

    class Meta:
        model = Model__
        fields = "__all__"
        read_only_fields = ('id',)