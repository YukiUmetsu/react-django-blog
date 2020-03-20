import os


def run():
    email = "tebby356@gmail.com"
    password = "1qaz2wsx"
    os.system(
        f"""echo "from django.contrib.auth import get_user_model; \
        get_user_model().objects.create_user(email='{email}',password='{password}',is_staff=True,is_superuser=True,is_active=True)"\
        | python manage.py shell"""
    )
