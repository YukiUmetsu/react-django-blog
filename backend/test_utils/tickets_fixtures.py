import random
import string
import pytest
from tickets.models import Tickets
from test_utils.users_fixtures import users


@pytest.fixture
def ticket_payload(users):
    return {
        'title': 'initial ticket payload title',
        'content':'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '
                  'Vivamus nec finibus nisl. Mauris quis erat vitae tellus venenatis lobortis.',
        'user': users['normal'][0].id,
        'email': users['normal'][0].email
    }

@pytest.fixture
def ticket_payload_for_create(users):
    return {
        'title': 'initial ticket payload title',
        'content': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '
                   'Vivamus nec finibus nisl. Mauris quis erat vitae tellus venenatis lobortis.',
        'user': users['normal'][0],
        'email': users['normal'][0].email
    }

@pytest.fixture
@pytest.mark.django_db
def ticket_obj0(ticket_payload_for_create):
    ticket = Tickets.objects.create(**ticket_payload_for_create)
    yield ticket
    if ticket.id is not None:
        ticket.delete()


@pytest.fixture
@pytest.mark.django_db
def ticket_obj1(users, ticket_payload_for_create):
    ticket_payload_for_create['user'] = users['normal'][1]
    ticket = Tickets.objects.create(**ticket_payload_for_create)
    yield ticket
    if ticket.id is not None:
        ticket.delete()
