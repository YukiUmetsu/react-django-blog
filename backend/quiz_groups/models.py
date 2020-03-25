from django.db import models
from quizzes.models import Quizzes
from tags.models import Tags
from files.models import Files
from django.conf import settings


class QuizGroups(models.Model):
    name = models.CharField(max_length=255, blank=False, null=False)
    description = models.TextField(blank=True, null=True)
    is_public = models.BooleanField(default=True, blank=False, null=False)
    file = models.ForeignKey(Files, blank=True, null=True, on_delete=models.CASCADE)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    quizzes = models.ManyToManyField(Quizzes, blank=True)
    tags = models.ManyToManyField(Tags, blank=True)

    class Meta:
        verbose_name = 'Quiz Group'
        verbose_name_plural = 'Quiz Groups'

    def __str__(self):
        return self.name
