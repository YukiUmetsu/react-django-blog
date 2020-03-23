import random
import pytest
from post_likes.models import PostLikes
from test_utils.users_fixtures import users
from test_utils.categories_fixtures import category_payload, category_obj
from test_utils.tags_fixtures import staff_tag_obj0, tag_payload
from test_utils.post_states_fixtures import all_states
from test_utils.posts_fixtures import post_min_payload, post_obj


@pytest.fixture
def post_like_min_payload(post_obj):
    yield {
        'like': True,
        'post': post_obj,
        'ip_address': rand_ip()
    }


@pytest.fixture
def post_like_payload(users, post_obj):
    yield {
        'like': True,
        'ip_address': rand_ip(),
        'post': post_obj,
        'user': users['normal'][0]
    }


@pytest.mark.django_db
@pytest.fixture
def post_like_obj(post_like_payload):
    post_like = PostLikes.objects.create(**post_like_payload)
    yield post_like

    post_like.delete()


@pytest.mark.django_db
@pytest.fixture
def post_like_obj_without_user(post_like_min_payload):
    post_like = PostLikes.objects.create(**post_like_min_payload)
    yield post_like

    post_like.delete()


def rand_ip():
    return f'{randint(299)}.{randint(299)}.{randint(299)}.{randint(299)}'


def randint(max_num):
    return random.randint(0, max_num)