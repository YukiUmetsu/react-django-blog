from django.contrib import admin
from .models import CustomUser

class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_name', 'last_name', 'email', 'created_at', 'is_superuser', 'is_active', 'is_staff')
    list_display_links = ('id', 'email')
    search_fields = ('email',)
    list_per_page = 25
# Register your models here.
admin.site.register(CustomUser, CustomUserAdmin)
