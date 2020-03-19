from django.db import models
from django.conf import settings

class Media(models.Model):
    """medium file data"""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    type = models.CharField(blank=True, max_length=100)
    alt = models.CharField(blank=True, max_length=100)
    path = models.CharField(blank=False, max_length=200)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)

    class Meta:
        verbose_name = 'Media'
        verbose_name_plural = 'Media data'

    def __str__(self):
        return self.path