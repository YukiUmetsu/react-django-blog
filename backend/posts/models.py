from django.db import models
from categories.models import Categories
from tags.models import Tags
from post_states.models import PostStates
from files.models import Files
from django.conf import settings
from lib.utils import sanitize_html


class Posts(models.Model):
    title = models.CharField(blank=False, max_length=255)
    excerpt = models.CharField(blank=False, max_length=255)
    content = models.TextField(blank=False)
    meta_desc = models.TextField(blank=True)
    youtube_url = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    published_at = models.DateTimeField(auto_now_add=False, blank=True, null=True)
    category = models.ForeignKey(Categories, on_delete=models.CASCADE)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    post_state = models.ForeignKey(PostStates, on_delete=models.CASCADE)
    main_img = models.ForeignKey(Files, on_delete=models.CASCADE, related_name='main_img')
    tags = models.ManyToManyField(Tags, blank=True)

    class Meta:
        verbose_name = 'Posts'
        verbose_name_plural = 'Posts'

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        # sanitize html
        if kwargs.get('content') is not None and len(kwargs.get('content')) > 0:
            kwargs['content'] = sanitize_html(kwargs['content'])
        super().save(*args, **kwargs)
