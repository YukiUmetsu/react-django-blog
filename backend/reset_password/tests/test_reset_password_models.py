import pytest
import datetime
import pytz
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from test_utils.users_fixtures import users
from reset_password.models import ResetPassword
from reset_password.tokens.generate_tokens import RandomStringTokenGenerator
from test_utils.reset_password_fixtures import reset_password_payload, reset_password_obj

pytestmark = pytest.mark.django_db

RESET_PASS_URL = '/api/reset_password/'
CONFIRM_URL = '/api/reset_password/confirm/'


@pytest.mark.django_db
class TestPublicResetPasswordAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    def test_can_create_reset_password(self, reset_password_payload):
        self.client.post(RESET_PASS_URL, reset_password_payload)
        query = ResetPassword.objects.filter(email=reset_password_payload.get('email', ''))
        assert len(query) == 1

    def test_cannot_create_reset_password_for_non_user_email(self):
        non_user_email = 'fwjoaeij3o4wa@gmail.com'
        self.client.post(RESET_PASS_URL, {'email': non_user_email})
        query = ResetPassword.objects.filter(email=non_user_email)
        assert len(query) == 0

    def test_cannot_create_reset_password_with_invalid_email(self):
        invalid_email = 'fewoijfofioewhafsare'
        self.client.post(RESET_PASS_URL, {'email': invalid_email})
        query = ResetPassword.objects.filter(email=invalid_email)
        assert len(query) == 0


@pytest.mark.django_db
class TestPublicResetPasswordConfirmAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    def test_can_create_reset_password(self, users, reset_password_obj):
        new_password = '320u94rw8'
        payload = {
            'reset_token': reset_password_obj.reset_token,
            'email': users['normal'][0].email,
            'password': new_password,
            'confirm_password': new_password
        }
        response = self.client.post(CONFIRM_URL, payload)
        assert response.status_code == status.HTTP_200_OK
        user_query = get_user_model().objects.get(id=users['normal'][0].id)
        assert user_query.check_password(new_password) is True

    def test_cannot_create_reset_password_with_invalid_token(self, users, reset_password_obj):
        new_password = '320ufw94rw8'
        payload = {
            'reset_token': 'fnwo332jfpr93j4tipe0afhw',
            'email': users['normal'][0].email,
            'password': new_password,
            'confirm_password': new_password
        }
        self.client.post(CONFIRM_URL, payload)
        user_query = get_user_model().objects.get(id=users['normal'][0].id)
        assert user_query.check_password(new_password) is False

    def test_cannot_create_reset_password_for_different_user(self, users, reset_password_obj):
        new_password = '320ufw9f4rw8'
        payload = {
            'reset_token': reset_password_obj.reset_token,
            'email': users['normal'][1].email,
            'password': new_password,
            'confirm_password': new_password
        }
        self.client.post(CONFIRM_URL, payload)
        user_query = get_user_model().objects.get(id=users['normal'][0].id)
        another_user_query = get_user_model().objects.get(id=users['normal'][1].id)
        assert user_query.check_password(new_password) is False
        assert another_user_query.check_password(new_password) is False

    def test_cannot_create_reset_password_when_password_not_match(self, users, reset_password_obj):
        new_password = '320ufw9f4ewrw8'
        payload = {
            'reset_token': reset_password_obj.reset_token,
            'email': users['normal'][0].email,
            'password': new_password,
            'confirm_password': 'f382hforwf8wyr4w'
        }
        self.client.post(CONFIRM_URL, payload)
        user_query = get_user_model().objects.get(id=users['normal'][0].id)
        assert user_query.check_password(new_password) is False
