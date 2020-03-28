from rest_framework import serializers
from .models import Tickets
from blacklist_words.models import BlacklistWords


class TicketsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tickets
        fields = "__all__"
        read_only_fields = ('id',)


    def validate(self, data):
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