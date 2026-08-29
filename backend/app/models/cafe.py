from decimal import Decimal

from sqlalchemy import Boolean, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base, TimestampMixin, UUIDMixin


class Cafe(UUIDMixin, TimestampMixin, Base):
    """The tenant root. Everything else hangs off cafe_id."""
    __tablename__ = "cafes"

    name: Mapped[str] = mapped_column(String(120), nullable=False)
    slug: Mapped[str] = mapped_column(String(80), unique=True, index=True, nullable=False)
    logo_url: Mapped[str | None] = mapped_column(String(500))
    address: Mapped[str | None] = mapped_column(String(300))
    phone: Mapped[str | None] = mapped_column(String(20))
    upi_vpa: Mapped[str | None] = mapped_column(String(120))
    gst_rate: Mapped[Decimal] = mapped_column(Numeric(5, 2), default=Decimal("5.00"), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="INR", nullable=False)
    order_seq: Mapped[int] = mapped_column(Integer, default=1047, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    staff: Mapped[list["StaffUser"]] = relationship(back_populates="cafe", cascade="all, delete-orphan")
    tables: Mapped[list["DiningTable"]] = relationship(back_populates="cafe", cascade="all, delete-orphan")
    categories: Mapped[list["Category"]] = relationship(back_populates="cafe", cascade="all, delete-orphan")
    menu_items: Mapped[list["MenuItem"]] = relationship(back_populates="cafe", cascade="all, delete-orphan")
    orders: Mapped[list["Order"]] = relationship(back_populates="cafe", cascade="all, delete-orphan")
