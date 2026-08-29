from sqlalchemy import Boolean, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base, TenantMixin, TimestampMixin, UUIDMixin
from app.models.enums import StaffRole


class StaffUser(UUIDMixin, TenantMixin, TimestampMixin, Base):
    __tablename__ = "staff_users"
    __table_args__ = (UniqueConstraint("cafe_id", "email", name="uq_staff_cafe_email"),)

    email: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(120), nullable=False)
    role: Mapped[str] = mapped_column(String(20), default=StaffRole.WAITER.value, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    cafe: Mapped["Cafe"] = relationship(back_populates="staff")
