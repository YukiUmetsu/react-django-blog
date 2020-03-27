import copy
import pytest
from rest_framework import status
from rest_framework.test import APIClient
from test_utils.users_fixtures import users
from test_utils.quizzes_fixtures import quiz_type_obj, quiz_payload, \
    quiz_obj0, quiz_obj1, staff_quiz_obj0, quiz_public, quiz_private_group
from test_utils.quiz_options_fixtures import option_payload, option_public, option_private, option_obj1
from test_utils.quiz_user_submissions_fixtures import submission_payload, submission_obj0, submission_obj1
from quiz_user_submissions.models import QuizUserSubmissions

pytestmark = pytest.mark.django_db


def get_submission_detail_url(submission_id):
    return f"/api/quiz_user_submissions/{submission_id}/"


@pytest.mark.django_db
class TestPublicQuizUserSubmissionsAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    def test_outsider_cannot_see_quiz_user_submissions(self, client, submission_obj0):
        print(f"created a quiz user submission: {submission_obj0}")
        response = client.get('/api/quiz_user_submissions/')
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_outsider_cannot_create_submission(self, client, submission_payload):
        response = client.post('/api/quiz_user_submissions/', submission_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_outsider_cannot_delete_submission(self, submission_obj0):
        response = self.client.delete(get_submission_detail_url(submission_obj0.id))
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_outsider_cannot_update_submission(self, submission_payload, submission_obj0):
        submission_payload['name'] = 'something different'
        response = self.client.put(get_submission_detail_url(submission_obj0.id), submission_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
class TestPrivateQuizUserSubmissionsAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    @classmethod
    def teardown_class(cls):
        cls.client = None

    def test_normal_user_can_see_own_quiz_user_submissions_in_list_view(self,
                                                          users,
                                                          submission_obj0,
                                                          submission_obj1):
        # quiz with user0, quiz with user1, quiz with user0 but group is hidden
        print(f'created quiz_user_submissions: {submission_obj0} / {submission_obj1}')
        # can access only to your quiz and public one.
        self.client.force_authenticate(users['normal'][1])
        response = self.client.get("/api/quiz_user_submissions/", format='json')
        assert len(response.data.get('results')) == 1

    def test_normal_user_cannot_see_others_quiz_user_submissions_in_detail_view(self, users, submission_obj1):
        # can not access to other's hidden quiz_user_submissions.
        self.client.force_authenticate(users['normal'][0])
        url = get_submission_detail_url(submission_obj1.id)
        response = self.client.get(url)
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]

    def test_normal_user_can_create_quiz_user_submissions(self, users, submission_payload):
        self.client.force_authenticate(users['normal'][0])
        submission_payload['user'] = users['normal'][0].id
        response = self.client.post("/api/quiz_user_submissions/", submission_payload)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['user'] == users['normal'][0].id

    def test_normal_user_can_create_multiple_quiz_user_submissions(self, users, submission_payload, quiz_obj0, option_public):
        self.client.force_authenticate(users['normal'][0])
        payload = []
        another = {
            'quiz': quiz_obj0.id,
            'selected': option_public.id,
            'user': users.get("normal")[0].id,
            'was_correct': False
        }
        payload.append(submission_payload)
        payload.append(another)
        response = self.client.post("/api/quiz_user_submissions/", payload, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        quiz_user_submissions = QuizUserSubmissions.objects.filter(user=users['normal'][0])
        assert len(quiz_user_submissions) == 2

    def test_normal_user_cannot_create_others_submission(self, users, submission_payload):
        self.client.force_authenticate(users['normal'][0])
        submission_payload['user'] = users['normal'][1].id
        response = self.client.post("/api/quiz_user_submissions/", submission_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_normal_user_can_update_own_quiz_user_submissions(self, users, submission_payload, submission_obj0):
        self.client.force_authenticate(users['normal'][0])
        submission_payload['was_correct'] = True
        response = self.client.patch(get_submission_detail_url(submission_obj0.id), submission_payload)
        assert response.status_code == status.HTTP_200_OK

    def test_normal_user_cannot_update_others_quiz_user_submissions(self, users, submission_payload, submission_obj1):
        self.client.force_authenticate(users['normal'][0])
        submission_payload['was_correct'] = True
        response = self.client.put(get_submission_detail_url(submission_obj1.id), submission_payload)
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]

    def test_staff_user_can_update_quiz_user_submissions(self, users, submission_payload, submission_obj0):
        first_submission_was_correct = copy.copy(submission_obj0.was_correct)
        self.client.force_authenticate(users['staff'][0])
        submission_payload['was_correct'] = not submission_obj0.was_correct
        submission_payload['user'] = submission_obj0.user.id
        response = self.client.put(get_submission_detail_url(submission_obj0.id), submission_payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['was_correct'] != first_submission_was_correct

    def test_superuser_can_update_quiz_user_submissions(self, users, submission_payload, submission_obj0):
        first_submission_was_correct = copy.copy(submission_obj0.was_correct)
        self.client.force_authenticate(users['superuser'][0])
        submission_payload['was_correct'] = not submission_obj0.was_correct
        submission_payload['user'] = submission_obj0.user.id
        response = self.client.put(get_submission_detail_url(submission_obj0.id), submission_payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['was_correct'] != first_submission_was_correct

    def test_normal_user_can_delete_own_submission(self, users, submission_obj0):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.delete(get_submission_detail_url(submission_obj0.id))
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_normal_user_cannot_delete_others_submission(self, users, submission_obj1):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.delete(get_submission_detail_url(submission_obj1.id))
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]
