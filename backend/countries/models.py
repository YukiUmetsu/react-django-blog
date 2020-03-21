from django.db import models


class Countries(models.Model):
    """countries where users could be from"""
    numeric_code = models.IntegerField(blank=False)
    two_code = models.CharField(blank=False, max_length=20)
    three_code = models.CharField(blank=False, max_length=20)
    description = models.CharField(blank=False, max_length=100)

    class Meta:
        verbose_name = 'Countries'
        verbose_name_plural = 'Countries'

    def __str__(self):
        return self.description