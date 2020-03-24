from django.db import models
from django.conf import settings
from posts.models import Posts
from quiz_types import QuizTypes
from quiz_groups import QuizGroups
from files import Files


class Quizzes(models.Model):
    question = models.TextField(blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    type = models.ForeignKey(QuizTypes, on_delete=models.CASCADE, blank=False, null=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    group = models.ForeignKey(QuizGroups, allow_empty=True)
    post = models.ManyToManyField(Posts, allow_empty=True)
    files = models.ManyToManyField(Files, allow_empty=True)

    class Meta:
        verbose_name = 'Quizzes'
        verbose_name_plural = 'Quizzes'

    def __str__(self):
        return self.title
