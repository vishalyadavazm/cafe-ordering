"""Read-only serializers for the public (no-auth) menu endpoint.

Kept separate from apps/orders/serializers.py because these expose a
deliberately trimmed field set — no cafe internals, no tenant id, no
unavailable items/add-ons.
"""
from rest_framework import serializers

from apps.cafes.models import Cafe
from apps.menu.models import AddOn, Category, MenuItem
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
