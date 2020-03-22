import random
import string
import pytest
from posts.models import Posts
from test_utils.users_fixtures import users
from test_utils.categories_fixtures import category_payload, category_obj
from test_utils.tags_fixtures import staff_tag_obj0
from test_utils.post_states_fixtures import all_states


@pytest.fixture
def post_min_payload(category_obj, users, all_states):
    content = random_string(25) + get_lorem()
    yield {
        'title': random_string(25),
        'content': content,
        'meta_desc': random_string(50),
        'youtube_url': 'https://www.youtube.com/watch?v=PesqzWG0BVs',
        'category': category_obj,
        'user': users['staff'][0],
        'post_state': all_states[0],
    }


@pytest.fixture
def post_payload(users, category_obj, all_states, staff_tag_obj0):
    content = random_string(25) + get_lorem()
    yield {
        'title': random_string(25),
        'content': content,
        'meta_desc': random_string(50),
        'youtube_url': 'https://www.youtube.com/watch?v=PesqzWG0BVs',
        'category': category_obj.id,
        'user': users['staff'][0].id,
        'post_state': all_states[0].id,
        'tags': staff_tag_obj0.id
    }


@pytest.mark.django_db
@pytest.fixture
def post_obj(post_min_payload, staff_tag_obj0):
    post = Posts.objects.create(**post_min_payload)
    post.tags.set([staff_tag_obj0])
    yield post

    post.delete()


def random_string(string_length=10):
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(string_length))


def get_lorem():
    return """Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec finibus nisl.\
    Mauris quis erat vitae tellus venenatis lobortis. Suspendisse sagittis, neque ut suscipit scelerisque, \
    ex mauris hendrerit felis, sed blandit lorem felis vel purus. Proin nibh sem, feugiat et neque in, \
    scelerisque pellentesque erat. Donec rutrum libero metus, et accumsan dui faucibus id. Morbi velit tortor, \
    feugiat in quam non, ornare dictum arcu. Vestibulum sed sollicitudin augue. Sed fringilla, leo quis dictum varius, \
    mi lacus imperdiet erat, eu rhoncus tortor augue non arcu. Maecenas pulvinar semper magna, \
    eget cursus nisi suscipit eu. Lorem ipsum dolor sit amet, consectetur adipiscing elit. \
    Maecenas sodales tempus euismod. Fusce odio mauris, feugiat vitae pellentesque et, congue eget nunc. \
    Maecenas dictum erat ut efficitur finibus. Nulla at risus consectetur odio posuere sodales sed sit amet ipsum.\
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus nec finibus nisl. \
    Mauris quis erat vitae tellus venenatis lobortis. Suspendisse sagittis, neque ut suscipit scelerisque, \
    ex mauris hendrerit felis, sed blandit lorem felis vel purus. Proin nibh sem, feugiat et neque in, \
    scelerisque pellentesque erat. Donec rutrum libero metus, et accumsan dui faucibus id. Morbi velit tortor, \
    feugiat in quam non, ornare dictum arcu. Vestibulum sed sollicitudin augue. Sed fringilla, leo quis dictum varius, \
    mi lacus imperdiet erat, eu rhoncus tortor augue non arcu. """
