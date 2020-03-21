from django.db import models


class PostStates(models.Model):
    """States of blog posts"""
    name = models.CharField(blank=False, max_length=100)

    class Meta:
        verbose_name = 'Post States'
        verbose_name_plural = 'Post states'

    def __str__(self):
        return self.name