from django.db import models
from django.conf import settings


class Tags(models.Model):
    """Tags for blog posts, and other things."""
    name = models.CharField(blank=False, max_length=100)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    class Meta:
        verbose_name = 'Tags'
        verbose_name_plural = 'Tags'

    def __str__(self):
        return self.name
