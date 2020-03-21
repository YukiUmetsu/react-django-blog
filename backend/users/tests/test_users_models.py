import pytest

from django.contrib.auth import get_user_model


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
def test_create_user_with_email_successful():
    """Test creating a new user with email"""
    email = "testuseremail@test.com"
    password = "Hey12345hey!"
    user = get_user_model().objects.create_user(
        email=email,
        password=password
    )
    assert user.email == email
    assert user.check_password(password) == True
