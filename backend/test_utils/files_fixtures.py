import os
import pytest
import random
import string
import datetime
from rest_framework.test import APIClient
from test_utils.users_fixtures import users
from files.models import Files

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
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
