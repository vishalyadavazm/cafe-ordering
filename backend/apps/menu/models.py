from django.db import models

from apps.common.models import TenantModel


class Category(TenantModel):
    name = models.CharField(max_length=80)
    sort_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "categories"
        ordering = ["sort_order"]

    def __str__(self):
        return self.name


class MenuItem(TenantModel):
    category = models.ForeignKey(
        "menu.Category", on_delete=models.SET_NULL, null=True, blank=True, related_name="items"
    )
    name = models.CharField(max_length=120)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image_url = models.URLField(max_length=500, blank=True, null=True)
    is_veg = models.BooleanField(default=True)
    is_available = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0)

    class Meta:
        ordering = ["sort_order"]

    def __str__(self):
        return self.name


class AddOn(TenantModel):
    menu_item = models.ForeignKey("menu.MenuItem", on_delete=models.CASCADE, related_name="addons")
    name = models.CharField(max_length=80)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name
