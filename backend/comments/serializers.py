from rest_framework import serializers
from .models import Comments
from posts.models import Posts
from blacklist_words.models import BlacklistWords
from django.contrib.auth import get_user_model
from users.serializers import UserSerializer
from collections import OrderedDict
from django.core.exceptions import ObjectDoesNotExist
from posts.serializers import PostsSerializer


class ModifiedRelatedField(serializers.RelatedField):
    def get_choices(self, cutoff=None):
        queryset = self.get_queryset()
        if queryset is None:
            # Ensure that field.choices returns something sensible
            # even when accessed with a read-only field.
            return {}

        if cutoff is not None:
            queryset = queryset[:cutoff]

        return OrderedDict([
            (
                item.pk,
                self.display_value(item)
            )
            for item in queryset
        ])


class UserField(ModifiedRelatedField):

    def to_representation(self, value):
        return UserSerializer(value).data

    def to_internal_value(self, value):
        is_valid_type = isinstance(value, str) or isinstance(value, int)
        if not is_valid_type:
            raise serializers.ValidationError(
                'id invalid type.'
            )

        try:
            try:
                return get_user_model().objects.get(id=int(value))
            except KeyError:
                raise serializers.ValidationError(
                    'id is a required field.'
                )
            except ValueError:
                raise serializers.ValidationError(
                    'id must be an integer.'
                )
        except ObjectDoesNotExist:
            raise serializers.ValidationError(
                'Obj does not exist.'
            )


class PostField(ModifiedRelatedField):

    def to_representation(self, value):
        return PostsSerializer(value).data

    def to_internal_value(self, value):
        try:
            try:
                return Posts.objects.get(id=value)
            except KeyError:
                raise serializers.ValidationError(
                    'id is a required field.'
                )
            except ValueError:
                raise serializers.ValidationError(
                    'id must be an integer.'
                )
        except ObjectDoesNotExist:
            raise serializers.ValidationError(
                'Obj does not exist.'
            )


class CommentsSerializer(serializers.ModelSerializer):
    """Serializers for comments"""

    user = UserField(queryset=get_user_model().objects.all(), required=False)
    post = PostField(queryset=Posts.objects.all(), required=False)

    def __init__(self, *args, **kwargs):
        context = kwargs.get("context")
        if context is not None:
            depth = context.get("depth")
            if depth in ['1', '2']:
                self.Meta.depth = int(depth)

        super(CommentsSerializer, self).__init__(*args, **kwargs)

    class Meta:
        model = Comments
        fields = ('id', 'content', 'name', 'email', 'created_at', 'parent', 'user', 'post', 'replied')
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

    def check_blacklist_words(self, comment_payload):
        # check if content includes one of the black list words.
        blacklist_words = BlacklistWords.objects.filter(used_in_comments=True)
        if len(blacklist_words) < 1:
            return True
        else:
            for blacklist_word in blacklist_words:
                if blacklist_word.content in comment_payload.get('content'):
                    return False
            return True
