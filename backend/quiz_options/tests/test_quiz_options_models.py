import copy
import pytest
from rest_framework import status
from rest_framework.test import APIClient
from test_utils.users_fixtures import users
from test_utils.quizzes_fixtures import quiz_type_obj, quiz_payload, \
    quiz_obj0, quiz_obj1, staff_quiz_obj0, quiz_public, quiz_private_group
from test_utils.quiz_options_fixtures import option_payload, option_public, option_private, option_obj1
from quiz_options.models import QuizOptions

pytestmark = pytest.mark.django_db


def get_quiz_option_detail_url(quiz_option_id):
    return f"/api/quiz_options/{quiz_option_id}/"


@pytest.mark.django_db
class TestPublicQuizOptionsAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    def test_outsider_can_see_public_quiz_options(self, client, option_public):
        response = client.get('/api/quiz_options/')
        assert response.status_code == status.HTTP_200_OK
        detail_res = client.get(get_quiz_option_detail_url(option_public.id))
        assert detail_res.status_code == status.HTTP_200_OK

    def test_outsider_cannot_create_quiz_option(self, client, option_payload):
        response = client.post('/api/quiz_options/', option_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_outsider_cannot_delete_quiz_option(self, option_public):
        response = self.client.delete(get_quiz_option_detail_url(option_public.id))
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_outsider_cannot_update_quiz_option(self, option_payload, option_public):
        option_payload['content'] = 'something different'
        response = self.client.put(get_quiz_option_detail_url(option_public.id), option_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
class TestPrivateQuizOptionsAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    @classmethod
    def teardown_class(cls):
        cls.client = None

    def test_normal_user_can_see_own_quiz_options_in_list_view(self,
                                                               users,
                                                               option_public,
                                                               option_obj1,
                                                               option_private):
        # can access only to your quiz and public one.
        self.client.force_authenticate(users['normal'][1])
        response = self.client.get("/api/quiz_options/", format='json')
        assert len(response.data.get('results')) == 2

    def test_normal_user_cannot_see_others_quiz_options_in_detail_view(self, users, option_private):
        # can not access to other's hidden quiz_options.
        self.client.force_authenticate(users['normal'][1])
        url = get_quiz_option_detail_url(option_private.id)
        response = self.client.get(url)
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]

    def test_normal_user_can_create_quiz_options(self, users, option_payload):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.post("/api/quiz_options/", option_payload)
        assert response.status_code == status.HTTP_201_CREATED

    def test_normal_user_can_create_multiple_quiz_options(self, users, option_payload, quiz_obj0):
        self.client.force_authenticate(users['normal'][0])
        payload = []
        another = {
            'content': 'another quiz content',
            'is_answer': False,
            'quiz': quiz_obj0.id
        }
        payload.append(option_payload)
        payload.append(another)
        response = self.client.post("/api/quiz_options/", payload, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        response = self.client.get("/api/quiz_options/")
        assert len(response.data.get("results")) == 2

    def test_normal_user_cannot_create_others_quiz_option(self, users, option_payload, quiz_obj1):
        self.client.force_authenticate(users['normal'][0])
        option_payload['quiz'] = quiz_obj1.id
        response = self.client.post("/api/quiz_options/", option_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_normal_user_can_update_own_quiz_options(self, users, option_payload, option_public):
        self.client.force_authenticate(users['normal'][0])
        option_payload['content'] = "something new?"
        response = self.client.patch(get_quiz_option_detail_url(option_public.id), option_payload)
        assert response.status_code == status.HTTP_200_OK

    def test_normal_user_cannot_update_others_quiz_options(self, users, option_payload, option_obj1, quiz_obj1):
        self.client.force_authenticate(users['normal'][0])
        option_payload['content'] = "something new?"
        option_payload['quiz'] = quiz_obj1.id
        response = self.client.put(get_quiz_option_detail_url(option_obj1.id), option_payload)
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]

    def test_staff_user_can_update_quiz_options(self, users, option_payload, option_public):
        first_quiz_option_content = copy.copy(option_public.content)
        self.client.force_authenticate(users['staff'][0])
        option_payload['content'] = "test" + option_public.content
        response = self.client.put(get_quiz_option_detail_url(option_public.id), option_payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['content'] != first_quiz_option_content

    def test_superuser_can_update_quiz_options(self, users, option_payload, option_public):
        first_quiz_option_content = copy.copy(option_public.content)
        self.client.force_authenticate(users['superuser'][0])
        option_payload['content'] = "test" + option_public.content
        response = self.client.put(get_quiz_option_detail_url(option_public.id), option_payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['content'] != first_quiz_option_content

    def test_normal_user_can_delete_own_quiz_option(self, users, option_public):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.delete(get_quiz_option_detail_url(option_public.id))
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_normal_user_cannot_delete_others_quiz_option(self, users, option_obj1):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.delete(get_quiz_option_detail_url(option_obj1.id))
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]

    def get_user_of_quiz_option(self, quiz_option):
        owner = QuizOptions.objects.get(id=quiz_option.id).quiz.user
        return owner

    def get_group_of_quiz_option(self, quiz_option):
        group = list(QuizOptions.objects.get(id=quiz_option.id).quiz.quizgroups_set.all())
        return group[0].is_public
