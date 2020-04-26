from collections import OrderedDict

from rest_framework import serializers
from allauth.account import app_settings as allauth_settings
from allauth.utils import email_address_exists
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from allauth.account.models import EmailAddress
from users.models import CustomUser
from django.utils.translation import gettext as _
from files.serializers import FilesSerializer
from files.models import Files
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


class ProfileImageField(ModifiedRelatedField):

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


class UserSerializer(serializers.ModelSerializer):
    # this serializer is used when accessing user data from admin panel.
    profile_img = ProfileImageField(queryset=Files.objects.all(), required=False)

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name', 'password', 'is_staff', 'is_superuser', 'country', 'profile_img', 'created_at']
        read_only_fields = ('id',)
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate_email(self, email):
        email = get_adapter().clean_email(email)
        if allauth_settings.UNIQUE_EMAIL:
            if email and email_address_exists(email):
                raise serializers.ValidationError(
                    _("A user is already registered with this e-mail address."))
        return email

    def validate_is_staff(self, is_staff):
        if isinstance(is_staff, bool):
            return is_staff
        raise serializers.ValidationError(_("Invalid data passed."))

    def validate_is_superuser(self, is_superuser):
        if isinstance(is_superuser, bool):
            return is_superuser
        raise serializers.ValidationError(_("Invalid data passed."))

    def validate_password(self, password):
        return get_adapter().clean_password(password)

    def create(self, validated_data):
        adapter = get_adapter()
        request = self.context['request']
        user = adapter.new_user(request)
        self.cleaned_data = validated_data
        adapter.save_user(request, user, self)
        setup_user_email(request, user, [])

        is_staff = validated_data['is_staff'] == True
        is_superuser = validated_data['is_superuser'] == True
        user.is_staff = is_staff
        user.is_superuser = is_superuser

        if validated_data.get('country'):
            user.country = validated_data['country']

        user.save()

        # confirm email without sending confirming email.
        email_obj = EmailAddress.objects.filter(email=validated_data['email'])
        adapter.confirm_email(request, email_obj[0])

        return user


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField(required=allauth_settings.EMAIL_REQUIRED)
    first_name = serializers.CharField(required=True, write_only=True)
    last_name = serializers.CharField(required=True, write_only=True)
    password = serializers.CharField(required=True, write_only=True)
    confirm_password = serializers.CharField(required=True, write_only=True)

    def validate_email(self, email):
        email = get_adapter().clean_email(email)
        if allauth_settings.UNIQUE_EMAIL:
            if email and email_address_exists(email):
                raise serializers.ValidationError(
                    _("A user is already registered with this e-mail address."))
        return email

    def validate_password(self, password):
        return get_adapter().clean_password(password)

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError(
                _("The two password fields didn't match."))
        return data

    def get_cleaned_data(self):
        return {
            'first_name': self.validated_data.get('first_name', ''),
            'last_name': self.validated_data.get('last_name', ''),
            'password': self.validated_data.get('password', ''),
            'email': self.validated_data.get('email', ''),
        }

    def save(self, request):
        adapter = get_adapter()
        user = adapter.new_user(request)
        self.cleaned_data = self.get_cleaned_data()
        adapter.save_user(request, user, self)
        setup_user_email(request, user, [])
        user.save()
        return user
