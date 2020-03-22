from django.contrib.auth import get_user_model
import pytest


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
