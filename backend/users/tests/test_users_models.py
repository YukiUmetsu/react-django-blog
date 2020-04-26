import pytest
from faker import Faker
import random
import string
import os
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from test_utils.users_fixtures import users, user_payload, staff_user_payload, superuser_payload, \
    user_payload_with_country
from test_utils.countries_fixtures import country_obj, country_payload
from countries.models import Countries

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def random_string(string_length=10):
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(string_length))


@pytest.fixture
def file_payload(users):
    yield {
        'type': 'image',
        'desc': random_string(50),
        'user': users['normal'][0].id
    }


@pytest.fixture
def img_obj(file_payload, users):
    with open(BASE_DIR + '/tests/1pixel.png', 'rb') as img:
        file_payload['file'] = img
        client = APIClient()
        client.force_authenticate(users['normal'][0])
        response = client.post("/api/files/", file_payload)
        img_obj = response.data
        return img_obj


def get_user_detail_url(user_id):
    return f"/api/users/{user_id}/"


USERS_API_URL = '/api/users/'


@pytest.mark.django_db
class TestPublicUsersAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    def test_create_user_with_email_successful(self):
        """Test creating a new user with email"""
        email = "testuseremail@test.com"
        password = "Hey12345hey!"
        user = get_user_model().objects.create_user(
            email=email,
            password=password
        )
        assert user.email == email
        assert user.check_password(password) == True

    def test_outsider_cannot_access_to_other_user_data_in_list_view(self):
        response = self.client.get(USERS_API_URL)
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_401_UNAUTHORIZED]

    def test_outsider_cannot_access_to_other_user_data_in_detail_view(self, users):
        detail_view_url = get_user_detail_url(users['normal'][0].id)
        response = self.client.get(detail_view_url)
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_401_UNAUTHORIZED]

    def test_outsider_cannot_create_user(self, user_payload):
        response = self.client.post(USERS_API_URL, user_payload)
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_401_UNAUTHORIZED]


@pytest.mark.django_db
class TestPrivateUsersAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    def test_normal_user_cannot_access_to_other_user_data_in_list_view(self, users):
        self.client.force_authenticate(users['normal'][1])
        response = self.client.get(USERS_API_URL)
        assert len(response.data.get('results')) == 1

    def test_normal_user_cannot_access_to_other_user_data_in_detail_view(self, users):
        self.client.force_authenticate(users['normal'][1])
        detail_view_url = get_user_detail_url(users['normal'][0].id)
        response = self.client.get(detail_view_url)
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]

    def test_normal_user_can_access_to_own_user_data_in_detail_view(self, users):
        self.client.force_authenticate(users['normal'][0])
        detail_view_url = get_user_detail_url(users['normal'][0].id)
        response = self.client.get(detail_view_url)
        assert response.status_code == status.HTTP_200_OK

    def test_normal_user_can_access_to_own_user_data_in_me_detail_view(self, users):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.get("/api/users/me/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data.get("id") == users['normal'][0].id

    def test_normal_user_cannot_create_user(self, users, user_payload):
        self.client.force_authenticate(users['normal'][1])
        response = self.client.post(USERS_API_URL, user_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_normal_user_cannot_edit_another_user(self, users):
        self.client.force_authenticate(users['normal'][0])
        new_first_name = 'new_first_name!'
        response = self.client.patch(get_user_detail_url(users['normal'][1].id), {'first_name': new_first_name})
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]

    def test_normal_user_can_edit_profile_img(self, users, img_obj):
        self.client.force_authenticate(users['normal'][0])
        payload = {'profile_img': img_obj.get('id')}
        response = self.client.patch(get_user_detail_url(users['normal'][0].id), payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data.get('profile_img').get('id') == img_obj.get('id')

    def test_normal_user_cannot_edit_profile_img_with_file_id_not_exist(self, users):
        self.client.force_authenticate(users['normal'][0])
        payload = {'profile_img': '199'}
        response = self.client.patch(get_user_detail_url(users['normal'][0].id), payload)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_staff_user_can_access_user_list(self, users):
        self.client.force_authenticate(users['staff'][0])
        response = self.client.get(USERS_API_URL)
        assert response.status_code == status.HTTP_200_OK

    def test_staff_can_access_to_user_data_in_detail_view(self, users):
        self.client.force_authenticate(users['staff'][0])
        detail_view_url = get_user_detail_url(users['normal'][0].id)
        response = self.client.get(detail_view_url)
        assert response.status_code == status.HTTP_200_OK

    def test_staff_can_create_user(self, users, user_payload):
        self.client.force_authenticate(users['staff'][0])
        response = self.client.post(USERS_API_URL, user_payload)
        if response.status_code != status.HTTP_201_CREATED:
            print(response.data)

        assert response.status_code == status.HTTP_201_CREATED

    def test_staff_cannot_create_another_staff(self, users, staff_user_payload):
        self.client.force_authenticate(users['staff'][0])
        response = self.client.post(USERS_API_URL, staff_user_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_staff_cannot_edit_another_staff(self, users):
        self.client.force_authenticate(users['staff'][0])
        new_first_name = 'new_first_name!'
        response = self.client.patch(get_user_detail_url(users['staff'][1].id), {'first_name': new_first_name})
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_staff_cannot_create_superuser(self, users, superuser_payload):
        self.client.force_authenticate(users['staff'][0])
        response = self.client.post(USERS_API_URL, superuser_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_staff_cannot_edit_superuser(self, users):
        self.client.force_authenticate(users['staff'][0])
        new_first_name = 'new_first_name!'
        response = self.client.patch(get_user_detail_url(users['superuser'][0].id), {'first_name': new_first_name})
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_superuser_can_create_staff_user(self, users, staff_user_payload):
        self.client.force_authenticate(users['superuser'][0])
        response = self.client.post(USERS_API_URL, staff_user_payload)

        if response.status_code != status.HTTP_201_CREATED:
            print(response.data)

        assert response.status_code == status.HTTP_201_CREATED
        user = get_user_model().objects.get(email=staff_user_payload.get('email', ''))
        assert user.is_staff == True

    def test_superuser_can_create_superuser(self, users, superuser_payload):
        self.client.force_authenticate(users['superuser'][0])
        response = self.client.post(USERS_API_URL, superuser_payload)
        assert response.status_code == status.HTTP_201_CREATED
        user = get_user_model().objects.get(email=superuser_payload.get('email', ''))
        assert user.is_superuser == True

    def test_superuser_can_edit_another_superuser(self, users):
        self.client.force_authenticate(users['superuser'][0])
        new_first_name = 'Your new first_name'
        payload = {'first_name': new_first_name}
        response = self.client.patch(get_user_detail_url(users['superuser'][1].id), payload)
        assert response.status_code == status.HTTP_200_OK
        user = get_user_model().objects.get(id=users['superuser'][1].id)
        assert user.first_name == new_first_name

    def test_can_create_user_with_country(self, users, user_payload_with_country):
        self.client.force_authenticate(users['staff'][0])
        response = self.client.post(USERS_API_URL, user_payload_with_country)
        assert response.status_code == status.HTTP_201_CREATED
        user = get_user_model().objects.get(email=user_payload_with_country.get('email', ''))
        assert user.country.id == user_payload_with_country.get('country', '')
