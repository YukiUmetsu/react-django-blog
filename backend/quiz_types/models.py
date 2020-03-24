from django.db import models


class QuizTypes(models.Model):
    name = models.CharField(max_length=200)

    class Meta:
        verbose_name = 'Quiz type'
        verbose_name_plural = 'Quiz types'

    def __str__(self):
        return self.name
