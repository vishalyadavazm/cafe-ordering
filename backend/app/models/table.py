import uuid

from sqlalchemy import Integer, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base, TenantMixin, TimestampMixin, UUIDMixin
from app.models.enums import TableStatus


class DiningTable(UUIDMixin, TenantMixin, TimestampMixin, Base):
    """qr_token (not id) goes in the QR URL: unguessable and rotatable."""
    __tablename__ = "tables"
    __table_args__ = (UniqueConstraint("cafe_id", "number", name="uq_table_cafe_number"),)

    number: Mapped[int] = mapped_column(Integer, nullable=False)
    label: Mapped[str | None] = mapped_column(String(40))
    qr_token: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True), default=uuid.uuid4, unique=True, index=True, nullable=False
    )
    status: Mapped[str] = mapped_column(String(20), default=TableStatus.AVAILABLE.value, nullable=False)
    seats: Mapped[int | None] = mapped_column(Integer)

    cafe: Mapped["Cafe"] = relationship(back_populates="tables")
    orders: Mapped[list["Order"]] = relationship(back_populates="table")
