from django.db import models
from quizzes.models import Quizzes
from quiz_options.models import QuizOptions
from django.conf import settings


class QuizUserSubmissions(models.Model):
    was_correct = models.BooleanField(default=False, blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    quiz = models.ForeignKey(Quizzes, blank=False, null=False, on_delete=models.CASCADE)
    selected = models.ForeignKey(QuizOptions, blank=False, null=False, on_delete=models.CASCADE)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    class Meta:
        verbose_name = 'Quiz User Submissions'
        verbose_name_plural = 'Quiz User Submissions'

    def __str__(self):
        answer = "correct" if self.was_correct else "wrong"
        return f"{str(self.user)} - {str(self.quiz)} - {answer} - {self.created_at.strftime('%Y-%m-%d')}"
