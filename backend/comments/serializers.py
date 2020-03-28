from rest_framework import serializers
from .models import Comments
from blacklist_words.models import BlacklistWords


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
        if not self.check_blacklist_words(data):
            raise serializers.ValidationError("Content contains one of the words that are not allowed.")
        return data

    def check_blacklist_words(self, ticket_payload):
        # check if content includes one of the black list words.
        blacklist_words = BlacklistWords.objects.filter(used_in_tickets=True)
        if len(blacklist_words) < 1:
            return True
        else:
            for blacklist_word in blacklist_words:
                if blacklist_word.content in ticket_payload.get('content'):
                    return False
            return True
