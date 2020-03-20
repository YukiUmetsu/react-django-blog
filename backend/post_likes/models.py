from django.db import models
from django.conf import settings
from posts.models import Posts


class PostLikes(models.Model):
    """Likes on posts"""
    like = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    post = models.ForeignKey(Posts, on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Post likes'
        verbose_name_plural = 'Post likes'

    def __str__(self):
        return self.like