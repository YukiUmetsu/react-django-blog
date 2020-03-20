from django.contrib import admin
from .models import Posts


class PostsAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'created_at', 'category')
    ordering = ('-created_at',)
    list_display_links = ('id', 'title')
    search_fields = ('title', 'category', 'content')
    list_per_page = 25


# Register your models here.
admin.site.register(Posts, PostsAdmin)
