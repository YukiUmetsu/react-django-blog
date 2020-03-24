import os
import copy
import pytest
import random
import string
import json
import datetime
from rest_framework import status
from rest_framework.test import APIClient
from test_utils.users_fixtures import users
from files.models import Files

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# If this is True, it removes everything including folder structure under media folder
# If this is False, it just removes all the files inside /media/uploads/year/date/day. \
# It leaves other files outside of this folder and leave the folder structure
EMPTY_MEDIA_FOLDER_AFTER_TEST = True

pytestmark = pytest.mark.django_db


def file_detail_url(id):
    return f'/api/files/{id}/'


def random_string(string_length=10):
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(string_length))


def file_path_from_url(url):
    arr = url.split("/")
    del arr[0:3]
    path = "/" + "/".join(arr)
    return path


def get_date_file_path():
    today = datetime.datetime.today()
    month = '{:02d}'.format(today.month)
    day = '{:02d}'.format(today.day)
    path = f"{today.year}/{month}/{day}/"
    return path


@pytest.fixture
def file_payload(users):
    yield {
        'type': 'image',
        'desc': random_string(50),
        'user': users['normal'][0].id
    }


@pytest.fixture
def img():
    with open(BASE_DIR + '/tests/1pixel.png', 'rb') as img:
        yield img


@pytest.fixture
def img2():
    with open(BASE_DIR + '/tests/1pixel2.png', 'rb') as img:
        yield img


@pytest.fixture
def img_obj(file_payload, users):
    with open(BASE_DIR + '/tests/1pixel.png', 'rb') as img:
        file_payload['file'] = img
        client = APIClient()
        client.force_authenticate(users['normal'][0])
        response = client.post("/api/files/", file_payload)
        img_obj = response.data
        return img_obj


@pytest.fixture()
def img_obj2(file_payload, users):
    with open(BASE_DIR + '/tests/1pixel2.png', 'rb') as img2:
        file_payload['user'] = users['normal'][1].id
        file_payload['file'] = img2
        client = APIClient()
        client.force_authenticate(users['normal'][1])
        response = client.post("/api/files/", file_payload)
        img_obj2 = response.data
        return img_obj2


@pytest.mark.django_db
class TestPublicFilesAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    @classmethod
    def teardown_class(cls):
        cls.client = None
        if EMPTY_MEDIA_FOLDER_AFTER_TEST:
            os.system(f'rm -rf {BASE_DIR}/../media/*')
        else:
            today_file_path = get_date_file_path()
            os.system(f'rm -rf {BASE_DIR}/../media/uploads/{today_file_path}*')

    def test_outsider_cannot_see_file(self, img_obj):
        print(f'created_image_obj: {img_obj.get("file")}')
        response = self.client.get('/api/files/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_outsider_cannot_create_file(self, file_payload, img):
        file_payload['file'] = img
        response = self.client.post(f'/api/files/', file_payload)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_outsider_cannot_delete_file(self, img_obj):
        response = self.client.delete(f'/api/files/{img_obj.get("id")}/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_outsider_cannot_update_file(self, file_payload, img_obj):
        img_id = img_obj.get("id")
        file_payload['desc'] = 'something different'
        del file_payload['file']
        response = self.client.patch(f'/api/files/{img_id}/', file_payload)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
@pytest.mark.usefixtures("users")
class TestPrivateFilesAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    @classmethod
    def teardown_class(cls):
        cls.client = None
        if EMPTY_MEDIA_FOLDER_AFTER_TEST:
            os.system(f'rm -rf {BASE_DIR}/../media/*')
        else:
            today_file_path = get_date_file_path()
            os.system(f'rm -rf {BASE_DIR}/../media/uploads/{today_file_path}*')

    def test_normal_user_can_see_own_file_in_list_view(self, users, img_obj, img_obj2):
        # create 2 file with 2 different users
        print(f'created_image_obj: {img_obj.get("file")}')
        print(f'created_image_obj2: {img_obj2.get("file")}')

        # can access only to your file.
        self.client.force_authenticate(users['normal'][0])
        response = self.client.get("/api/files/", format='json')
        user_id = users['normal'][0].id
        all_user1_file = True
        for file_obj in json.loads(response.content).get('results'):
            if file_obj.get("user") != user_id:
                all_user1_file = False

        assert all_user1_file == True

    def test_normal_user_cannot_see_others_file_in_detail_view(self, users, img_obj, img_obj2):
        # create 2 file with 2 different users
        print(f'created_image_obj: {img_obj.get("file")}')
        print(f'created_image_obj: {img_obj2.get("file")}')

        # can not access to other's file.
        self.client.force_authenticate(users['normal'][0])
        response = self.client.get(file_detail_url(img_obj2.get("id")))
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]

    def test_normal_user_can_create_file(self, users, file_payload, img):
        self.client.force_authenticate(users['normal'][0])
        file_payload['file'] = img
        response = self.client.post("/api/files/", file_payload)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['user'] == users['normal'][0].id

    def test_normal_user_cannot_create_others_file(self, users, file_payload, img2):
        self.client.force_authenticate(users['normal'][0])
        file_payload['user'] = users['normal'][1].id
        file_payload['file'] = img2
        response = self.client.post("/api/files/", file_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_normal_user_can_update_own_file(self, users, file_payload, img_obj):
        self.client.force_authenticate(users['normal'][0])
        file_payload['desc'] = "something new"
        img_id = img_obj.get("id")
        del file_payload['file']
        response = self.client.patch(file_detail_url(img_id), file_payload)
        assert response.status_code == status.HTTP_200_OK

    def test_normal_user_cannot_update_others_file(self, users, file_payload, img_obj2):
        self.client.force_authenticate(users['normal'][0])
        file_payload['desc'] = "something new"
        file_payload['user'] = users['normal'][0].id
        img_id = img_obj2.get("id")
        del file_payload['file']
        response = self.client.patch(file_detail_url(img_id), file_payload)
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]

    def test_staff_user_can_update_file(self, users, file_payload, img_obj):
        first_file_desc = copy.copy(img_obj.get("desc"))
        file_payload['desc'] = "test" + file_payload['desc']
        file_payload['user'] = img_obj.get("user")
        del file_payload['file']
        self.client.force_authenticate(users['staff'][0])
        response = self.client.patch(file_detail_url(img_obj.get("id")), file_payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['desc'] != first_file_desc

    def test_superuser_can_update_file(self, users, file_payload, img_obj):
        first_file_desc = copy.copy(file_payload['desc'])
        file_payload['desc'] = "test1" + file_payload['desc']
        file_payload['user'] = img_obj.get("user")
        del file_payload['file']
        self.client.force_authenticate(users['superuser'][0])
        response = self.client.patch(file_detail_url(img_obj.get("id")), file_payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data.get('desc') != first_file_desc

    def test_normal_user_can_delete_own_file(self, users, img_obj):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.delete(file_detail_url(img_obj.get("id")))
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_normal_user_cannot_delete_others_file(self, users, img_obj2):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.delete(file_detail_url(img_obj2.get("id")))
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]
