import os
import string
import random
import copy
import pytest
from rest_framework import status
from rest_framework.test import APIClient
from test_utils.users_fixtures import users
from blog_config.models import BlogConfig

pytestmark = pytest.mark.django_db


def random_string(string_length=10):
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(string_length))


def config_detail_url(config_id):
    return f"/api/blog_config/{config_id}/"


@pytest.fixture
def config_payload(users):
    yield {
        'title': 'Jplaunch',
        'meta_desc': random_string(50),
    }


@pytest.fixture
def config_obj(config_payload, users):
    config = BlogConfig.objects.create(**config_payload)
    yield config
    config.delete()


@pytest.mark.django_db
class TestPublicFilesAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    def teardown_class(cls):
        cls.client = None

    def test_outsider_can_see_config(self, config_obj):
        response = self.client.get(config_detail_url(config_obj.id))
        assert response.status_code == status.HTTP_200_OK

    def test_outsider_cannot_create_config(self, config_payload):
        response = self.client.post(f'/api/files/', config_payload)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_outsider_cannot_delete_config(self, config_obj):
        response = self.client.delete(config_detail_url(config_obj.id))
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_outsider_cannot_update_config(self, config_payload, config_obj):
        config_id = config_obj.id
        config_payload['meta_desc'] = 'something different'
        response = self.client.patch(f'/api/files/{config_id}/', config_payload)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
@pytest.mark.usefixtures("users")
class TestPrivateFilesAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    @classmethod
    def teardown_class(cls):
        cls.client = None

    def test_normal_user_can_see_config(self, users, config_obj):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.get(config_detail_url(config_obj.id))
        assert response.status_code == status.HTTP_200_OK

    def test_normal_user_cannot_update_config(self, users, config_payload, config_obj):
        self.client.force_authenticate(users['normal'][0])
        config_payload['meta_desc'] = "something new"
        config_id = config_obj.id
        response = self.client.patch(config_detail_url(config_id), config_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_normal_user_cannot_delete_config(self, users, config_payload, config_obj):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.delete(config_detail_url(config_obj.id), config_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_staff_user_can_update_config(self, users, config_payload, config_obj):
        first_config_desc = copy.copy(config_obj.meta_desc)
        config_payload['meta_desc'] = "test" + config_payload['meta_desc']
        self.client.force_authenticate(users['staff'][0])
        response = self.client.patch(config_detail_url(config_obj.id), config_payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['meta_desc'] != first_config_desc

    def test_superuser_can_update_config(self, users, config_payload, config_obj):
        first_config_desc = copy.copy(config_payload['meta_desc'])
        config_payload['meta_desc'] = "test1" + config_payload['meta_desc']
        self.client.force_authenticate(users['superuser'][0])
        response = self.client.patch(config_detail_url(config_obj.id), config_payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data.get('meta_desc') != first_config_desc
