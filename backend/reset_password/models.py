from django.db import models
from django.conf import settings


class ResetPassword(models.Model):
    reset_token = models.CharField(blank=False, max_length=255)
    last_changed = models.DateTimeField(auto_now_add=True, blank=True)
    email = models.EmailField(blank=False, null=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    class Meta:
        verbose_name = 'Reset Password'
        verbose_name_plural = 'Reset Password'

    def __str__(self):
        return self.email
