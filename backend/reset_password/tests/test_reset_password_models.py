import copy
import pytest
from rest_framework import status
from rest_framework.test import APIClient
from test_utils.users_fixtures import users

from reset_password.models import ResetPassword

pytestmark = pytest.mark.django_db


def get_reset_password_detail_url(reset_password_id):
    return f"/api/reset_password/{reset_password_id}/"


@pytest.mark.django_db
class TestPublicResetPasswordAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    def test_outsider_can_see_public_reset_password(self, reset_password_obj0):
        print(f"created quiz in a group: {reset_password_obj0}")
        response = self.client.get('/api/reset_password/')
        assert response.status_code == status.HTTP_200_OK

    def test_outsider_cannot_create_reset_password(self, reset_password_payload):
        response = self.client.post('/api/reset_password/', reset_password_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_outsider_cannot_delete_reset_password(self, reset_password_obj0):
        response = self.client.delete(get_reset_password_detail_url(reset_password_obj0.id))
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_outsider_cannot_update_reset_password(self, reset_password_payload, reset_password_obj0):
        reset_password_payload['name'] = 'something different'
        response = self.client.put(get_reset_password_detail_url(reset_password_obj0.id), reset_password_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
class TestPrivateResetPasswordAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    @classmethod
    def teardown_class(cls):
        cls.client = None

    def test_normal_user_can_see_own_reset_password_in_list_view(self,
                                                             users,
                                                             reset_password_obj0,
                                                             reset_password_obj1):
        print(f'created reset_password: {reset_password_obj0} / {reset_password_obj1}')
        self.client.force_authenticate(users['normal'][1])
        response = self.client.get("/api/reset_password/", format='json')
        assert len(response.data.get('results')) == 1
        response_detail = self.client.get(get_reset_password_detail_url(reset_password_obj1.id))
        assert response_detail.status_code == status.HTTP_200_OK

    def test_normal_user_cannot_see_others_reset_password_in_detail_view(self, users, reset_password_obj0):
        # can not access to other's hidden reset_password.
        self.client.force_authenticate(users['normal'][1])
        url = get_reset_password_detail_url(reset_password_obj0.id)
        response = self.client.get(url)
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]

    def test_normal_user_can_create_reset_password(self, users, reset_password_payload):
        self.client.force_authenticate(users['normal'][0])
        reset_password_payload['user'] = users['normal'][0].id
        response = self.client.post("/api/reset_password/", reset_password_payload)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['user'] == users['normal'][0].id

    def test_normal_user_can_create_multiple_reset_password(self, users, reset_password_payload, reset_password_type_obj):
        self.client.force_authenticate(users['normal'][0])
        payload = []
        reset_password_payload['user'] = users['normal'][0].id
        another = {
            'question': 'another quiz name',
            'user': users['normal'][0].id,
            'type': reset_password_type_obj.id
        }
        payload.append(reset_password_payload)
        payload.append(another)
        response = self.client.post("/api/reset_password/", payload, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        reset_password = ResetPassword.objects.filter(user=users['normal'][0])
        assert len(reset_password) == 2

    def test_normal_user_cannot_create_others_reset_password(self, users, reset_password_payload):
        self.client.force_authenticate(users['normal'][0])
        reset_password_payload['user'] = users['normal'][1].id
        response = self.client.post("/api/reset_password/", reset_password_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_normal_user_can_update_own_reset_password(self, users, reset_password_payload, reset_password_obj0):
        self.client.force_authenticate(users['normal'][0])
        reset_password_payload['user'] = users['normal'][0].id
        reset_password_payload['question'] = "something new?"
        response = self.client.patch(get_reset_password_detail_url(reset_password_obj0.id), reset_password_payload)
        assert response.status_code == status.HTTP_200_OK

    def test_normal_user_cannot_update_others_reset_password(self, users, reset_password_payload, reset_password_obj1):
        self.client.force_authenticate(users['normal'][0])
        reset_password_payload['name'] = "something new?"
        reset_password_payload['user'] = reset_password_obj1.user.id
        response = self.client.put(get_reset_password_detail_url(reset_password_obj1.id), reset_password_payload)
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]

    def test_staff_user_can_update_reset_password(self, users, reset_password_payload, reset_password_obj0):
        first_reset_password_question = copy.copy(reset_password_obj0.question)
        self.client.force_authenticate(users['staff'][0])
        reset_password_payload['question'] = "test" + reset_password_obj0.question
        reset_password_payload['user'] = reset_password_obj0.user.id
        response = self.client.put(get_reset_password_detail_url(reset_password_obj0.id), reset_password_payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['question'] != first_reset_password_question

    def test_superuser_can_update_reset_password(self, users, reset_password_payload, reset_password_obj0):
        first_reset_password_question = copy.copy(reset_password_obj0.question)
        self.client.force_authenticate(users['superuser'][0])
        reset_password_payload['question'] = "test" + reset_password_obj0.question
        reset_password_payload['user'] = reset_password_obj0.user.id
        response = self.client.put(get_reset_password_detail_url(reset_password_obj0.id), reset_password_payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['question'] != first_reset_password_question

    def test_normal_user_can_delete_own_reset_password(self, users, reset_password_obj0):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.delete(get_reset_password_detail_url(reset_password_obj0.id))
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_normal_user_cannot_delete_others_reset_password(self, users, reset_password_obj1):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.delete(get_reset_password_detail_url(reset_password_obj1.id))
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]
