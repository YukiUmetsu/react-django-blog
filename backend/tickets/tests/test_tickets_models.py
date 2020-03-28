import copy
import pytest
from rest_framework import status
from rest_framework.test import APIClient
from test_utils.users_fixtures import users
from test_utils.tickets_fixtures import ticket_payload, ticket_payload_for_create, ticket_obj0, ticket_obj1
from tickets.models import Tickets
from blacklist_words.models import BlacklistWords

pytestmark = pytest.mark.django_db


def get_ticket_detail_url(ticket_id):
    return f"/api/tickets/{ticket_id}/"

@pytest.fixture
@pytest.mark.django_db
def blacklist_word_obj0():
    obj = BlacklistWords.objects.create(content="fuck", used_in_comments=True, used_in_tickets=True)
    yield obj
    if obj.id is not None:
        obj.delete()

@pytest.mark.django_db
class TestPublicTicketsAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    def test_outsider_cannot_see_tickets(self, client, ticket_obj0):
        print(f"created quiz in a group: {ticket_obj0}")
        response = client.get('/api/tickets/')
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_outsider_can_create_ticket(self, client, ticket_payload):
        response = client.post('/api/tickets/', ticket_payload)
        assert response.status_code == status.HTTP_201_CREATED

    def test_outsider_cannot_delete_ticket(self, ticket_obj0):
        response = self.client.delete(get_ticket_detail_url(ticket_obj0.id))
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]

    def test_outsider_cannot_update_ticket(self, ticket_payload, ticket_obj0):
        ticket_payload['title'] = 'something different'
        response = self.client.put(get_ticket_detail_url(ticket_obj0.id), ticket_payload)
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]

    def test_outsider_cannot_create_ticket_with_blacklist_words(self, ticket_payload, blacklist_word_obj0):
        ticket_payload["content"] += f" {blacklist_word_obj0.content} "
        response = self.client.post('/api/tickets/', ticket_payload)
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestPrivateTicketsAPI:

    @classmethod
    def setup_class(cls):
        cls.client = APIClient()

    @classmethod
    def teardown_class(cls):
        cls.client = None

    def test_normal_user_can_see_own_tickets_in_list_view(self, users, ticket_obj0, ticket_obj1):
        print(f'created tickets: {ticket_obj0} / {ticket_obj1}')
        self.client.force_authenticate(users['normal'][1])
        response = self.client.get("/api/tickets/", format='json')
        assert len(response.data.get('results')) == 1
        response_detail = self.client.get(get_ticket_detail_url(ticket_obj1.id))
        assert response_detail.status_code == status.HTTP_200_OK

    def test_normal_user_cannot_see_others_tickets_in_detail_view(self, users, ticket_obj0):
        # can not access to other's hidden tickets.
        self.client.force_authenticate(users['normal'][1])
        url = get_ticket_detail_url(ticket_obj0.id)
        response = self.client.get(url)
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]

    def test_normal_user_can_create_tickets(self, users, ticket_payload):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.post("/api/tickets/", ticket_payload)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['user'] == users['normal'][0].id

    def test_normal_user_cannot_create_others_ticket(self, users, ticket_payload):
        self.client.force_authenticate(users['normal'][0])
        ticket_payload['user'] = users['normal'][1].id
        response = self.client.post("/api/tickets/", ticket_payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_normal_user_can_update_own_tickets(self, users, ticket_payload, ticket_obj0):
        self.client.force_authenticate(users['normal'][0])
        ticket_payload['user'] = users['normal'][0].id
        ticket_payload['question'] = "something new?"
        response = self.client.patch(get_ticket_detail_url(ticket_obj0.id), ticket_payload)
        assert response.status_code == status.HTTP_200_OK

    def test_normal_user_cannot_update_others_tickets(self, users, ticket_payload, ticket_obj1):
        self.client.force_authenticate(users['normal'][0])
        ticket_payload['title'] = "something new?"
        ticket_payload['user'] = ticket_obj1.user.id
        response = self.client.put(get_ticket_detail_url(ticket_obj1.id), ticket_payload)
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]

    def test_staff_user_can_update_tickets(self, users, ticket_payload, ticket_obj0):
        first_ticket_title = copy.copy(ticket_obj0.title)
        self.client.force_authenticate(users['staff'][0])
        ticket_payload['title'] = "test" + ticket_obj0.title
        ticket_payload['user'] = ticket_obj0.user.id
        response = self.client.put(get_ticket_detail_url(ticket_obj0.id), ticket_payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['title'] != first_ticket_title

    def test_superuser_can_update_tickets(self, users, ticket_payload, ticket_obj0):
        first_ticket_title = copy.copy(ticket_obj0.title)
        self.client.force_authenticate(users['superuser'][0])
        ticket_payload['title'] = "test" + ticket_obj0.title
        ticket_payload['user'] = ticket_obj0.user.id
        response = self.client.put(get_ticket_detail_url(ticket_obj0.id), ticket_payload)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['title'] != first_ticket_title

    def test_normal_user_can_delete_own_ticket(self, users, ticket_obj0):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.delete(get_ticket_detail_url(ticket_obj0.id))
        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_normal_user_cannot_delete_others_ticket(self, users, ticket_obj1):
        self.client.force_authenticate(users['normal'][0])
        response = self.client.delete(get_ticket_detail_url(ticket_obj1.id))
        assert response.status_code in [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND]
