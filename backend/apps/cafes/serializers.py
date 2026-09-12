from rest_framework import serializers

from apps.cafes.models import Cafe


class CafeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cafe
        fields = "__all__"
        read_only_fields = ("id", "order_seq", "created_at", "updated_at")
