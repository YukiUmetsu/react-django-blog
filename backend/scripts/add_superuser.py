import os
import django
from django.db import connection
from django.contrib.auth import get_user_model


def add_email_addresses_to_all_auth_account_email_addresses_table(multi_login_info):
    # if you don't do this, you wil get an email address error when you login wth the user in api.
    with connection.cursor() as cursor:
        for email, password in multi_login_info:
            user = get_user_model().objects.filter(email=email)[0]
            cursor.execute(f"""INSERT INTO public.account_emailaddress (email, verified, "primary", user_id) \
            VALUES ('{email}', True, True, {user.id}) ON CONFLICT (email) DO NOTHING;""")


def run():
    # ---- CHANGE THESE EMAIL ADDRESSES AND PASSWORDS HERE IF NECESSARY ---- #
    multi_login_info = [
        ("yuuki.umetsu@gmail.com", "1qaz2wsx"),
        ("yukihyakubai777@gmail.com", "1qaz2wsx"),
        ("testtest@gmail.com", "1qaz2wsx"),
    ]

    for email, password in multi_login_info:
        os.system(
            f"""echo "from django.contrib.auth import get_user_model; \
            get_user_model().objects.create_user(email='{email}',password='{password}',is_staff=True,is_superuser=True,is_active=True)"\
            | python manage.py shell"""
        )

    add_email_addresses_to_all_auth_account_email_addresses_table(multi_login_info)
