from rest_framework import serializers

from apps.tables.models import DiningTable


class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiningTable
        exclude = ("cafe",)          # cafe is set from the request, not the client
        read_only_fields = ("id", "qr_token", "created_at", "updated_at")
