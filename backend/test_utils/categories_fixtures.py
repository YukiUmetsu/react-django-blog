import random
import string
import pytest
from categories.models import Categories


@pytest.fixture
def category_payload():
    yield {
        'name': f'{random_string(15)} category'
    }


@pytest.fixture
def category_obj(category_payload):
    category = Categories.objects.create(**category_payload)
    yield category

    category.delete()


def random_string(string_length=10):
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(string_length))