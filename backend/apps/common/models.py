import uuid

from django.db import models


class UUIDModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class TenantModel(UUIDModel, TimeStampedModel):
    """Multi-tenant spine: every tenant row carries cafe. related_name resolves
    per concrete model (e.g. Cafe.menuitems, Cafe.orders)."""
    cafe = models.ForeignKey(
        "cafes.Cafe", on_delete=models.CASCADE, related_name="%(class)ss"
    )

    class Meta:
        abstract = True
