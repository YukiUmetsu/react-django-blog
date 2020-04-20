from django.contrib.auth import get_user_model
import pytest
from faker import Faker
fake = Faker()
from countries.models import Countries
from test_utils.countries_fixtures import country_obj, country_payload

@pytest.mark.django_db
@pytest.fixture
def users():
    users = {'normal': [], 'staff': [], 'superuser': []}
    user_info = [
        ("testuseremail1@test.com", "Hey12345hey!1", False, False, 'normal'),
        ("testuseremail2@test.com", "Hey12345hey!2", False, False, 'normal'),
        ("stafftestuseremail3@test.com", "Hey12345hey!3", True, False, 'staff'),
        ("stafftestuseremail4@test.com", "Hey12345hey!4", True, False, 'staff'),
        ("superusertestuseremail5@test.com", "Hey12345hey!5", True, True, 'superuser'),
        ("superusertestuseremail6@test.com", "Hey12345hey!6", True, True, 'superuser'),
    ]

    for email, password, is_staff, is_superuser, label in user_info:
        new_user = get_user_model().objects.create_user(
            email=email,
            password=password,
            is_staff=is_staff,
            is_superuser=is_superuser
        )
        users[label].append(new_user)

    yield users

    # should be called after tests are done.
    for user_type in ['normal', 'staff', 'superuser']:
        for user in users[user_type]:
            try:
                user.delete()
            except Exception as e:
                print(f"\r\nthere was a problem deleting test users:\r\n{e}")


@pytest.fixture
def user_payload():
    return {
        'email': fake.email(),
        'first_name': fake.first_name(),
        'last_name': fake.last_name(),
        'password': fake.password(length=8),
        'is_staff': False,
        'is_superuser': False,
        'country': ''
    }

@pytest.fixture
def user_payload_with_country(country_obj):
    return {
        'email': fake.email(),
        'first_name': fake.first_name(),
        'last_name': fake.last_name(),
        'password': fake.password(length=8),
        'is_staff': False,
        'is_superuser': False,
        'country': country_obj.id
    }

@pytest.fixture
def staff_user_payload():
    return {
        'email': fake.email(),
        'first_name': fake.first_name(),
        'last_name': fake.last_name(),
        'password': fake.password(length=8),
        'is_staff': True,
        'is_superuser': False,
        'country': ''
    }

@pytest.fixture
def superuser_payload():
    return {
        'email': fake.email(),
        'first_name': fake.first_name(),
        'last_name': fake.last_name(),
        'password': fake.password(length=8),
        'is_staff': True,
        'is_superuser': True,
        'country': ''
    }
