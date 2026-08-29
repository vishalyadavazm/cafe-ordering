import uuid
from decimal import Decimal

from sqlalchemy import ForeignKey, Numeric, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base, TenantMixin, TimestampMixin, UUIDMixin
from app.models.enums import PaymentStatus


class Payment(UUIDMixin, TenantMixin, TimestampMixin, Base):
    __tablename__ = "payments"
    order_id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("orders.id", ondelete="CASCADE"),
        unique=True, index=True, nullable=False,
    )
    provider: Mapped[str] = mapped_column(String(30), default="razorpay", nullable=False)
    razorpay_order_id: Mapped[str | None] = mapped_column(String(60), index=True)
    razorpay_payment_id: Mapped[str | None] = mapped_column(String(60))
    razorpay_signature: Mapped[str | None] = mapped_column(String(255))
    amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default=PaymentStatus.PENDING.value, nullable=False)
    method: Mapped[str | None] = mapped_column(String(20))
    notes: Mapped[dict | None] = mapped_column(JSONB)
    order: Mapped["Order"] = relationship(back_populates="payment")
