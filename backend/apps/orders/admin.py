from django.contrib import admin

from apps.orders.models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("order_number", "cafe", "table", "status", "total", "payment_status", "created_at")
    list_filter = ("cafe", "status", "payment_status")
    search_fields = ("order_number", "customer_session")
    inlines = [OrderItemInline]
