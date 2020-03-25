from django.db import models
from quizzes.models import Quizzes


class QuizOptions(models.Model):
    quiz = models.ForeignKey(Quizzes, blank=False, null=False)
    content = models.TextField(blank=False, bull=False)
    is_answer = models.BooleanField(default=False, blank=False, null=False)

    class Meta:
        verbose_name = 'Quiz Option'
        verbose_name_plural = 'Quiz Options'

    def __str__(self):
        return self.content
