import os
import django
from django.db import connection
from django.contrib.auth import get_user_model


def add_email_addresses_to_all_auth_account_email_addresses_table(multi_login_info):
    # if you don't do this, you wil get an email address error when you login wth the user in api.
    with connection.cursor() as cursor:
        for login_info in multi_login_info:
            email = login_info[0]
            user = get_user_model().objects.filter(email=email)[0]
            cursor.execute(f"""INSERT INTO public.account_emailaddress (email, verified, "primary", user_id) \
            VALUES ('{email}', True, True, {user.id}) ON CONFLICT (email) DO NOTHING;""")


def run():
    # ---- CHANGE THESE EMAIL ADDRESSES AND PASSWORDS HERE IF NECESSARY ---- #
    multi_login_info = [
        ("testnormaluser1@gmail.com", "1qaz2wsx", "Hadassah", "Buck"),
        ("testnormaluser2@gmail.com", "1qaz2wsx", "Matilda", "Cooley"),
        ("testnormaluser3@gmail.com", "1qaz2wsx", "Claude", "Mckay"),
    ]

    for login_info in multi_login_info:
        email = login_info[0]
        password = login_info[1]
        last_name = login_info[2]
        first_name = login_info[3]
        os.system(
            f"""echo "from django.contrib.auth import get_user_model; \
            get_user_model().objects.create_user(email='{email}',password='{password}',first_name='{first_name}',last_name='{last_name}',is_staff=False,is_superuser=False,is_active=True)"\
            | python manage.py shell"""
        )

    add_email_addresses_to_all_auth_account_email_addresses_table(multi_login_info)
