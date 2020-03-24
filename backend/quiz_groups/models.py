from django.db import models
from quizzes import Quizzes
from tags import Tags
from files import Files
from django.conf import settings


class QuizGroups(models.Model):
    name = models.CharField(max_length=255, blank=False, null=False)
    description = models.TextField(blank=True, null=True)
    file = models.ForeignKey(Files, blank=True, null=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    quizzes = models.ManyToManyField(Quizzes, allow_empty=True)
    tags = models.ManyToManyField(Tags, allow_empty=True)

    class Meta:
        verbose_name = 'Quiz Group'
        verbose_name_plural = 'Quiz Groups'

    def __str__(self):
        return self.name
