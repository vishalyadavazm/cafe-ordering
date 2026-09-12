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

class OrderItemCreateSerializer(serializers.Serializer):
    menu_item_id = serializers.UUIDField()
    quantity = serializers.IntegerField(min_value=1)
    addon_ids = serializers.ListField(child=serializers.UUIDField(), required=False, default=list)


class OrderCreateSerializer(serializers.Serializer):
    """Public cart payload: item ids + quantities + chosen add-ons only — never a price
    or total. Server recomputes everything from DB prices in orders/services.py."""
    items = OrderItemCreateSerializer(many=True)
    special_instructions = serializers.CharField(required=False, allow_blank=True, default="")

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("At least one item is required.")
        return value
