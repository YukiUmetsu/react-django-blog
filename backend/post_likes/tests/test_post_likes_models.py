import pytest
from rest_framework import status
from rest_framework.test import APIClient
from post_likes.models import PostLikes
from test_utils.users_fixtures import users
from test_utils.categories_fixtures import category_payload, category_obj
from test_utils.tags_fixtures import tag_payload, staff_tag_obj0
from test_utils.post_states_fixtures import all_states
from test_utils.post_likes_fixtures import post_like_payload, post_like_min_payload, post_like_obj, post_like_obj_without_user
from test_utils.posts_fixtures import post_min_payload, post_obj


pytestmark = pytest.mark.django_db


@pytest.mark.django_db
class TestPublicPostLikesAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    def test_outsider_can_create_post_like(self, post_like_min_payload):
        post_like_min_payload['post'] = post_like_min_payload['post'].id
        response = self.client.post("/api/post_likes/", post_like_min_payload)
        assert response.status_code == status.HTTP_201_CREATED

    def test_outsider_can_update_own_post_like(self, post_like_obj_without_user):
        ip = post_like_obj_without_user.ip_address
        payload = {
            'like': not post_like_obj_without_user.like,
            'post': post_like_obj_without_user.post.id,
            'ip_address': ip
        }
        response = self.client.put(f'/api/post_likes/{post_like_obj_without_user.id}/', payload)
        assert response.status_code == status.HTTP_200_OK

    def test_outsider_cannot_update_others_post_like(self, post_like_obj_without_user):
        ip = post_like_obj_without_user.ip_address
        payload = {
            'like': not post_like_obj_without_user.like,
            'post': post_like_obj_without_user.post.id,
            'ip_address': ip+'0'
        }
        response = self.client.put(f'/api/post_likes/{post_like_obj_without_user.id}/', payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
class TestPrivatePostLikesAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    def test_normal_user_can_create_post_likes(self, users, post_like_payload):
        user = users['normal'][0]
        self.client.force_authenticate(user)
        post_like_payload['post'] = post_like_payload['post'].id
        post_like_payload['user'] = post_like_payload['user'].id
        response = self.client.post("/api/post_likes/", post_like_payload)
        assert response.status_code == status.HTTP_201_CREATED

    def test_normal_user_cannot_update_others_post_likes(self, users, post_like_payload, post_like_obj):
        user = users['normal'][1]
        self.client.force_authenticate(user)
        post_like_payload['post'] = post_like_payload['post'].id
        post_like_payload['user'] = user.id
        response = self.client.put(f'/api/post_likes/{post_like_obj.id}/', post_like_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN
