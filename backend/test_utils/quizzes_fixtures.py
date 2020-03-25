import random
import string
import pytest
from quizzes.models import Quizzes
from quiz_groups.models import QuizGroups
from quiz_types.models import QuizTypes
from test_utils.users_fixtures import users


@pytest.fixture
@pytest.mark.django_db
def quiz_type_obj():
    quiz_type = QuizTypes.objects.create(name="multiple choice")
    yield quiz_type
    quiz_type.delete()


@pytest.fixture
def quiz_payload(users, quiz_type_obj):
    return {
        'question': f'{random_string(30)}?',
        'type': int(quiz_type_obj.id),
        'user': users['normal'][1].id
    }


@pytest.fixture
@pytest.mark.django_db
def quiz_obj0(users, quiz_type_obj):
    payload = {
        'question': f'{random_string(30)}?',
        'type': quiz_type_obj,
        'user': users['normal'][0]
    }
    quiz = Quizzes.objects.create(**payload)
    yield quiz
    if quiz.id is not None:
        quiz.delete()


@pytest.fixture
@pytest.mark.django_db
def quiz_obj1(users, quiz_payload, quiz_type_obj):
    payload = {
        'question': f'{random_string(30)}?',
        'type': quiz_type_obj,
        'user': users['normal'][1]
    }
    quiz = Quizzes.objects.create(**payload)
    yield quiz
    if quiz.id is not None:
        quiz.delete()


@pytest.fixture
@pytest.mark.django_db
def staff_quiz_obj0(users, quiz_payload):
    quiz_payload['user'] = users['staff'][1]
    quiz = Quizzes.objects.create(**quiz_payload)
    yield quiz
    if quiz.id is not None:
        quiz.delete()


@pytest.fixture
@pytest.mark.django_db
def qgroup_obj(users):
    quiz_group = QuizGroups.objects.create(
        name="test public group 0",
        is_public=True,
        user=users['normal'][0]
    )
    yield quiz_group
    quiz_group.delete()


@pytest.fixture
@pytest.mark.django_db
def quiz_public(users, quiz_obj0):
    quiz_group = QuizGroups.objects.create(
        name="test public group 0",
        is_public=True,
        user=users['normal'][0],
    )
    quiz_group.quizzes.set([quiz_obj0])
    yield quiz_obj0
    quiz_group.delete()
    if quiz_obj0.id is not None:
        quiz_obj0.delete()


@pytest.fixture
@pytest.mark.django_db
def quiz_private_group(users, quiz_obj0):
    quiz_group = QuizGroups.objects.create(
        name="test private group 0",
        is_public=False,
        user=users['normal'][0],
    )
    quiz_group.quizzes.set([quiz_obj0])
    yield quiz_obj0
    quiz_group.delete()
    if quiz_obj0.id is not None:
        quiz_obj0.delete()


def random_string(string_length=10):
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(string_length))
