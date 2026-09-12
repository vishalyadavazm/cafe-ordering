from django.contrib import admin

from apps.accounts.models import StaffUser


@admin.register(StaffUser)
class StaffUserAdmin(admin.ModelAdmin):
    list_display = ("email", "full_name", "role", "cafe", "is_active", "is_staff")
    list_filter = ("role", "is_active", "cafe")
    search_fields = ("email", "full_name")
    # Note: create staff via `createsuperuser` or the API (passwords are hashed there).
