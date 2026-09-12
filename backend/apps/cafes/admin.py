from django.contrib import admin

from apps.cafes.models import Cafe


@admin.register(Cafe)
class CafeAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "currency", "gst_rate", "is_active")
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
