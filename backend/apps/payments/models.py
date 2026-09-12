from django.db import models

from apps.common.enums import PaymentStatus
from apps.common.models import TenantModel


class Payment(TenantModel):
    order = models.OneToOneField("orders.Order", on_delete=models.CASCADE, related_name="payment")
    provider = models.CharField(max_length=30, default="razorpay")
    razorpay_order_id = models.CharField(max_length=60, blank=True, null=True, db_index=True)
    razorpay_payment_id = models.CharField(max_length=60, blank=True, null=True)
    razorpay_signature = models.CharField(max_length=255, blank=True, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.PENDING)
    method = models.CharField(max_length=20, blank=True, null=True)
    notes = models.JSONField(blank=True, null=True)

    def __str__(self):
        return f"Payment for {self.order_id}"
