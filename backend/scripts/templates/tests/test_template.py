import copy
import pytest
from rest_framework import status
from rest_framework.test import APIClient
from test_utils.users_fixtures import users

from app_name__.models import Model__

pytestmark = pytest.mark.django_db


def get_singular___detail_url(singular___id):
    return f"/api/app_name__/{singular___id}/"


@pytest.mark.django_db
class TestPublicModel__API:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    def test_outsider_can_see_public_app_name__(self, client, singular___obj0):
        print(f"created quiz in a group: {singular___obj0}")
        response = client.get('/api/app_name__/')
        assert response.status_code == status.HTTP_200_OK

    def test_outsider_cannot_create_singular__(self, client, singular___payload):
        response = client.post('/api/app_name__/', singular___payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_outsider_cannot_delete_singular__(self, singular___obj0):
        response = self.client.delete(get_singular___detail_url(singular___obj0.id))
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_outsider_cannot_update_singular__(self, singular___payload, singular___obj0):
        singular___payload['name'] = 'something different'
        response = self.client.put(get_singular___detail_url(singular___obj0.id), singular___payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
class TestPrivateModel__API:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    @classmethod
    def teardown_class(cls):
        cls.client = None

    def test_normal_user_can_see_own_app_name___in_list_view(self,
                                                             users,
                                                             singular___obj0,
                                                             singular___obj1):
        print(f'created app_name__: {singular___obj0} / {singular___obj1}')
        self.client.force_authenticate(users['normal'][1])
        response = self.client.get("/api/app_name__/", format='json')
        assert len(response.data.get('results')) == 1
        response_detail = self.client.get(get_singular___detail_url(singular___obj1.id))
        assert response_detail.status_code == status.HTTP_200_OK

    def test_normal_user_cannot_see_others_app_name___in_detail_view(self, users, singular___obj0):
        # can not access to other's hidden app_name__.
        self.client.force_authenticate(users['normal'][1])
        url = get_singular___detail_url(singular___obj0.id)
        response = self.client.get(url)
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]

    def test_normal_user_can_create_app_name__(self, users, singular___payload):
        self.client.force_authenticate(users['normal'][0])
        singular___payload['user'] = users['normal'][0].id
        response = self.client.post("/api/app_name__/", singular___payload)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['user'] == users['normal'][0].id

    def test_normal_user_can_create_multiple_app_name__(self, users, singular___payload, singular___type_obj):
        self.client.force_authenticate(users['normal'][0])
        payload = []
        singular___payload['user'] = users['normal'][0].id
        another = {
            'question': 'another quiz name',
            'user': users['normal'][0].id,
            'type': singular___type_obj.id
        }
        payload.append(singular___payload)
        payload.append(another)
        response = self.client.post("/api/app_name__/", payload, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        app_name__ = Model__.objects.filter(user=users['normal'][0])
        assert len(app_name__) == 2

    def test_normal_user_cannot_create_others_singular__(self, users, singular___payload):
        self.client.force_authenticate(users['normal'][0])
        singular___payload['user'] = users['normal'][1].id
        response = self.client.post("/api/app_name__/", singular___payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_normal_user_can_update_own_app_name__(self, users, singular___payload, singular___obj0):
        self.client.force_authenticate(users['normal'][0])
        singular___payload['user'] = users['normal'][0].id
        singular___payload['question'] = "something new?"
        response = self.client.patch(get_singular___detail_url(singular___obj0.id), singular___payload)
        assert response.status_code == status.HTTP_200_OK

    def test_normal_user_cannot_update_others_app_name__(self, users, singular___payload, singular___obj1):
        self.client.force_authenticate(users['normal'][0])
        singular___payload['name'] = "something new?"
        singular___payload['user'] = singular___obj1.user.id
        response = self.client.put(get_singular___detail_url(singular___obj1.id), singular___payload)
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]

    def test_staff_user_can_update_app_name__(self, users, singular___payload, singular___obj0):
        first_singular___question = copy.copy(singular___obj0.question)
        self.client.force_authenticate(users['staff'][0])
        singular___payload['question'] = "test" + singular___obj0.question
        singular___payload['user'] = singular___obj0.user.id
        response = self.client.put(get_singular___detail_url(singular___obj0.id), singular___payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['question'] != first_singular___question

    def test_superuser_can_update_app_name__(self, users, singular___payload, singular___obj0):
        first_singular___question = copy.copy(singular___obj0.question)
        self.client.force_authenticate(users['superuser'][0])
        singular___payload['question'] = "test" + singular___obj0.question
        singular___payload['user'] = singular___obj0.user.id
        response = self.client.put(get_singular___detail_url(singular___obj0.id), singular___payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['question'] != first_singular___question

    def test_normal_user_can_delete_own_singular__(self, users, singular___obj0):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.delete(get_singular___detail_url(singular___obj0.id))
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_normal_user_cannot_delete_others_singular__(self, users, singular___obj1):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.delete(get_singular___detail_url(singular___obj1.id))
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]
