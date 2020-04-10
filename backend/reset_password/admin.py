from django.contrib import admin
from .models import ResetPassword


# Register your models here.
class ResetPasswordAdmin(admin.ModelAdmin):
    list_display = ('email', 'reset_token', 'last_changed', 'user')
    ordering = ('last_changed',)
    list_display_links = ('email', 'reset_token')
    search_fields = ('email', 'user', 'last_changed')
    list_per_page = 25


# Register your models here.
admin.site.register(ResetPassword, ResetPasswordAdmin)
