import uuid

from django.db import models

from apps.common.enums import TableStatus
from apps.common.models import TenantModel


class DiningTable(TenantModel):
    """qr_token (not id) goes in the QR URL: unguessable and rotatable."""
    number = models.PositiveIntegerField()
    label = models.CharField(max_length=40, blank=True, null=True)
    qr_token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    status = models.CharField(max_length=20, choices=TableStatus.choices, default=TableStatus.AVAILABLE)
    seats = models.PositiveIntegerField(blank=True, null=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=["cafe", "number"], name="uq_table_cafe_number")]

    def __str__(self):
        return f"Table {self.number}"
