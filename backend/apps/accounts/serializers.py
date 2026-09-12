from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from apps.accounts.models import StaffUser


class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffUser
        fields = ("id", "email", "full_name", "role", "cafe", "is_active")
        read_only_fields = fields


class CafeTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Adds cafe_id + role claims so the frontend and permissions can read them."""
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["cafe_id"] = str(user.cafe_id) if user.cafe_id else None
        token["role"] = user.role
        token["name"] = user.full_name
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["staff"] = StaffSerializer(self.user).data
        return data
