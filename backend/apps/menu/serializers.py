from rest_framework import serializers

from apps.menu.models import AddOn, Category, MenuItem


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        exclude = ("cafe",)


class AddOnSerializer(serializers.ModelSerializer):
    class Meta:
        model = AddOn
        exclude = ("cafe",)


class MenuItemSerializer(serializers.ModelSerializer):
    addons = AddOnSerializer(many=True, read_only=True)

    class Meta:
        model = MenuItem
        exclude = ("cafe",)
