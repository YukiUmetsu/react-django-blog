from django.contrib import admin
from .models import Categories


class CategoriesAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'parent')
    ordering = ('name',)
    list_display_links = ('id', 'name')
    search_fields = ('name',)
    list_per_page = 25


# Register your models here.
admin.site.register(Categories, CategoriesAdmin)
