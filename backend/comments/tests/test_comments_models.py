import pytest
from rest_framework import status
from rest_framework.test import APIClient
from comments.models import Comments
from test_utils.users_fixtures import users
from test_utils.categories_fixtures import category_payload, category_obj
from test_utils.tags_fixtures import tag_payload, staff_tag_obj0
from test_utils.post_states_fixtures import all_states
from test_utils.comments_fixtures import comment_payload, comment_min_payload, comment_obj
from test_utils.posts_fixtures import post_min_payload, post_obj


pytestmark = pytest.mark.django_db


def add_user_to_comment(comment_obj, user):
    comment_obj['name'] = ''
    comment_obj['email'] = ''
    comment_obj['user'] = user
    return comment_obj


@pytest.mark.django_db
class TestPublicCommentsAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    def test_outsider_can_see_comments(self):
        response = self.client.get("/api/comments/")
        assert response.status_code == status.HTTP_200_OK

    def test_outsider_can_create_comment(self, comment_min_payload):
        comment_min_payload['post'] = comment_min_payload['post'].id
        response = self.client.post("/api/comments/", comment_min_payload)
        assert response.status_code == status.HTTP_201_CREATED

    def test_comment_need_name_and_email_or_user(self, comment_min_payload):
        comment_min_payload['name'] = ''
        response = self.client.post("/api/comments/", comment_min_payload)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_outsider_can_delete_own_comment(self, comment_obj):
        response = self.client.delete(f'/api/comments/{comment_obj.id}/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_outsider_cannot_delete_others_comment(self, comment_obj):
        response = self.client.delete(f'/api/comments/{comment_obj.id}/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_outsider_cannot_update_own_comment(self, comment_payload, comment_obj):
        response = self.client.put(f'/api/comments/{comment_obj.id}/', comment_payload)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_outsider_cannot_update_others_comment(self, comment_payload, comment_obj):
        response = self.client.put(f'/api/comments/{comment_obj.id}/', comment_payload)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
@pytest.mark.usefixtures("users")
class TestPrivateCommentsAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    def test_normal_user_can_create_comments(self, users, comment_payload):
        user = users['normal'][0]
        self.client.force_authenticate(user)
        comment_payload = add_user_to_comment(comment_payload, user.id)
        comment_payload['post'] = comment_payload['post'].id
        response = self.client.post("/api/comments/", comment_payload)
        assert response.status_code == status.HTTP_201_CREATED

    def test_staff_user_can_create_comments(self, users, comment_payload):
        user = users['staff'][0]
        self.client.force_authenticate(user)
        comment_payload = add_user_to_comment(comment_payload, user.id)
        comment_payload['post'] = comment_payload['post'].id
        response = self.client.post("/api/comments/", comment_payload)
        assert response.status_code == status.HTTP_201_CREATED

    def test_superuser_can_create_comments(self, users, comment_payload):
        user = users['superuser'][0]
        self.client.force_authenticate(user)
        comment_payload = add_user_to_comment(comment_payload, user.id)
        comment_payload['post'] = comment_payload['post'].id
        response = self.client.post("/api/comments/", comment_payload)
        assert response.status_code == status.HTTP_201_CREATED

    def test_normal_user_can_delete_own_comments(self, users, comment_obj):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.delete(f'/api/comments/{comment_obj.id}/')
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_normal_user_cannot_delete_others_comments(self, users, comment_obj):
        self.client.force_authenticate(users['normal'][1])
        response = self.client.delete(f'/api/comments/{comment_obj.id}/')
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_staff_user_can_delete_comments(self, users, comment_obj):
        self.client.force_authenticate(users['staff'][0])
        response = self.client.delete(f'/api/comments/{comment_obj.id}/')
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_superuser_can_delete_comments(self, users, comment_obj):
        self.client.force_authenticate(users['superuser'][0])
        response = self.client.delete(f'/api/comments/{comment_obj.id}/')
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_normal_user_cannot_update_others_comments(self, users, comment_payload, comment_obj):
        self.client.force_authenticate(users['normal'][1])
        response = self.client.put(f'/api/comments/{comment_obj.id}/', comment_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_staff_user_cannot_update_others_comments(self, users, comment_payload, comment_obj):
        self.client.force_authenticate(users['staff'][0])
        comment_payload['content'] = "test" + comment_payload['content']
        response = self.client.put(f'/api/comments/{comment_obj.id}/', comment_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_superuser_cannot_update_others_comments(self, users, comment_payload, comment_obj):
        self.client.force_authenticate(users['superuser'][0])
        comment_payload['content'] = "test1" + comment_payload['content']
        response = self.client.put(f'/api/comments/{comment_obj.id}/', comment_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN
