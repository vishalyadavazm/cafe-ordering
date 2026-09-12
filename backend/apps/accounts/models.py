from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models

from apps.accounts.managers import StaffUserManager
from apps.common.enums import StaffRole
from apps.common.models import TimeStampedModel, UUIDModel


class StaffUser(UUIDModel, TimeStampedModel, AbstractBaseUser, PermissionsMixin):
    """Staff log in with email. cafe is nullable so a Django superuser (platform
    admin) can exist without a cafe; normal staff always have one."""
    cafe = models.ForeignKey(
        "cafes.Cafe", on_delete=models.CASCADE, related_name="staff", null=True, blank=True
    )
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=120)
    role = models.CharField(max_length=20, choices=StaffRole.choices, default=StaffRole.WAITER)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # Django admin access

    objects = StaffUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]

    def __str__(self):
        return self.email
