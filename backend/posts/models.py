from django.db import models
from categories.models import Categories
from tags.models import Tags
from post_states.models import PostStates
from files.models import Files
from django.conf import settings
from lib.utils import sanitize_html
from django.db.models import Q
import datetime
from django.utils.timezone import make_aware


class UpdatePostStatusManager(models.Manager):
    def get_queryset(self):
        # update scheduled posts that should be published because the time passed.
        current_time = make_aware(datetime.datetime.now())
        post_state_scheduled = PostStates.objects.get(name='scheduled')
        post_state_published = PostStates.objects.get(name='published')

        posts_to_update = super().get_queryset()\
            .filter(post_state=post_state_scheduled)\
            .filter(Q(scheduled_at__lte=current_time))
        posts_to_update.update(post_state=post_state_published)
        return super().get_queryset().all()


class Posts(models.Model):
    title = models.CharField(blank=False, max_length=255)
    excerpt = models.CharField(blank=False, max_length=255)
    content = models.TextField(blank=False)
    meta_desc = models.TextField(blank=True)
    youtube_url = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    published_at = models.DateTimeField(auto_now_add=False, blank=True, null=True)
    scheduled_at = models.DateTimeField(auto_now_add=False, blank=True, null=True)
    category = models.ForeignKey(Categories, on_delete=models.CASCADE)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    post_state = models.ForeignKey(PostStates, on_delete=models.CASCADE)
    main_img = models.ForeignKey(Files, on_delete=models.CASCADE, related_name='main_img')
    tags = models.ManyToManyField(Tags, blank=True)

    # managers
    objects = models.Manager()
    updated_obj = UpdatePostStatusManager()

    class Meta:
        verbose_name = 'Posts'
        verbose_name_plural = 'Posts'

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        # sanitize html
        if self.content is not None and len(self.content) > 0:
            self.content = sanitize_html(self.content)
        super(Posts, self).save(*args, **kwargs)
