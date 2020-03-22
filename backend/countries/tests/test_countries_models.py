import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from test_utils.users_fixtures import users
from test_utils.countries_fixtures import country_payload, country_obj
from rest_framework.test import APIClient
from countries.models import Countries

pytestmark = pytest.mark.django_db


@pytest.mark.django_db
class TestPublicCountriesAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    def test_outsider_can_see_countries(self):
        url = reverse('countries:countries-list')
        response = self.client.get(url)
        assert response.status_code == status.HTTP_200_OK

    def test_outsider_cannot_create_country(self, country_payload):
        url = reverse('countries:countries-list')
        response = self.client.post(url, country_payload)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_outsider_cannot_delete_country(self, country_obj):
        response = self.client.delete(f'/api/countries/{country_obj.id}/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_outsider_cannot_update_country(self, country_payload, country_obj):
        response = self.client.put(f'/api/countries/{country_obj.id}/', country_payload)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
@pytest.mark.usefixtures("users")
class TestPrivateCountriesAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    def test_normal_user_cannot_create_countries(self, users, country_payload):
        url = reverse('countries:countries-list')
        self.client.force_authenticate(users['normal'][0])
        response = self.client.post(url, country_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_staff_user_can_create_countries(self, users, country_payload):
        url = reverse('countries:countries-list')
        self.client.force_authenticate(users['staff'][0])
        response = self.client.post(url, country_payload)
        assert response.status_code == status.HTTP_201_CREATED

    def test_superuser_can_create_countries(self, users, country_payload):
        url = reverse('countries:countries-list')
        self.client.force_authenticate(users['superuser'][0])
        response = self.client.post(url, country_payload)
        assert response.status_code == status.HTTP_201_CREATED

    def test_normal_user_cannot_delete_countries(self, users, country_obj):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.delete(f'/api/countries/{country_obj.id}/')
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_staff_user_can_delete_countries(self, users, country_obj):
        self.client.force_authenticate(users['staff'][0])
        response = self.client.delete(f'/api/countries/{country_obj.id}/')
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_superuser_can_delete_countries(self, users, country_obj):
        self.client.force_authenticate(users['superuser'][0])
        response = self.client.delete(f'/api/countries/{country_obj.id}/')
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_normal_user_cannot_update_countries(self, users, country_payload, country_obj):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.put(f'/api/countries/{country_obj.id}/', country_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_staff_user_can_update_countries(self, users, country_payload, country_obj):
        self.client.force_authenticate(users['staff'][0])
        country_payload['description'] = "test" + country_payload['description']
        response = self.client.put(f'/api/countries/{country_obj.id}/', country_payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['description'] != country_obj.description

    def test_superuser_can_update_countries(self, users, country_payload, country_obj):
        self.client.force_authenticate(users['superuser'][0])
        country_payload['description'] = "test1" + country_payload['description']
        response = self.client.put(f'/api/countries/{country_obj.id}/', country_payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['description'] != country_obj.description
