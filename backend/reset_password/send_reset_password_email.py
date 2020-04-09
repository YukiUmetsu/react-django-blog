from django.core.mail import EmailMultiAlternatives
from django.contrib.sites.models import Site
from django.template.loader import render_to_string
from django.conf import settings
import os


def send(email, reset_token):
    frontend_reset_password_url = os.environ.get('FRONTEND_RESET_PASSWORD_URL')
    site_name = Site.objects.get_current().name
    context = {
        'site_name': site_name,
        'email': email,
        'reset_password_url': f'{frontend_reset_password_url}?reset_token={reset_token}'
    }

    email_html_message = render_to_string('email/user_reset_password.html', context)
    email_plaintext_message = render_to_string('email/user_reset_password.txt', context)

    msg = EmailMultiAlternatives(
        # title:
        "Password Reset for {title}".format(title=site_name),
        # message:
        email_plaintext_message,
        # from:
        settings.DEFAULT_FROM_EMAIL,
        # to:
        [email]
    )
    msg.attach_alternative(email_html_message, "text/html")
    msg.send()
