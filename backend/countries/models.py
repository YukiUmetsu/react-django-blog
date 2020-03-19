from django.db import models


class Countries(models.Model):
    """countries where users could be from"""
    numeric_code = models.IntegerField(blank=False)
    two_code = models.CharField(blank=False, max_length=20)
    three_code = models.CharField(blank=False, max_length=20)
    description = models.CharField(blank=False, max_length=100)