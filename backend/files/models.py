from django.db import models
from django.conf import settings


class Files(models.Model):
    """medium file data"""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    type = models.CharField(blank=True, max_length=100)
    desc = models.CharField(blank=True, max_length=255)
    file = models.FileField(max_length=1000, blank=False, upload_to='uploads/%Y/%m/%d/')
    created_at = models.DateTimeField(auto_now_add=True, blank=True)

    class Meta:
        verbose_name = 'Files'
        verbose_name_plural = 'Files'

    def __str__(self):
        return self.file
