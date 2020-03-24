import string
import random
import copy
import pytest
from rest_framework import status
from rest_framework.test import APIClient
from test_utils.users_fixtures import users
from quiz_types.models import QuizTypes

pytestmark = pytest.mark.django_db


def random_string(string_length=10):
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(string_length))


def quiz_type_detail_url(quiz_type_id):
    return f"/api/quiz_types/{quiz_type_id}/"


@pytest.fixture
def quiz_type_payload(users):
    yield {
        'name': random_string(50),
    }


@pytest.fixture
def quiz_type_obj(quiz_type_payload, users):
    quiz_type = QuizTypes.objects.create(**quiz_type_payload)
    yield quiz_type
    quiz_type.delete()


@pytest.mark.django_db
class TestPublicQuizTypesAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    def teardown_class(cls):
        cls.client = None

    def test_outsider_can_see_quiz_type(self, quiz_type_obj):
        response = self.client.get(quiz_type_detail_url(quiz_type_obj.id))
        assert response.status_code == status.HTTP_200_OK

    def test_outsider_cannot_create_quiz_type(self, quiz_type_payload):
        response = self.client.post(f'/api/quiz_types/', quiz_type_payload)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_outsider_cannot_delete_quiz_type(self, quiz_type_obj):
        response = self.client.delete(quiz_type_detail_url(quiz_type_obj.id))
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_outsider_cannot_update_quiz_type(self, quiz_type_payload, quiz_type_obj):
        quiz_type_id = quiz_type_obj.id
        quiz_type_payload['name'] = 'something different'
        response = self.client.patch(f'/api/quiz_types/{quiz_type_id}/', quiz_type_payload)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestPrivateQuizTypesAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    @classmethod
    def teardown_class(cls):
        cls.client = None

    def test_normal_user_can_see_quiz_type(self, users, quiz_type_obj):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.get(quiz_type_detail_url(quiz_type_obj.id))
        assert response.status_code == status.HTTP_200_OK

    def test_normal_user_cannot_create_quiz_type(self, users, quiz_type_payload):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.post(f'/api/quiz_types/', quiz_type_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_normal_user_cannot_update_quiz_type(self, users, quiz_type_payload, quiz_type_obj):
        self.client.force_authenticate(users['normal'][0])
        quiz_type_payload['name'] = "something new"
        quiz_type_id = quiz_type_obj.id
        response = self.client.patch(quiz_type_detail_url(quiz_type_id), quiz_type_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_normal_user_cannot_delete_quiz_type(self, users, quiz_type_payload, quiz_type_obj):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.delete(quiz_type_detail_url(quiz_type_obj.id), quiz_type_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_staff_user_can_create_quiz_type(self, users, quiz_type_payload):
        self.client.force_authenticate(users['staff'][0])
        response = self.client.post('/api/quiz_types/', quiz_type_payload)
        assert response.status_code == status.HTTP_201_CREATED

    def test_staff_user_can_update_quiz_type(self, users, quiz_type_payload, quiz_type_obj):
        first_quiz_type_desc = copy.copy(quiz_type_obj.name)
        quiz_type_payload['name'] = "test" + quiz_type_payload['name']
        self.client.force_authenticate(users['staff'][0])
        response = self.client.patch(quiz_type_detail_url(quiz_type_obj.id), quiz_type_payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] != first_quiz_type_desc

    def test_superuser_can_update_quiz_type(self, users, quiz_type_payload, quiz_type_obj):
        first_quiz_type_desc = copy.copy(quiz_type_payload['name'])
        quiz_type_payload['name'] = "test1" + quiz_type_payload['name']
        self.client.force_authenticate(users['superuser'][0])
        response = self.client.patch(quiz_type_detail_url(quiz_type_obj.id), quiz_type_payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data.get('name') != first_quiz_type_desc

    def test_staff_user_can_delete_quiz_type(self, users, quiz_type_obj):
        self.client.force_authenticate(users['staff'][0])
        response = self.client.delete(quiz_type_detail_url(quiz_type_obj.id))
        assert response.status_code == status.HTTP_204_NO_CONTENT
