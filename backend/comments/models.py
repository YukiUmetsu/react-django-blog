from django.db import models
from django.conf import settings
from django.template.defaultfilters import truncatechars
from posts.models import Posts


class Comments(models.Model):
    """Comments on posts"""
    content = models.TextField(blank=False)
    name = models.CharField(blank=True, null=True, max_length=100)
    email = models.EmailField(blank=True, null=True, max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    is_hidden = models.BooleanField(default=False)
    replied = models.BooleanField(default=False)
    parent = models.ForeignKey('self', blank=True, null=True, on_delete=models.CASCADE)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        blank=True, null=True
    )
    post = models.ForeignKey(Posts, blank=False, null=False, on_delete=models.CASCADE, related_name='comments')

    @property
    def short_description(self):
        return truncatechars(self.content, 100)
