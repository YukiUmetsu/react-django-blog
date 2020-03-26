import random
import string
import pytest
from quizzes.models import Quizzes
from quiz_groups.models import QuizGroups
from quiz_types.models import QuizTypes
from quiz_options.models import QuizOptions
from test_utils.users_fixtures import users
from test_utils.quizzes_fixtures import quiz_type_obj, quiz_payload, \
    quiz_obj0, quiz_obj1, staff_quiz_obj0, quiz_public, quiz_private_group


@pytest.fixture
def option_payload(quiz_obj0):
    return {
        'content': f'{random_string(30)}?',
        'is_answer': False,
        'quiz': quiz_obj0.id
    }

@pytest.fixture
@pytest.mark.django_db
def option_obj1(quiz_obj1):
    quiz_option = QuizOptions.objects.create(
        content="option obj1",
        is_answer=False,
        quiz=quiz_obj1
    )
    yield quiz_option
    if quiz_option.id is not None:
        quiz_option.delete()


@pytest.fixture
@pytest.mark.django_db
def option_public(quiz_public):
    quiz_option = QuizOptions.objects.create(
        content="this is public option",
        is_answer=False,
        quiz=quiz_public
    )
    yield quiz_option
    if quiz_option.id is not None:
        quiz_option.delete()


@pytest.fixture
@pytest.mark.django_db
def option_private(users, quiz_type_obj):
    payload = {
        'question': f'{random_string(30)}?',
        'type': quiz_type_obj,
        'user': users['normal'][0]
    }
    quiz = Quizzes.objects.create(**payload)
    quiz_group = QuizGroups.objects.create(
        name="test private group 0",
        is_public=False,
        user=users['normal'][0],
    )
    quiz_group.quizzes.set([quiz])

    quiz_option = QuizOptions.objects.create(
        content="this is private option!",
        is_answer=False,
        quiz=quiz
    )
    yield quiz_option

    if quiz_option.id is not None:
        quiz_option.delete()
    if quiz_group.id is not None:
        quiz_group.delete()
    if quiz.id is not None:
        quiz.delete()


def random_string(string_length=10):
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(string_length))
