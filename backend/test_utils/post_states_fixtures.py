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


def random_string(string_length=10):
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(string_length))