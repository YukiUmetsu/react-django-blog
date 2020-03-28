from django.db import models


class BlacklistWords(models.Model):
    content = models.CharField(max_length=255)
    used_in_tickets = models.BooleanField(default=False, blank=True, null=True)
    used_in_comments = models.BooleanField(default=False, blank=True, null=True)

    class Meta:
        verbose_name = 'Black List Words'
        verbose_name_plural = 'Black List Words'

    def __str__(self):
        return self.content
