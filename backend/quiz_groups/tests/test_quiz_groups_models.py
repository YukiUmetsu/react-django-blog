import copy
import pytest
from rest_framework import status
from rest_framework.test import APIClient
from test_utils.users_fixtures import users
from test_utils.quiz_groups_fixtures import quiz_group_payload, \
    hidden_quiz_group_payload, \
    quiz_group_obj0, \
    quiz_group_obj1, \
    hidden_quiz_g_obj

from quiz_groups.models import QuizGroups

pytestmark = pytest.mark.django_db


def get_quiz_group_detail_url(quiz_group_id):
    return f"/api/quiz_groups/{quiz_group_id}/"


@pytest.mark.django_db
class TestPublicQuizGroupsAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    def test_outsider_can_see_public_quiz_groups(self, client, quiz_group_obj0):
        print(f"created quiz in a group: {quiz_group_obj0}")
        response = client.get('/api/quiz_groups/')
        assert response.status_code == status.HTTP_200_OK
        response = client.get(get_quiz_group_detail_url(quiz_group_obj0.id))
        assert response.status_code == status.HTTP_200_OK

    def test_outsider_cannot_create_quiz_group(self, client, quiz_group_payload):
        response = client.post('/api/quiz_groups/', quiz_group_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_outsider_cannot_delete_quiz_group(self, quiz_group_obj0):
        response = self.client.delete(get_quiz_group_detail_url(quiz_group_obj0.id))
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_outsider_cannot_update_quiz_group(self, quiz_group_payload, quiz_group_obj0):
        quiz_group_payload['name'] = 'something different'
        response = self.client.put(get_quiz_group_detail_url(quiz_group_obj0.id), quiz_group_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
class TestPrivateQuizGroupsAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    @classmethod
    def teardown_class(cls):
        cls.client = None

    def test_normal_user_can_see_own_quiz_groups_in_list_view(self,
                                                              users,
                                                              quiz_group_obj0,
                                                              quiz_group_obj1,
                                                              hidden_quiz_g_obj):
        # quiz with user0, quiz with user1, quiz with user0 but group is hidden
        print(f'created quiz_groups: {quiz_group_obj0} / {quiz_group_obj1} / {hidden_quiz_g_obj}')
        # can access only to your quiz and public one.
        self.client.force_authenticate(users['normal'][1])
        response = self.client.get("/api/quiz_groups/", format='json')
        assert len(response.data.get('results')) == 2

    def test_normal_user_cannot_see_others_quiz_groups_in_detail_view(self, users, hidden_quiz_g_obj):
        # can not access to other's hidden quiz_groups.
        self.client.force_authenticate(users['normal'][1])
        url = get_quiz_group_detail_url(hidden_quiz_g_obj.id)
        response = self.client.get(url)
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]

    def test_normal_user_can_create_quiz_groups(self, users, quiz_group_payload):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.post("/api/quiz_groups/", quiz_group_payload)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['user'] == users['normal'][0].id

    def test_normal_user_can_create_multiple_quiz_groups(self, users, quiz_group_payload):
        self.client.force_authenticate(users['normal'][0])
        payload = []
        quiz_group_payload['user'] = users['normal'][0].id
        another = {
            'name': 'another quiz group name',
            'user': users['normal'][0].id,
            'description': "another great quiz group",
            'is_public': 1
        }
        payload.append(quiz_group_payload)
        payload.append(another)
        response = self.client.post("/api/quiz_groups/", payload, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        quiz_groups = QuizGroups.objects.filter(user=users['normal'][0])
        assert len(quiz_groups) == 2

    def test_normal_user_cannot_create_others_quiz_group(self, users, quiz_group_payload):
        self.client.force_authenticate(users['normal'][0])
        quiz_group_payload['user'] = users['normal'][1].id
        response = self.client.post("/api/quiz_groups/", quiz_group_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_normal_user_can_update_own_quiz_groups(self, users, quiz_group_payload, quiz_group_obj0):
        self.client.force_authenticate(users['normal'][0])
        quiz_group_payload['name'] = "something new?"
        response = self.client.patch(get_quiz_group_detail_url(quiz_group_obj0.id), quiz_group_payload)
        assert response.status_code == status.HTTP_200_OK

    def test_normal_user_cannot_update_others_quiz_groups(self, users, quiz_group_payload, quiz_group_obj1):
        self.client.force_authenticate(users['normal'][0])
        quiz_group_payload['name'] = "something new?"
        quiz_group_payload['user'] = quiz_group_obj1.user.id
        response = self.client.put(get_quiz_group_detail_url(quiz_group_obj1.id), quiz_group_payload)
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]

    def test_staff_user_can_update_quiz_groups(self, users, quiz_group_payload, quiz_group_obj0):
        first_quiz_group_name = copy.copy(quiz_group_obj0.name)
        self.client.force_authenticate(users['staff'][0])
        quiz_group_payload['name'] = "test" + quiz_group_obj0.name
        quiz_group_payload['user'] = quiz_group_obj0.user.id
        response = self.client.put(get_quiz_group_detail_url(quiz_group_obj0.id), quiz_group_payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] != first_quiz_group_name

    def test_superuser_can_update_quiz_groups(self, users, quiz_group_payload, quiz_group_obj0):
        first_quiz_group_name = copy.copy(quiz_group_obj0.name)
        self.client.force_authenticate(users['superuser'][0])
        quiz_group_payload['name'] = "test" + quiz_group_obj0.name
        quiz_group_payload['user'] = quiz_group_obj0.user.id
        response = self.client.put(get_quiz_group_detail_url(quiz_group_obj0.id), quiz_group_payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] != first_quiz_group_name

    def test_normal_user_can_delete_own_quiz_group(self, users, quiz_group_obj0):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.delete(get_quiz_group_detail_url(quiz_group_obj0.id))
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_normal_user_cannot_delete_others_quiz_group(self, users, quiz_group_obj1):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.delete(get_quiz_group_detail_url(quiz_group_obj1.id))
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]
