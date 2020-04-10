import pytest
import datetime
import pytz
from reset_password.models import ResetPassword
from reset_password.tokens.generate_tokens import RandomStringTokenGenerator
from test_utils.users_fixtures import users


@pytest.fixture
def reset_password_payload(users):
    yield {
        'email': users['normal'][0].email,
    }


@pytest.mark.django_db
@pytest.fixture
def reset_password_obj(users):
    token_generator = RandomStringTokenGenerator()
    payload = {
        'email': users['normal'][0].email,
        'reset_token': token_generator.generate_token(),
        'last_changed': pytz.UTC.localize(datetime.datetime.now()),
        'user': users['normal'][0]
    }
    reset_password_obj = ResetPassword.objects.create(**payload)
    yield reset_password_obj

    if reset_password_obj.id is not None:
        reset_password_obj.delete()
