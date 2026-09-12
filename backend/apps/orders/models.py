from django.db import models

from apps.common.enums import OrderStatus, PaymentMethod, PaymentStatus
from apps.common.models import TenantModel, TimeStampedModel, UUIDModel


class Order(TenantModel):
    table = models.ForeignKey(
        "tables.DiningTable", on_delete=models.SET_NULL, null=True, blank=True, related_name="orders"
    )
    order_number = models.PositiveIntegerField()  # per-cafe, human-friendly (#1048)
    status = models.CharField(max_length=20, choices=OrderStatus.choices, default=OrderStatus.NEW, db_index=True)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.PENDING)
    payment_method = models.CharField(max_length=20, choices=PaymentMethod.choices, blank=True, null=True)
    special_instructions = models.TextField(blank=True, null=True)
    # lets a phone track its own orders without any login
    customer_session = models.CharField(max_length=64, blank=True, null=True, db_index=True)
    accepted_at = models.DateTimeField(blank=True, null=True)
    ready_at = models.DateTimeField(blank=True, null=True)
    served_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=["cafe", "order_number"], name="uq_order_cafe_number")]
        ordering = ["-created_at"]

    def __str__(self):
        return f"#{self.order_number}"


class OrderItem(UUIDModel, TimeStampedModel):
    """Name/price snapshotted so history stays correct after menu edits."""
    order = models.ForeignKey("orders.Order", on_delete=models.CASCADE, related_name="items")
    menu_item = models.ForeignKey("menu.MenuItem", on_delete=models.SET_NULL, null=True, blank=True)
    name_snapshot = models.CharField(max_length=160)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    line_total = models.DecimalField(max_digits=10, decimal_places=2)
    addons = models.JSONField(blank=True, null=True)  # [{"name":..., "price":...}]
