import pytest
from rest_framework import status
from test_utils.users_fixtures import users
from test_utils.categories_fixtures import category_payload, category_obj
from test_utils.post_states_fixtures import all_states
from test_utils.posts_fixtures import post_min_payload, post_payload, post_obj
from test_utils.tags_fixtures import tag_payload, staff_tag_obj0
from rest_framework.test import APIClient
from posts.models import Posts

pytestmark = pytest.mark.django_db


@pytest.mark.django_db
class TestPublicPostsAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    def test_outsider_can_see_posts(self, post_obj):
        response = self.client.get("/api/posts/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data[0]['title'] == post_obj.title

    def test_outsider_cannot_create_post(self, post_min_payload):
        response = self.client.post("/api/posts/", post_min_payload)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_outsider_cannot_delete_post(self, post_obj):
        response = self.client.delete(f'/api/posts/{post_obj.id}/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_outsider_cannot_update_post(self, post_min_payload, post_obj):
        response = self.client.put(f'/api/posts/{post_obj.id}/', post_min_payload)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestPrivatePostsAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    def test_normal_user_cannot_create_posts(self, users, post_min_payload):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.post("/api/posts/", post_min_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_staff_user_can_create_posts(self, users, post_payload):
        self.client.force_authenticate(users['staff'][0])
        response = self.client.post("/api/posts/", post_payload)
        assert response.status_code == status.HTTP_201_CREATED

    def test_superuser_can_create_posts(self, users, post_payload):
        self.client.force_authenticate(users['superuser'][0])
        response = self.client.post("/api/posts/", post_payload)
        assert response.status_code == status.HTTP_201_CREATED

    def test_normal_user_cannot_delete_posts(self, users, post_obj):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.delete(f'/api/posts/{post_obj.id}/')
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_staff_user_can_delete_posts(self, users, post_obj):
        self.client.force_authenticate(users['staff'][0])
        response = self.client.delete(f'/api/posts/{post_obj.id}/')
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_superuser_can_delete_posts(self, users, post_obj):
        self.client.force_authenticate(users['superuser'][0])
        response = self.client.delete(f'/api/posts/{post_obj.id}/')
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_normal_user_cannot_update_posts(self, users, post_min_payload, post_obj):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.put(f'/api/posts/{post_obj.id}/', post_min_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_staff_user_can_update_posts(self, users, post_payload, post_obj):
        self.client.force_authenticate(users['staff'][0])
        post_payload['title'] = "test" + post_payload['title']
        response = self.client.put(f'/api/posts/{post_obj.id}/', post_payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['title'] != post_obj.title

    def test_superuser_can_update_posts(self, users, post_payload, post_obj):
        self.client.force_authenticate(users['superuser'][0])
        post_payload['title'] = "test1" + post_payload['title']
        response = self.client.put(f'/api/posts/{post_obj.id}/', post_payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['title'] != post_obj.title
