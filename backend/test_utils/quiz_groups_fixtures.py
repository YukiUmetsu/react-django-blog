import random
import string
import pytest
from quizzes.models import Quizzes
from quiz_groups.models import QuizGroups
from test_utils.users_fixtures import users


@pytest.fixture
def quiz_group_payload(users):
    return {
        'name': "test public group",
        'description': "this is a great quiz!",
        'is_public': 1,
        'user': users['normal'][0].id
    }


@pytest.fixture
def hidden_quiz_group_payload(users):
    return {
        'name': "test public group",
        'description': "this is a great quiz!",
        'is_public': 0,
        'user': users['normal'][0].id
    }


@pytest.fixture
@pytest.mark.django_db
def quiz_group_obj0(users):
    quiz_groups = QuizGroups.objects.create(
        name="test public group 0",
        description="this is a great quiz!!",
        is_public=True,
        user=users['normal'][0]
    )
    yield quiz_groups
    if quiz_groups.id is not None:
        quiz_groups.delete()


@pytest.fixture
@pytest.mark.django_db
def quiz_group_obj1(users):
    quiz_groups = QuizGroups.objects.create(
        name="test public group 1",
        description="this is a great quiz!!",
        is_public=True,
        user=users['normal'][1]
    )
    yield quiz_groups
    if quiz_groups.id is not None:
        quiz_groups.delete()


@pytest.fixture
@pytest.mark.django_db
def hidden_quiz_g_obj(users):
    quiz_groups = QuizGroups.objects.create(
        name="test public group 1",
        description="this is a great quiz!!",
        is_public=False,
        user=users['normal'][0]
    )
    yield quiz_groups
    if quiz_groups.id is not None:
        quiz_groups.delete()


@pytest.fixture
@pytest.mark.django_db
def staff_quiz_group_obj0(users):
    quiz_groups = QuizGroups.objects.create(
        name="test public group",
        is_public=True,
        user=users['staff'][0]
    )
    yield quiz_groups
    quiz_groups.delete()


def random_string(string_length=10):
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(string_length))
