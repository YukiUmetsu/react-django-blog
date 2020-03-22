import random
import string
import pytest
from post_states.models import PostStates


@pytest.fixture
def post_state_payload():
    yield {
        'name': random_string(10)
    }


@pytest.fixture
def post_state_obj(post_state_payload):
    post_state = PostStates.objects.create(**post_state_payload)
    yield post_state

    post_state.delete()


@pytest.fixture
def all_states():
    all_states = [create_post_state(name) for name in ["draft", "scheduled", "published", "hidden", "deleted"]]
    yield all_states

    [tag.delete() for tag in all_states]


@pytest.mark.django_db
def create_post_state(name):
    return PostStates.objects.create(name=name)


def random_string(string_length=10):
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(string_length))