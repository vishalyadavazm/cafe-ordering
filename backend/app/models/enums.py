"""Status vocabularies. Stored as short strings in Postgres; validated by Pydantic."""
import enum


class StaffRole(str, enum.Enum):
    OWNER = "OWNER"; MANAGER = "MANAGER"; CHEF = "CHEF"; WAITER = "WAITER"; CASHIER = "CASHIER"


class TableStatus(str, enum.Enum):
    AVAILABLE = "AVAILABLE"; OCCUPIED = "OCCUPIED"; ORDERING = "ORDERING"
    PREPARING = "PREPARING"; READY = "READY"


class OrderStatus(str, enum.Enum):
    NEW = "NEW"; ACCEPTED = "ACCEPTED"; PREPARING = "PREPARING"
    READY = "READY"; SERVED = "SERVED"; CANCELLED = "CANCELLED"


class PaymentStatus(str, enum.Enum):
    PENDING = "PENDING"; PAID = "PAID"; FAILED = "FAILED"; REFUNDED = "REFUNDED"


class PaymentMethod(str, enum.Enum):
    UPI = "UPI"; CARD = "CARD"; CASH = "CASH"
