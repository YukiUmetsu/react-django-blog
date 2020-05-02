from collections import OrderedDict

from rest_framework import serializers
from .models import Posts
from categories.models import Categories
from categories.serializers import CategoriesSerializer
from tags.models import Tags
from tags.serializers import TagsSerializer
from post_states.models import PostStates
from post_states.serializers import PostStatesSerializer
from django.contrib.auth import get_user_model
from users.serializers import UserSerializer
from files.serializers import FilesSerializer
from files.models import Files
from comments.models import Comments
from comments.serializers import CommentsSerializer
from django.core.exceptions import ObjectDoesNotExist


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


class MainImageField(ModifiedRelatedField):

    def to_representation(self, value):
        return FilesSerializer(value).data

    def to_internal_value(self, value):
        try:
            try:
                return Files.objects.get(id=value)
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


class CategoryField(ModifiedRelatedField):

    def to_representation(self, value):
        return CategoriesSerializer(value).data

    def to_internal_value(self, value):
        try:
            try:
                return Categories.objects.get(id=value)
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


class TagsField(ModifiedRelatedField):

    def to_representation(self, value):
        return TagsSerializer(value).data

    def to_internal_value(self, value):
        if isinstance(value, dict) and len(value) > 0:
            if not value.get('user', False):
                raise serializers.ValidationError(
                    'Invalid tag data.'
                )
            try:
                user = get_user_model().objects.get(id=value.get('user', ''))
                value['user'] = user.id
                serializer = TagsSerializer(data=value)
                if serializer.is_valid(raise_exception=True):
                    new_tag = serializer.save()
                    print(new_tag)
                    return new_tag
                else:
                    raise serializers.ValidationError(
                        'Invalid tag data.'
                    )

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
                    'User in tag does not exist.'
                )

        if isinstance(value, (str, int)):
            try:
                return Tags.objects.get(id=value)
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


class PostStatesField(ModifiedRelatedField):

    def to_representation(self, value):
        return PostStatesSerializer(value).data

    def to_internal_value(self, value):
        try:
            try:
                return PostStates.objects.get(id=value)
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


class PostsSerializer(serializers.ModelSerializer):
    """Serializer for posts"""
    total_likes = serializers.IntegerField(required=False)
    main_img = MainImageField(queryset=Files.objects.all(), required=True)
    category = CategoryField(queryset=Categories.objects.all(), required=False)
    tags = TagsField(queryset=Tags.objects.all(), many=True, required=False)
    post_state = PostStatesField(queryset=PostStates.objects.all(), required=True)
    user = UserField(queryset=get_user_model().objects.all(), required=True)

    class Meta:
        model = Posts
        fields = "__all__"
        read_only_fields = ('id', 'total_likes', 'main_img')
