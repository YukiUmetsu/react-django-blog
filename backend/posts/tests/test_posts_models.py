import pytest
from rest_framework import status
from test_utils.users_fixtures import users
from test_utils.categories_fixtures import category_payload, category_obj
from test_utils.post_states_fixtures import all_states
from test_utils.posts_fixtures import post_min_payload, post_payload, post_obj, img_obj, post_scheduled_at_past, post_scheduled_at_future
from test_utils.tags_fixtures import tag_payload, staff_tag_obj0
from rest_framework.test import APIClient
from posts.models import Posts
from post_states.models import PostStates

pytestmark = pytest.mark.django_db

HTML_CONTENT_SCRIPT = '<p>Lorem ipsum dolor sit amet</p><script>alert("abc")</script><p>Lorem ipsum dolor sit amet</p>'
HTML_CONTENT_HREF = '<p>Lorem ipsum dolor sit amet</p><a href=javascript:alert(String.fromCharCode(88,83,83))>Click me!</a><p>Lorem ipsum dolor sit amet</p>'

@pytest.mark.django_db
class TestPublicPostsAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    def test_outsider_can_see_posts(self, post_obj):
        response = self.client.get("/api/posts/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data.get('results')[0].get('title') == post_obj.title

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

    def test_post_state_update_from_scheduled_to_published(self, users, post_scheduled_at_past):
        published_post_state = PostStates.objects.get(name='published')
        self.client.force_authenticate(users['staff'][0])
        response = self.client.get(f'/api/posts/{post_scheduled_at_past.id}/')
        assert response.data.get('post_state').get('id') == published_post_state.id

    def test_post_state_stays_same_if_scheduled_for_future(self, users, post_scheduled_at_future):
        scheduled_post_state = PostStates.objects.get(name='scheduled')
        self.client.force_authenticate(users['staff'][0])
        response = self.client.get(f'/api/posts/{post_scheduled_at_future.id}/')
        assert response.data.get('post_state').get('id') == scheduled_post_state.id

    def test_sanitize_html_for_post_content_script(self, users, post_payload):
        post_payload['content'] = HTML_CONTENT_SCRIPT
        self.client.force_authenticate(users['staff'][0])
        response = self.client.post("/api/posts/", post_payload)
        assert response.status_code == status.HTTP_201_CREATED
        assert "<script>" not in response.data.get('content', '')

    def test_sanitize_html_for_post_content_javascript(self, users, post_payload):
        post_payload['content'] = HTML_CONTENT_HREF
        self.client.force_authenticate(users['staff'][0])
        response = self.client.post("/api/posts/", post_payload)
        assert response.status_code == status.HTTP_201_CREATED
        assert "javascript" not in response.data.get('content', '')
