from django.contrib import admin

from apps.menu.models import AddOn, Category, MenuItem


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "sort_order", "is_active", "cafe")
    list_filter = ("cafe", "is_active")


class AddOnInline(admin.TabularInline):
    model = AddOn
    extra = 0


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price", "is_veg", "is_available", "cafe")
    list_filter = ("cafe", "category", "is_veg", "is_available")
    search_fields = ("name",)
    inlines = [AddOnInline]
