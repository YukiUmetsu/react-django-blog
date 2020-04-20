import pytest
from faker import Faker
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from test_utils.users_fixtures import users, user_payload, staff_user_payload, superuser_payload, user_payload_with_country
from test_utils.countries_fixtures import country_obj, country_payload
from countries.models import Countries


def get_user_detail_url(user_id):
    return f"/api/users/{user_id}/"


USERS_API_URL = '/api/users/'


@pytest.mark.django_db
class TestPublicUsersAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    def test_create_user_with_email_successful(self):
        """Test creating a new user with email"""
        email = "testuseremail@test.com"
        password = "Hey12345hey!"
        user = get_user_model().objects.create_user(
            email=email,
            password=password
        )
        assert user.email == email
        assert user.check_password(password) == True

    def test_outsider_cannot_access_to_other_user_data_in_list_view(self):
        response = self.client.get(USERS_API_URL)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_outsider_cannot_access_to_other_user_data_in_detail_view(self, users):
        detail_view_url = get_user_detail_url(users['normal'][0].id)
        response = self.client.get(detail_view_url)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_outsider_cannot_create_user(self, user_payload):
        response = self.client.post(USERS_API_URL, user_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
class TestPrivateUsersAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    def test_normal_user_cannot_access_to_other_user_data_in_list_view(self, users):
        self.client.force_authenticate(users['normal'][1])
        response = self.client.get(USERS_API_URL)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_outsider_cannot_access_to_other_user_data_in_detail_view(self, users):
        self.client.force_authenticate(users['normal'][1])
        detail_view_url = get_user_detail_url(users['normal'][0].id)
        response = self.client.get(detail_view_url)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_outsider_cannot_create_user(self, users, user_payload):
        self.client.force_authenticate(users['normal'][1])
        response = self.client.post(USERS_API_URL, user_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_staff_user_can_access_user_list(self, users):
        self.client.force_authenticate(users['staff'][0])
        response = self.client.get(USERS_API_URL)
        assert response.status_code == status.HTTP_200_OK

    def test_staff_can_access_to_user_data_in_detail_view(self, users):
        self.client.force_authenticate(users['staff'][0])
        detail_view_url = get_user_detail_url(users['normal'][0].id)
        response = self.client.get(detail_view_url)
        assert response.status_code == status.HTTP_200_OK

    def test_staff_can_create_user(self, users, user_payload):
        self.client.force_authenticate(users['staff'][0])
        response = self.client.post(USERS_API_URL, user_payload)
        assert response.status_code == status.HTTP_201_CREATED

    def test_staff_cannot_create_another_staff(self, users, staff_user_payload):
        self.client.force_authenticate(users['staff'][0])
        response = self.client.post(USERS_API_URL, staff_user_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_staff_cannot_create_superuser(self, users, superuser_payload):
        self.client.force_authenticate(users['staff'][0])
        response = self.client.post(USERS_API_URL, superuser_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_superuser_can_create_staff_user(self, users, staff_user_payload):
        self.client.force_authenticate(users['superuser'][0])
        response = self.client.post(USERS_API_URL, staff_user_payload)
        assert response.status_code == status.HTTP_201_CREATED
        user = get_user_model().objects.get(email=staff_user_payload.get('email', ''))
        assert user.is_staff == True

    def test_superuser_can_create_superuser(self, users, superuser_payload):
        self.client.force_authenticate(users['superuser'][0])
        response = self.client.post(USERS_API_URL, superuser_payload)
        assert response.status_code == status.HTTP_201_CREATED
        user = get_user_model().objects.get(email=superuser_payload.get('email', ''))
        assert user.is_superuser == True

    def test_can_create_user_with_country(self, users, user_payload_with_country):
        self.client.force_authenticate(users['staff'][0])
        response = self.client.post(USERS_API_URL, user_payload_with_country)
        assert response.status_code == status.HTTP_201_CREATED
        user = get_user_model().objects.get(email=user_payload_with_country.get('email', ''))
        assert user.country.id == user_payload_with_country.get('country', '')