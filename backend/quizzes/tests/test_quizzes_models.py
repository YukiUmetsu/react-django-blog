import copy
import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from test_utils.users_fixtures import users
from test_utils.quizzes_fixtures import quiz_type_obj, quiz_payload, \
    quiz_obj0, quiz_obj1, staff_quiz_obj0, quiz_public, quiz_private_group
from quizzes.models import Quizzes

pytestmark = pytest.mark.django_db


def get_quiz_detail_url(quiz_id):
    return f"/api/quizzes/{quiz_id}/"


@pytest.mark.django_db
class TestPublicQuizzesAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    def test_outsider_can_see_public_quizzes(self, client, quiz_public):
        print(f"created quiz in a group: {quiz_public}")
        response = client.get('/api/quizzes/')
        assert response.status_code == status.HTTP_200_OK

    def test_outsider_cannot_create_quiz(self, client, quiz_payload):
        response = client.post('/api/quizzes/', quiz_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_outsider_cannot_delete_quiz(self, quiz_public):
        response = self.client.delete(get_quiz_detail_url(quiz_public.id))
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_outsider_cannot_update_quiz(self, quiz_payload, quiz_public):
        quiz_payload['name'] = 'something different'
        response = self.client.put(get_quiz_detail_url(quiz_public.id), quiz_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
class TestPrivateQuizzesAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    @classmethod
    def teardown_class(cls):
        cls.client = None

    def test_normal_user_can_see_own_quizzes_in_list_view(self,
                                                          users,
                                                          quiz_public,
                                                          quiz_obj1,
                                                          quiz_private_group):
        # quiz with user0, quiz with user1, quiz with user0 but group is hidden
        print(f'created quizzes: {quiz_public} / {quiz_obj1} / {quiz_private_group}')
        # can access only to your quiz and public one.
        self.client.force_authenticate(users['normal'][1])
        response = self.client.get("/api/quizzes/", format='json')
        assert len(response.data.get('results')) == 2

    def test_normal_user_cannot_see_others_quizzes_in_detail_view(self, users, quiz_private_group):
        # can not access to other's hidden quizzes.
        self.client.force_authenticate(users['normal'][1])
        url = get_quiz_detail_url(quiz_private_group.id)
        response = self.client.get(url)
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]

    def test_normal_user_can_create_quizzes(self, users, quiz_payload):
        self.client.force_authenticate(users['normal'][0])
        quiz_payload['user'] = users['normal'][0].id
        response = self.client.post("/api/quizzes/", quiz_payload)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['user'] == users['normal'][0].id

    def test_normal_user_can_create_multiple_quizzes(self, users, quiz_payload, quiz_type_obj):
        self.client.force_authenticate(users['normal'][0])
        payload = []
        quiz_payload['user'] = users['normal'][0].id
        another = {
            'question': 'another quiz name',
            'user': users['normal'][0].id,
            'type': quiz_type_obj.id
        }
        payload.append(quiz_payload)
        payload.append(another)
        response = self.client.post("/api/quizzes/", payload, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        quizzes = Quizzes.objects.filter(user=users['normal'][0])
        assert len(quizzes) == 2

    def test_normal_user_cannot_create_others_quiz(self, users, quiz_payload):
        self.client.force_authenticate(users['normal'][0])
        quiz_payload['user'] = users['normal'][1].id
        response = self.client.post("/api/quizzes/", quiz_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_normal_user_can_update_own_quizzes(self, users, quiz_payload, quiz_obj0):
        self.client.force_authenticate(users['normal'][0])
        quiz_payload['user'] = users['normal'][0].id
        quiz_payload['question'] = "something new?"
        response = self.client.patch(get_quiz_detail_url(quiz_obj0.id), quiz_payload)
        assert response.status_code == status.HTTP_200_OK

    def test_normal_user_cannot_update_others_quizzes(self, users, quiz_payload, quiz_obj1):
        self.client.force_authenticate(users['normal'][0])
        quiz_payload['name'] = "something new?"
        quiz_payload['user'] = quiz_obj1.user.id
        response = self.client.put(get_quiz_detail_url(quiz_obj1.id), quiz_payload)
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]

    def test_staff_user_can_update_quizzes(self, users, quiz_payload, quiz_obj0):
        first_quiz_question = copy.copy(quiz_obj0.question)
        self.client.force_authenticate(users['staff'][0])
        quiz_payload['question'] = "test" + quiz_obj0.question
        quiz_payload['user'] = quiz_obj0.user.id
        response = self.client.put(get_quiz_detail_url(quiz_obj0.id), quiz_payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['question'] != first_quiz_question

    def test_superuser_can_update_quizzes(self, users, quiz_payload, quiz_obj0):
        first_quiz_question = copy.copy(quiz_obj0.question)
        self.client.force_authenticate(users['superuser'][0])
        quiz_payload['question'] = "test" + quiz_obj0.question
        quiz_payload['user'] = quiz_obj0.user.id
        response = self.client.put(get_quiz_detail_url(quiz_obj0.id), quiz_payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['question'] != first_quiz_question

    def test_normal_user_can_delete_own_quiz(self, users, quiz_obj0):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.delete(get_quiz_detail_url(quiz_obj0.id))
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_normal_user_cannot_delete_others_quiz(self, users, quiz_obj1):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.delete(get_quiz_detail_url(quiz_obj1.id))
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]
