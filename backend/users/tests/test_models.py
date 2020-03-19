import pytest

from django.contrib.auth import get_user_model

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
