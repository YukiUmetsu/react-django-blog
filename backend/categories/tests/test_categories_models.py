import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from test_utils.users_fixtures import users
from test_utils.categories_fixtures import category_payload, category_obj


pytestmark = pytest.mark.django_db


@pytest.mark.django_db
class TestPublicCategoriesAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    def test_outsider_can_see_categories(self, client):
        url = reverse('categories:categories-list')
        response = client.get(url)
        assert response.status_code == status.HTTP_200_OK

    def test_outsider_cannot_create_category(self, client):
        payload = {
            'name': 'testcategry'
        }
        url = reverse('categories:categories-list')
        response = client.post(url, payload)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_outsider_cannot_delete_category(self, category_obj):
        response = self.client.delete(f'/api/categories/{category_obj.id}/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_outsider_cannot_update_category(self, category_payload, category_obj):
        response = self.client.put(f'/api/categories/{category_obj.id}/', category_payload)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
@pytest.mark.usefixtures("users")
class TestPrivateCountriesAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    def test_normal_user_cannot_create_categories(self, users, category_payload):
        url = reverse('categories:categories-list')
        self.client.force_authenticate(users['normal'][0])
        response = self.client.post(url, category_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_staff_user_can_create_categories(self, users, category_payload):
        url = reverse('categories:categories-list')
        self.client.force_authenticate(users['staff'][0])
        response = self.client.post(url, category_payload)
        assert response.status_code == status.HTTP_201_CREATED

    def test_superuser_can_create_categories(self, users, category_payload):
        url = reverse('categories:categories-list')
        self.client.force_authenticate(users['superuser'][0])
        response = self.client.post(url, category_payload)
        assert response.status_code == status.HTTP_201_CREATED

    def test_normal_user_cannot_delete_categories(self, users, category_obj):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.delete(f'/api/categories/{category_obj.id}/')
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_staff_user_can_delete_categories(self, users, category_obj):
        self.client.force_authenticate(users['staff'][0])
        response = self.client.delete(f'/api/categories/{category_obj.id}/')
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_superuser_can_delete_categories(self, users, category_obj):
        self.client.force_authenticate(users['superuser'][0])
        response = self.client.delete(f'/api/categories/{category_obj.id}/')
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_normal_user_cannot_update_categories(self, users, category_payload, category_obj):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.put(f'/api/categories/{category_obj.id}/', category_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_staff_user_can_update_categories(self, users, category_payload, category_obj):
        self.client.force_authenticate(users['staff'][0])
        category_payload['name'] = "test" + category_payload['name']
        response = self.client.put(f'/api/categories/{category_obj.id}/', category_payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] != category_obj.name

    def test_superuser_can_update_categories(self, users, category_payload, category_obj):
        self.client.force_authenticate(users['superuser'][0])
        category_payload['name'] = "test1" + category_payload['name']
        response = self.client.put(f'/api/categories/{category_obj.id}/', category_payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] != category_obj.name
