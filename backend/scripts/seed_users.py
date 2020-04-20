from faker import Faker
from faker.providers import internet, person, misc
from allauth.account.adapter import get_adapter
from allauth.account.models import EmailAddress
from allauth.account.utils import setup_user_email
from django.http import HttpRequest


def create_user_data(number=50):
    fake = Faker()
    fake.add_provider(internet)
    fake.add_provider(person)
    fake.add_provider(misc)

    users = [
        {'first_name': 'Hadash', 'last_name': 'Buck', 'email': 'testnormaluser1@gmail.com', 'password': '1qaz2wsx!',
         'is_staff': False, 'is_superuser': False},
        {'first_name': 'Matilda', 'last_name': 'Cooley', 'email': 'testnormaluser2@gmail.com', 'password': '1qaz2wsx!',
         'is_staff': True, 'is_superuser': False},
        {'first_name': 'Claude', 'last_name': 'Mckay', 'email': 'testnormaluser3@gmail.com', 'password': '1qaz2wsx!',
         'is_staff': True, 'is_superuser': True},
    ]

    for index in range(number):
        email = "".join(fake.random_letters(length=5)).lower() + f'{index}' + fake.email()
        is_staff = fake.boolean(chance_of_getting_true=10)
        is_superuser = fake.boolean(chance_of_getting_true=1)
        if is_superuser:
            is_staff = True

        item = {'first_name': fake.last_name(),
                'last_name': fake.last_name(),
                'email': email,
                'password': '1qaz2wsx!',
                'is_staff': is_staff,
                'is_superuser': is_superuser}
        users.append(item)
    return users


def confirm_all_emails_for_allauth():
    emails = EmailAddress.objects.all()
    adapter = get_adapter()
    request = create_fake_request_obj()
    for email in emails:
        adapter.confirm_email(request, email)


def create_users(user_data):
    adapter = get_adapter()
    request = create_fake_request_obj()
    form = FormObject()

    for item in user_data:
        user = adapter.new_user(request)
        user.is_staff = item.get('is_staff')
        user.is_superuser = item.get('is_superuser')
        user.password = item.get('password')
        user.email = item.get('email')
        form.cleaned_data = item
        adapter.save_user(request, user, form)
        setup_user_email(request, user, [])  # create email in allauth db table


class FormObject:

    def __init__(self):
        self.cleaned_data = None


def create_fake_request_obj():
    session = {'account_verified_email': None}
    request = HttpRequest()
    request.session = session
    return request


def run():
    user_data = create_user_data()
    create_users(user_data)
    confirm_all_emails_for_allauth()
