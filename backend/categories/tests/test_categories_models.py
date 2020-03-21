import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status


pytestmark = pytest.mark.django_db


@pytest.mark.django_db
@pytest.fixture
def users():
    users = {'noraml': [], 'staff': [], 'superuser': []}
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
    for label, user in users:
        try:
            user.delete()
            print("test users successfully deleted.")

        except Exception as e:
            print(f"there was a problem deleting test users.\r\n{e}")


@pytest.mark.django_db
class TestPublicCategoriesAPI:

    def test_outsider_can_see_categories(self, client):
        url = reverse('categories:categories-list')
        response = client.get(url)
        assert response.status_code == status.HTTP_200_OK

    def test_outsider_cannot_create_category(self, client):
        payload = {
            'name': 'testcategry'
        }
        url = reverse('categories:categories-list')
        response = client.post(url, payload)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
