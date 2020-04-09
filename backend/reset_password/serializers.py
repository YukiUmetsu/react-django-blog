from rest_framework import serializers
from .models import ResetPassword
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from django.utils.translation import gettext as _
import datetime
from reset_password.tokens.generate_tokens import RandomStringTokenGenerator


class ResetPasswordSerializer(serializers.Serializer):
    request_ip = serializers.CharField(required=True, max_length=255)
    email = serializers.EmailField(required=True)

    def validate_email(self, email):
        try:
            user = get_user_model().objects.get(email=email)
            self.user = user
        except ObjectDoesNotExist as e:
            raise serializers.ValidationError(
                _("User does not exist"))
        return email

    def validate_request_ip(self, request_ip):
        if "." not in request_ip:
            raise serializers.ValidationError(
                _("Invalid request ip address"))
        return request_ip


    def save(self):
        clean_data = self.get_cleaned_data()
        existing_obj = ResetPassword.objects.filter(email=clean_data.get('email'))
        if len(existing_obj) > 0:
            # object exists
            return existing_obj.update(**clean_data)

        return ResetPassword.objects.create(**clean_data)

    def get_cleaned_data(self):
        validated_data = self.validated_data
        token_generator = RandomStringTokenGenerator()
        reset_token = token_generator.generate_token()
        return {
            'reset_token': reset_token,
            'request_ip': validated_data.get('request_ip', ''),
            'email': validated_data.get('email', ''),
            'last_changed': datetime.datetime.now(),
            'user': self.user
        }