from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _


class Tickets(models.Model):

    title = models.CharField(max_length=255, blank=False, null=False)
    content = models.TextField(blank=False, null=False)
    email = models.EmailField(blank=True, null=True, max_length=100)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )

    def clean(self):
        if not self.email and not self.user:
            raise ValidationError({'email': _('Please fill an email or login.')})
