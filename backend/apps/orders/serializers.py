from rest_framework import serializers

from apps.orders.models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ("id", "name_snapshot", "unit_price", "quantity", "line_total", "addons")


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        exclude = ("cafe",)
        read_only_fields = ("id", "order_number", "created_at", "updated_at")

# Step 8: OrderCreateSerializer (accepts item ids + qty + addons, validates, calls services).
