from django.db import models

from apps.common.models import TimeStampedModel, UUIDModel


class Cafe(UUIDModel, TimeStampedModel):
    """Tenant root. Everything else hangs off cafe."""
    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=80, unique=True)
    logo_url = models.URLField(max_length=500, blank=True, null=True)
    address = models.CharField(max_length=300, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    upi_vpa = models.CharField(max_length=120, blank=True, null=True)
    gst_rate = models.DecimalField(max_digits=5, decimal_places=2, default=5)
    currency = models.CharField(max_length=3, default="INR")
    order_seq = models.PositiveIntegerField(default=1047)  # per-cafe order counter
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name
