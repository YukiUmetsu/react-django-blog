from django.db import models
from posts.models import Posts
from files.models import Files
from django.conf import settings


class BlogConfig(models.Model):
    title = models.CharField(blank=False, max_length=255)
    owned_by = models.CharField(blank=True, max_length=255)
    meta_desc = models.TextField(blank=True)
    youtube_url = models.CharField(blank=True, max_length=255)
    facebook_url = models.CharField(blank=True, max_length=255)
    instagram_url = models.CharField(blank=True, max_length=255)
    donation_url = models.CharField(blank=True, max_length=255)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )
    about_author_post = models.ForeignKey(Posts, on_delete=models.CASCADE, blank=True, null=True)
    favicon = models.ForeignKey(Files, on_delete=models.CASCADE, blank=True, null=True, related_name="favicon")
    header_img = models.ForeignKey(Files, on_delete=models.CASCADE, blank=True, null=True, related_name="header_img")

    class Meta:
        verbose_name = 'Blog Config'
        verbose_name_plural = 'Blog Config'

    def __str__(self):
        return self.title
