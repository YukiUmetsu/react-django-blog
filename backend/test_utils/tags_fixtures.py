import random
import string
import pytest
from tags.models import Tags
from test_utils.users_fixtures import users


@pytest.fixture
def tag_payload():
    return {
        'name': f'{random_string(15)} tag'
    }


@pytest.fixture
def tag_obj0(users, tag_payload):
    tag_payload['user'] = users['normal'][0]
    tag = Tags.objects.create(**tag_payload)
    yield tag
    tag.delete()


@pytest.fixture
def tag_obj1(users, tag_payload):
    tag_payload['user'] = users['normal'][1]
    tag = Tags.objects.create(**tag_payload)
    yield tag
    tag.delete()


@pytest.fixture
def staff_tag_obj0(users, tag_payload):
    tag_payload['user'] = users['staff'][1]
    tag = Tags.objects.create(**tag_payload)
    yield tag
    tag.delete()


def random_string(string_length=10):
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(string_length))
