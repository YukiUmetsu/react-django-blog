import random
import string
import pytest
from comments.models import Comments
from test_utils.users_fixtures import users
from test_utils.categories_fixtures import category_payload, category_obj
from test_utils.tags_fixtures import staff_tag_obj0, tag_payload
from test_utils.post_states_fixtures import all_states
from test_utils.posts_fixtures import post_min_payload, post_obj


@pytest.fixture
def comment_min_payload(post_obj):
    yield {
        'content': random_string() + get_lorem(),
        'post': post_obj,
        'name': 'test-user-1',
        'email': 'testuser1@gmail.com',
    }


@pytest.fixture
def comment_payload(users, post_obj):
    yield {
        'content': random_string() + get_lorem(),
        'name': 'test-user-1',
        'email': 'testuser1@gmail.com',
        'post': post_obj,
        'is_hidden': False,
        'user': users['normal'][0]
    }


@pytest.fixture
def hidden_comment_payload(users, post_obj):
    yield {
        'content': get_lorem(),
        'post': post_obj,
        'is_hidden': True,
        'user': users['normal'][0]
    }


@pytest.mark.django_db
@pytest.fixture
def comment_obj(comment_payload):
    comment = Comments.objects.create(**comment_payload)
    yield comment

    comment.delete()


@pytest.mark.django_db
@pytest.fixture
def hidden_comment_obj(hidden_comment_payload):
    comment = Comments.objects.create(**hidden_comment_payload)
    yield comment

    comment.delete()


def random_string(string_length=10):
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(string_length))


def get_lorem():
    return """Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec finibus nisl.\
    Mauris quis erat vitae tellus venenatis lobortis."""
