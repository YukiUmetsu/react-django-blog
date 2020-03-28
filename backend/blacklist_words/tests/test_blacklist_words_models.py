import copy
import pytest
from rest_framework import status
from rest_framework.test import APIClient
from test_utils.users_fixtures import users

from blacklist_words.models import BlacklistWords

pytestmark = pytest.mark.django_db


def get_blacklist_word_detail_url(blacklist_word_id):
    return f"/api/blacklist_words/{blacklist_word_id}/"


@pytest.fixture
@pytest.mark.django_db
def blacklist_word_obj0():
    obj = BlacklistWords.objects.create(content="fuck", used_in_comments=True, used_in_tickets=True)
    yield obj
    if obj.id is not None:
        obj.delete()


@pytest.fixture
def blacklist_word_payload():
    yield {
        'content': 'this is a payload content.',
        'used_in_tickets': 1,
        'used_in_comments': 1
    }


@pytest.mark.django_db
class TestPublicBlacklistWordsAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    def test_outsider_cannot_see_blacklist_words(self, blacklist_word_obj0):
        print(f"created quiz in a group: {blacklist_word_obj0}")
        response = self.client.get('/api/blacklist_words/')
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_outsider_cannot_create_blacklist_word(self, blacklist_word_payload):
        response = self.client.post('/api/blacklist_words/', blacklist_word_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_outsider_cannot_delete_blacklist_word(self, blacklist_word_obj0):
        response = self.client.delete(get_blacklist_word_detail_url(blacklist_word_obj0.id))
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_outsider_cannot_update_blacklist_word(self, blacklist_word_payload, blacklist_word_obj0):
        blacklist_word_payload['content'] = 'something different'
        response = self.client.put(get_blacklist_word_detail_url(blacklist_word_obj0.id), blacklist_word_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
class TestPrivateBlacklistWordsAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    @classmethod
    def teardown_class(cls):
        cls.client = None

    def test_normal_user_cannot_see_blacklist_words(self, users, blacklist_word_obj0):
        self.client.force_authenticate(users['normal'][1])
        response = self.client.get("/api/blacklist_words/", format='json')
        assert response.status_code == status.HTTP_403_FORBIDDEN
        response_detail = self.client.get(get_blacklist_word_detail_url(blacklist_word_obj0.id))
        assert response_detail.status_code == status.HTTP_403_FORBIDDEN

    def test_normal_user_cannot_create_blacklist_words(self, users, blacklist_word_payload):
        self.client.force_authenticate(users['normal'][0])
        blacklist_word_payload['user'] = users['normal'][0].id
        response = self.client.post("/api/blacklist_words/", blacklist_word_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_staff_user_can_create_multiple_blacklist_words(self, users, blacklist_word_payload):
        self.client.force_authenticate(users['staff'][0])
        payload = []
        another = {
            'content': 'another quiz content'
        }
        payload.append(blacklist_word_payload)
        payload.append(another)
        response = self.client.post("/api/blacklist_words/", payload, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        blacklist_words = BlacklistWords.objects.all()
        assert len(blacklist_words) == 2

    def test_normal_user_cannot_update_blacklist_words(self, users, blacklist_word_payload, blacklist_word_obj0):
        self.client.force_authenticate(users['normal'][0])
        blacklist_word_payload['content'] = "something new?"
        response = self.client.patch(get_blacklist_word_detail_url(blacklist_word_obj0.id), blacklist_word_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_staff_user_can_update_blacklist_words(self, users, blacklist_word_payload, blacklist_word_obj0):
        first_blacklist_word_content = copy.copy(blacklist_word_obj0.content)
        self.client.force_authenticate(users['staff'][0])
        blacklist_word_payload['content'] = "test" + blacklist_word_obj0.content
        response = self.client.put(get_blacklist_word_detail_url(blacklist_word_obj0.id), blacklist_word_payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['content'] != first_blacklist_word_content

    def test_superuser_can_update_blacklist_words(self, users, blacklist_word_payload, blacklist_word_obj0):
        first_blacklist_word_content = copy.copy(blacklist_word_obj0.content)
        self.client.force_authenticate(users['superuser'][0])
        blacklist_word_payload['content'] = "test" + blacklist_word_obj0.content
        response = self.client.put(get_blacklist_word_detail_url(blacklist_word_obj0.id), blacklist_word_payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['content'] != first_blacklist_word_content

    def test_normal_user_cannot_delete_blacklist_word(self, users, blacklist_word_obj0):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.delete(get_blacklist_word_detail_url(blacklist_word_obj0.id))
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_staff_user_can_delete_blacklist_word(self, users, blacklist_word_obj0):
        self.client.force_authenticate(users['staff'][0])
        response = self.client.delete(get_blacklist_word_detail_url(blacklist_word_obj0.id))
        assert response.status_code == status.HTTP_204_NO_CONTENT
