import pytest
# from quizzes.models import Quizzes
# from quiz_groups.models import QuizGroups
# from quiz_types.models import QuizTypes
# from quiz_options.models import QuizOptions
from test_utils.users_fixtures import users
from test_utils.quizzes_fixtures import quiz_type_obj, quiz_payload, \
    quiz_obj0, quiz_obj1, staff_quiz_obj0, quiz_public, quiz_private_group
from test_utils.quiz_options_fixtures import option_payload, option_obj1, option_public
from quiz_user_submissions.models import QuizUserSubmissions


@pytest.fixture
def submission_payload(users, quiz_obj0, option_public):
    return {
        'quiz': quiz_obj0.id,
        'selected': option_public.id,
        'user': users.get("normal")[0].id,
        'was_correct': False
    }


@pytest.fixture
@pytest.mark.django_db
def submission_obj0(users, quiz_obj0, option_public):
    payload = {
        'quiz': quiz_obj0,
        'selected': option_public,
        'user': users.get("normal")[0],
        'was_correct': False
    }
    quiz_submission = QuizUserSubmissions.objects.create(**payload)
    yield quiz_submission
    if quiz_submission.id is not None:
        quiz_submission.delete()


@pytest.fixture
@pytest.mark.django_db
def submission_obj1(users, quiz_obj1, option_public):
    payload = {
        'quiz': quiz_obj1,
        'selected': option_public,
        'user': users.get("normal")[1],
        'was_correct': False
    }
    quiz_submission = QuizUserSubmissions.objects.create(**payload)
    yield quiz_submission
    if quiz_submission.id is not None:
        quiz_submission.delete()
