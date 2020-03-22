import random
import string
import pytest
from countries.models import Countries


@pytest.fixture
def country_payload():
    random_str = random_string(15)
    yield {
        'numeric_code': 999,
        'two_code': 'XX',
        'three_code': 'XYX',
        'description': f'{random_str} country'
    }


@pytest.fixture
def country_obj(country_payload):
    country = Countries.objects.create(**country_payload)
    yield country

    country.delete()


def random_string(string_length=10):
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(string_length))