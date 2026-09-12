from django.db import models


class StaffRole(models.TextChoices):
    OWNER = "OWNER"
    MANAGER = "MANAGER"
    CHEF = "CHEF"
    WAITER = "WAITER"
    CASHIER = "CASHIER"


class TableStatus(models.TextChoices):
    AVAILABLE = "AVAILABLE"
    OCCUPIED = "OCCUPIED"
    ORDERING = "ORDERING"
    PREPARING = "PREPARING"
    READY = "READY"


class OrderStatus(models.TextChoices):
    NEW = "NEW"
    ACCEPTED = "ACCEPTED"
    PREPARING = "PREPARING"
    READY = "READY"
    SERVED = "SERVED"
    CANCELLED = "CANCELLED"


class PaymentStatus(models.TextChoices):
    PENDING = "PENDING"
    PAID = "PAID"
    FAILED = "FAILED"
    REFUNDED = "REFUNDED"


class PaymentMethod(models.TextChoices):
    UPI = "UPI"
    CARD = "CARD"
    CASH = "CASH"
