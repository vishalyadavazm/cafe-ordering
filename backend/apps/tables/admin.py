from django.contrib import admin

from apps.tables.models import DiningTable


@admin.register(DiningTable)
class DiningTableAdmin(admin.ModelAdmin):
    list_display = ("number", "label", "status", "cafe", "seats")
    list_filter = ("status", "cafe")
