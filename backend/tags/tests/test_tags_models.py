import copy
import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from test_utils.users_fixtures import users
from test_utils.tags_fixtures import tag_payload, tag_obj0, tag_obj1
from tags.models import Tags

pytestmark = pytest.mark.django_db


def get_tag_detail_url(tag_id):
    return f"/api/tags/{tag_id}/"


@pytest.mark.django_db
class TestPublicTagsAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    def test_outsider_cannot_see_tags(self, client):
        url = reverse('tags:tags-list')
        response = client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_outsider_cannot_create_tag(self, client):
        payload = {
            'name': 'testtag'
        }
        url = reverse('tags:tags-list')
        response = client.post(url, payload)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_outsider_cannot_delete_tag(self, users, tag_payload):
        tag_payload['user'] = users['normal'][0]
        tag = Tags.objects.create(**tag_payload)
        response = self.client.delete(f'/api/tags/{tag.id}/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_outsider_cannot_update_tag(self, users, tag_payload):
        tag_payload['user'] = users['normal'][0]
        tag = Tags.objects.create(**tag_payload)
        tag_payload['name'] = 'something different'
        response = self.client.put(f'/api/tags/{tag.id}/', tag_payload)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
@pytest.mark.usefixtures("users")
class TestPrivateTagsAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    @classmethod
    def teardown_class(cls):
        cls.client = None

    def test_normal_user_can_see_own_tags_in_list_view(self, users, tag_payload):
        # create 2 tags with 2 different users
        tag_payload['user'] = users['normal'][0]
        Tags.objects.create(**tag_payload)
        tag_payload['name'] = "something different"
        tag_payload['user'] = users['normal'][1]
        Tags.objects.create(**tag_payload)

        # can access only to your tags.
        self.client.force_authenticate(users['normal'][0])
        response = self.client.get("/api/tags/")
        assert len(response.data) == 1

    def test_normal_user_cannot_see_others_tags_in_detail_view(self, users, tag_payload):
        # create 2 tags with 2 different users
        tag_payload['user'] = users['normal'][0]
        Tags.objects.create(**tag_payload)
        tag_payload['name'] = "something different"
        tag_payload['user'] = users['normal'][1]
        tag_others = Tags.objects.create(**tag_payload)

        # can not access to other's tags.
        self.client.force_authenticate(users['normal'][0])
        url = get_tag_detail_url(tag_others.id)
        response = self.client.get(url)
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]

    def test_normal_user_can_create_tags(self, users, tag_payload):
        self.client.force_authenticate(users['normal'][0])
        tag_payload['user'] = users['normal'][0].id
        response = self.client.post("/api/tags/", tag_payload)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['user'] == users['normal'][0].id

    def test_normal_user_cannot_create_others_tag(self, users, tag_payload):
        self.client.force_authenticate(users['normal'][0])
        tag_payload['user'] = users['normal'][1].id
        response = self.client.post("/api/tags/", tag_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_normal_user_can_update_own_tags(self, users, tag_payload):
        self.client.force_authenticate(users['normal'][0])
        tag_payload['user'] = users['normal'][0].id
        res1 = self.client.post('/api/tags/', tag_payload)
        tag = res1.data

        tag_payload['name'] = "something new"
        tag_payload['user'] = int(tag["user"])
        response = self.client.put(get_tag_detail_url(tag["id"]), tag_payload)
        assert response.status_code == status.HTTP_200_OK

    def test_normal_user_cannot_update_others_tags(self, users, tag_payload, tag_obj1):
        self.client.force_authenticate(users['normal'][0])
        tag_payload['name'] = "something new"
        tag_payload['user'] = tag_obj1.user.id
        response = self.client.put(get_tag_detail_url(tag_obj1.id), tag_payload)
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]

    def test_staff_user_can_update_tags(self, users, tag_payload):
        first_tag_name = copy.copy(tag_payload['name'])
        self.client.force_authenticate(users['staff'][0])
        tag_payload['user'] = users['normal'][0]
        tag = Tags.objects.create(**tag_payload)

        tag_payload['name'] = "test" + tag_payload['name']
        tag_payload['user'] = tag.user.id
        response = self.client.put(get_tag_detail_url(tag.id), tag_payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] != first_tag_name

    def test_superuser_can_update_tags(self, users, tag_payload):
        first_tag_name = copy.copy(tag_payload['name'])
        self.client.force_authenticate(users['superuser'][0])
        tag_payload['user'] = users['normal'][0]
        tag = Tags.objects.create(**tag_payload)

        tag_payload['name'] = "test1" + tag_payload['name']
        tag_payload['user'] = tag.user.id
        response = self.client.put(get_tag_detail_url(tag.id), tag_payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] != first_tag_name

    def test_normal_user_can_delete_own_tag(self, users, tag_obj0):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.delete(get_tag_detail_url(tag_obj0.id))
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_normal_user_cannot_delete_others_tag(self, users, tag_obj1):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.delete(get_tag_detail_url(tag_obj1.id))
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]
        tag_obj1.delete()
