from django.db import models
from django.conf import settings
from posts.models import Posts


class PostLikes(models.Model):
    """Likes on posts"""
    like = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    ip_address = models.CharField(max_length=100, blank=False, null=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )
    post = models.ForeignKey(Posts, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('ip_address', 'post')
        verbose_name = 'Post likes'
        verbose_name_plural = 'Post likes'

    def __str__(self):
        return "like" if self.like else "dislike"
