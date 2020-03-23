from rest_framework import serializers
from .models import Comments


class CommentsSerializer(serializers.ModelSerializer):
    """Serializers for comments"""

    class Meta:
        model = Comments
        fields = ('id', 'content', 'name', 'email', 'created_at', 'parent', 'user', 'post')
        read_only_fields = ('id',)

    def validate(self, data):
        """
        if user is null, it has to have name & email
        """
        is_name_email_not_provided = not bool(data.get('name')) or not bool(data.get('email'))

        is_user_not_provided = not bool(data.get('user'))
        if is_name_email_not_provided and is_user_not_provided:
            raise serializers.ValidationError("Please provide name and email or please login.")
        return data
