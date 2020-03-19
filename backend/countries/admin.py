from django.contrib import admin
from .models import Countries

class CountriesAdmin(admin.ModelAdmin):
    list_display = ('id', 'two_code', 'three_code', 'description')
    list_display_links = ('id', 'two_code')
    search_fields = ('description',)
    list_per_page = 25
# Register your models here.
admin.site.register(Countries, CountriesAdmin)
