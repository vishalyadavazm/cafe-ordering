"""Read-only serializers for the public (no-auth) menu endpoint.

Kept separate from apps/orders/serializers.py because these expose a
deliberately trimmed field set — no cafe internals, no tenant id, no
unavailable items/add-ons.
"""
from rest_framework import serializers

from apps.cafes.models import Cafe
from apps.menu.models import AddOn, Category, MenuItem
from apps.orders.models import Order, OrderItem
from apps.tables.models import DiningTable


class PublicCafeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cafe
        fields = ("id", "name", "slug", "logo_url", "currency", "gst_rate")


class PublicTableSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiningTable
        fields = ("id", "number", "label")


class PublicAddOnSerializer(serializers.ModelSerializer):
    class Meta:
        model = AddOn
        fields = ("id", "name", "price")


class PublicMenuItemSerializer(serializers.ModelSerializer):
    addons = PublicAddOnSerializer(many=True, read_only=True)

    class Meta:
        model = MenuItem
        fields = ("id", "name", "description", "price", "image_url", "is_veg", "addons")


class PublicCategorySerializer(serializers.ModelSerializer):
    items = PublicMenuItemSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ("id", "name", "sort_order", "items")


class PublicOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ("id", "name_snapshot", "unit_price", "quantity", "line_total", "addons")


class PublicOrderSerializer(serializers.ModelSerializer):
    """Tracking payload for /public/orders/<customer_session>/ — no cafe/tenant
    internals, just what the customer's own phone needs to show progress."""
    items = PublicOrderItemSerializer(many=True, read_only=True)
    table_number = serializers.IntegerField(source="table.number", read_only=True, allow_null=True)
    cafe_name = serializers.CharField(source="cafe.name", read_only=True)

    class Meta:
        model = Order
        fields = (
            "id", "order_number", "status", "table_number", "cafe_name", "items",
            "subtotal", "tax", "total", "payment_status", "payment_method",
            "special_instructions", "created_at", "accepted_at", "ready_at", "served_at",
        )
