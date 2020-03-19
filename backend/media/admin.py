from django.contrib import admin
from .models import Media

class MediaAdmin(admin.ModelAdmin):
    list_display = ('user', 'type', 'path')
    list_display_links = ('path',)
    search_fields = ('path',)
    list_per_page = 25
# Register your models here.
admin.site.register(Media, MediaAdmin)