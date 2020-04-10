from rest_framework import serializers
from .models import ResetPassword
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from django.utils.translation import gettext as _
import datetime
import pytz
import os
from reset_password.tokens.generate_tokens import RandomStringTokenGenerator
from allauth.utils import email_address_exists
from allauth.account.adapter import get_adapter


def validate_change_frequency(reset_obj):
    if os.environ.get('ENVIRONMENT_MODE') == 'dev':
        return True
    last_change = reset_obj.last_changed
    # you can only change password once an hour.
    return pytz.UTC.localize(datetime.datetime.now()) > last_change + datetime.timedelta(hours=1)


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    def validate_email(self, email):
        try:
            user = get_user_model().objects.get(email=email)
            self.user = user
        except ObjectDoesNotExist as e:
            raise serializers.ValidationError(
                _("User does not exist"))
        return email

    def save(self):
        clean_data = self.get_cleaned_data()
        existing_obj = ResetPassword.objects.filter(email=clean_data.get('email'))
        if len(existing_obj) > 0:
            # object exists
            if validate_change_frequency(existing_obj[0]):
                return existing_obj.update(**clean_data)
            else:
                raise serializers.ValidationError(
                    _("Trying to reset password too often."))
        return ResetPassword.objects.create(**clean_data)

    def get_cleaned_data(self):
        validated_data = self.validated_data
        token_generator = RandomStringTokenGenerator()
        reset_token = token_generator.generate_token()
        return {
            'reset_token': reset_token,
            'email': validated_data.get('email', ''),
            'last_changed': pytz.UTC.localize(datetime.datetime.now()),
            'user': self.user
        }


class ResetPasswordConfirmSerializer(serializers.Serializer):
    reset_token = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    confirm_password = serializers.CharField(required=True, write_only=True)

    def validate_email(self, email):
        email = get_adapter().clean_email(email)
        if not email_address_exists(email):
            # no user with the email exist
            raise serializers.ValidationError(
                _("Something went wrong! [NU]"))
        return email

    def validate_password(self, password):
        return get_adapter().clean_password(password)

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError(
                _("The two password fields didn't match."))

        reset_password_query = ResetPassword.objects.filter(email=data['email'])
        if len(reset_password_query) == 0:
            # no password reset request from the user
            raise serializers.ValidationError(
                _("Something went wrong! [NR]"))

        if not self.is_reset_token_valid(reset_password_query[0], data['reset_token']):
            raise serializers.ValidationError(
                # invalid reset token
                _("Something went wrong! [IVRT]"))
        return data

    def is_reset_token_valid(self, reset_password_obj, request_reset_token):
        server_reset_token = reset_password_obj.reset_token
        if server_reset_token != request_reset_token:
            return False
        return validate_change_frequency(reset_password_obj)

    def save(self):
        user = get_user_model().objects.get(email=self.validated_data.get("email"))
        user.set_password(self.validated_data.get("password"))
        user.save()
        return user
