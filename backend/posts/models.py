from django.db import models
from categories.models import Categories
from tags.models import Tags
from django.conf import settings


class Posts(models.Model):
    title = models.CharField(blank=False, max_length=255)
    content = models.TextField(blank=False)
    meta_desc = models.TextField(blank=True)
    youtube_url = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    category = models.ForeignKey(Categories, on_delete=models.CASCADE)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    tags = models.ManyToManyField(Tags)

    class Meta:
        verbose_name = 'Posts'
        verbose_name_plural = 'Posts'

    def __str__(self):
        return self.title