import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from test_utils.users_fixtures import users
from test_utils.post_states_fixtures import post_state_payload, post_state_obj
from rest_framework.test import APIClient
from post_states.models import PostStates

pytestmark = pytest.mark.django_db


@pytest.mark.django_db
class TestPublicPostStatesAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    def test_outsider_can_see_post_states(self):
        response = self.client.get("/api/post_states/")
        assert response.status_code == status.HTTP_200_OK

    def test_outsider_cannot_create_post_state(self, post_state_payload):
        response = self.client.post("/api/post_states/", post_state_payload)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_outsider_cannot_delete_post_state(self, post_state_obj):
        response = self.client.delete(f'/api/post_states/{post_state_obj.id}/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_outsider_cannot_update_post_state(self, post_state_payload, post_state_obj):
        response = self.client.put(f'/api/post_states/{post_state_obj.id}/', post_state_payload)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
@pytest.mark.usefixtures("users")
class TestPrivatePostStatesAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    def test_normal_user_cannot_create_post_states(self, users, post_state_payload):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.post("/api/post_states/", post_state_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_staff_user_can_create_post_states(self, users, post_state_payload):
        self.client.force_authenticate(users['staff'][0])
        response = self.client.post("/api/post_states/", post_state_payload)
        assert response.status_code == status.HTTP_201_CREATED

    def test_superuser_can_create_post_states(self, users, post_state_payload):
        self.client.force_authenticate(users['superuser'][0])
        response = self.client.post("/api/post_states/", post_state_payload)
        assert response.status_code == status.HTTP_201_CREATED

    def test_normal_user_cannot_delete_post_states(self, users, post_state_obj):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.delete(f'/api/post_states/{post_state_obj.id}/')
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_staff_user_can_delete_post_states(self, users, post_state_obj):
        self.client.force_authenticate(users['staff'][0])
        response = self.client.delete(f'/api/post_states/{post_state_obj.id}/')
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_superuser_can_delete_post_states(self, users, post_state_obj):
        self.client.force_authenticate(users['superuser'][0])
        response = self.client.delete(f'/api/post_states/{post_state_obj.id}/')
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_normal_user_cannot_update_post_states(self, users, post_state_payload, post_state_obj):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.put(f'/api/post_states/{post_state_obj.id}/', post_state_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_staff_user_can_update_post_states(self, users, post_state_payload, post_state_obj):
        self.client.force_authenticate(users['staff'][0])
        post_state_payload['name'] = "test" + post_state_payload['name']
        response = self.client.put(f'/api/post_states/{post_state_obj.id}/', post_state_payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] != post_state_obj.name

    def test_superuser_can_update_post_states(self, users, post_state_payload, post_state_obj):
        self.client.force_authenticate(users['superuser'][0])
        post_state_payload['name'] = "test1" + post_state_payload['name']
        response = self.client.put(f'/api/post_states/{post_state_obj.id}/', post_state_payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] != post_state_obj.name
