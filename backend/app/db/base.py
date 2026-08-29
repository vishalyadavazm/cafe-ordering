"""Import Base + every model so Alembic autogenerate sees the full metadata."""
from app.db.base_class import Base  # noqa: F401
from app.models.cafe import Cafe  # noqa: F401
from app.models.staff import StaffUser  # noqa: F401
from app.models.table import DiningTable  # noqa: F401
from app.models.menu import AddOn, Category, MenuItem  # noqa: F401
from app.models.order import Order, OrderItem  # noqa: F401
from app.models.payment import Payment  # noqa: F401
