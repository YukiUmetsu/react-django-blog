from django.db import models


class Categories(models.Model):
    """blog categories. categories can be nexted."""
    name = models.CharField(blank=False, max_length=100)
    parent = models.ForeignKey('self', blank=True, null=True, on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Categories'
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name