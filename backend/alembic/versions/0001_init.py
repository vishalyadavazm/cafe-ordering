"""initial schema

Revision ID: 0001_init
Revises:
Create Date: 2026-01-01
"""
from typing import Sequence, Union

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "0001_init"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

UUID = postgresql.UUID(as_uuid=True)


def _ts(*cols):
    return (
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        *cols,
    )


def upgrade() -> None:
    op.create_table(
        "cafes",
        sa.Column("id", UUID, primary_key=True),
        sa.Column("name", sa.String(120), nullable=False),
        sa.Column("slug", sa.String(80), nullable=False),
        sa.Column("logo_url", sa.String(500)),
        sa.Column("address", sa.String(300)),
        sa.Column("phone", sa.String(20)),
        sa.Column("upi_vpa", sa.String(120)),
        sa.Column("gst_rate", sa.Numeric(5, 2), server_default=sa.text("5.00"), nullable=False),
        sa.Column("currency", sa.String(3), server_default=sa.text("'INR'"), nullable=False),
        sa.Column("order_seq", sa.Integer, server_default=sa.text("1047"), nullable=False),
        sa.Column("is_active", sa.Boolean, server_default=sa.text("true"), nullable=False),
        *_ts(),
    )
    op.create_index("ix_cafes_slug", "cafes", ["slug"], unique=True)

    op.create_table(
        "staff_users",
        sa.Column("id", UUID, primary_key=True),
        sa.Column("cafe_id", UUID, sa.ForeignKey("cafes.id", ondelete="CASCADE"), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("full_name", sa.String(120), nullable=False),
        sa.Column("role", sa.String(20), server_default=sa.text("'WAITER'"), nullable=False),
        sa.Column("is_active", sa.Boolean, server_default=sa.text("true"), nullable=False),
        *_ts(),
        sa.UniqueConstraint("cafe_id", "email", name="uq_staff_cafe_email"),
    )
    op.create_index("ix_staff_users_cafe_id", "staff_users", ["cafe_id"])
    op.create_index("ix_staff_users_email", "staff_users", ["email"])

    op.create_table(
        "tables",
        sa.Column("id", UUID, primary_key=True),
        sa.Column("cafe_id", UUID, sa.ForeignKey("cafes.id", ondelete="CASCADE"), nullable=False),
        sa.Column("number", sa.Integer, nullable=False),
        sa.Column("label", sa.String(40)),
        sa.Column("qr_token", UUID, nullable=False),
        sa.Column("status", sa.String(20), server_default=sa.text("'AVAILABLE'"), nullable=False),
        sa.Column("seats", sa.Integer),
        *_ts(),
        sa.UniqueConstraint("cafe_id", "number", name="uq_table_cafe_number"),
    )
    op.create_index("ix_tables_cafe_id", "tables", ["cafe_id"])
    op.create_index("ix_tables_qr_token", "tables", ["qr_token"], unique=True)

    op.create_table(
        "categories",
        sa.Column("id", UUID, primary_key=True),
        sa.Column("cafe_id", UUID, sa.ForeignKey("cafes.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(80), nullable=False),
        sa.Column("sort_order", sa.Integer, server_default=sa.text("0"), nullable=False),
        sa.Column("is_active", sa.Boolean, server_default=sa.text("true"), nullable=False),
        *_ts(),
    )
    op.create_index("ix_categories_cafe_id", "categories", ["cafe_id"])

    op.create_table(
        "menu_items",
        sa.Column("id", UUID, primary_key=True),
        sa.Column("cafe_id", UUID, sa.ForeignKey("cafes.id", ondelete="CASCADE"), nullable=False),
        sa.Column("category_id", UUID, sa.ForeignKey("categories.id", ondelete="SET NULL")),
        sa.Column("name", sa.String(120), nullable=False),
        sa.Column("description", sa.Text),
        sa.Column("price", sa.Numeric(10, 2), nullable=False),
        sa.Column("image_url", sa.String(500)),
        sa.Column("is_veg", sa.Boolean, server_default=sa.text("true"), nullable=False),
        sa.Column("is_available", sa.Boolean, server_default=sa.text("true"), nullable=False),
        sa.Column("sort_order", sa.Integer, server_default=sa.text("0"), nullable=False),
        *_ts(),
    )
    op.create_index("ix_menu_items_cafe_id", "menu_items", ["cafe_id"])
    op.create_index("ix_menu_items_category_id", "menu_items", ["category_id"])

    op.create_table(
        "addons",
        sa.Column("id", UUID, primary_key=True),
        sa.Column("cafe_id", UUID, sa.ForeignKey("cafes.id", ondelete="CASCADE"), nullable=False),
        sa.Column("menu_item_id", UUID, sa.ForeignKey("menu_items.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(80), nullable=False),
        sa.Column("price", sa.Numeric(10, 2), server_default=sa.text("0.00"), nullable=False),
        sa.Column("is_active", sa.Boolean, server_default=sa.text("true"), nullable=False),
        *_ts(),
    )
    op.create_index("ix_addons_cafe_id", "addons", ["cafe_id"])
    op.create_index("ix_addons_menu_item_id", "addons", ["menu_item_id"])

    op.create_table(
        "orders",
        sa.Column("id", UUID, primary_key=True),
        sa.Column("cafe_id", UUID, sa.ForeignKey("cafes.id", ondelete="CASCADE"), nullable=False),
        sa.Column("table_id", UUID, sa.ForeignKey("tables.id", ondelete="SET NULL")),
        sa.Column("order_number", sa.Integer, nullable=False),
        sa.Column("status", sa.String(20), server_default=sa.text("'NEW'"), nullable=False),
        sa.Column("subtotal", sa.Numeric(10, 2), server_default=sa.text("0.00"), nullable=False),
        sa.Column("tax", sa.Numeric(10, 2), server_default=sa.text("0.00"), nullable=False),
        sa.Column("total", sa.Numeric(10, 2), server_default=sa.text("0.00"), nullable=False),
        sa.Column("payment_status", sa.String(20), server_default=sa.text("'PENDING'"), nullable=False),
        sa.Column("payment_method", sa.String(20)),
        sa.Column("special_instructions", sa.Text),
        sa.Column("customer_session", sa.String(64)),
        sa.Column("accepted_at", sa.DateTime(timezone=True)),
        sa.Column("ready_at", sa.DateTime(timezone=True)),
        sa.Column("served_at", sa.DateTime(timezone=True)),
        *_ts(),
        sa.UniqueConstraint("cafe_id", "order_number", name="uq_order_cafe_number"),
    )
    op.create_index("ix_orders_cafe_id", "orders", ["cafe_id"])
    op.create_index("ix_orders_table_id", "orders", ["table_id"])
    op.create_index("ix_orders_status", "orders", ["status"])
    op.create_index("ix_orders_customer_session", "orders", ["customer_session"])

    op.create_table(
        "order_items",
        sa.Column("id", UUID, primary_key=True),
        sa.Column("order_id", UUID, sa.ForeignKey("orders.id", ondelete="CASCADE"), nullable=False),
        sa.Column("menu_item_id", UUID, sa.ForeignKey("menu_items.id", ondelete="SET NULL")),
        sa.Column("name_snapshot", sa.String(160), nullable=False),
        sa.Column("unit_price", sa.Numeric(10, 2), nullable=False),
        sa.Column("quantity", sa.Integer, server_default=sa.text("1"), nullable=False),
        sa.Column("line_total", sa.Numeric(10, 2), nullable=False),
        sa.Column("addons", postgresql.JSONB),
        *_ts(),
    )
    op.create_index("ix_order_items_order_id", "order_items", ["order_id"])

    op.create_table(
        "payments",
        sa.Column("id", UUID, primary_key=True),
        sa.Column("cafe_id", UUID, sa.ForeignKey("cafes.id", ondelete="CASCADE"), nullable=False),
        sa.Column("order_id", UUID, sa.ForeignKey("orders.id", ondelete="CASCADE"), nullable=False),
        sa.Column("provider", sa.String(30), server_default=sa.text("'razorpay'"), nullable=False),
        sa.Column("razorpay_order_id", sa.String(60)),
        sa.Column("razorpay_payment_id", sa.String(60)),
        sa.Column("razorpay_signature", sa.String(255)),
        sa.Column("amount", sa.Numeric(10, 2), nullable=False),
        sa.Column("status", sa.String(20), server_default=sa.text("'PENDING'"), nullable=False),
        sa.Column("method", sa.String(20)),
        sa.Column("notes", postgresql.JSONB),
        *_ts(),
        sa.UniqueConstraint("order_id", name="uq_payment_order"),
    )
    op.create_index("ix_payments_cafe_id", "payments", ["cafe_id"])
    op.create_index("ix_payments_order_id", "payments", ["order_id"])
    op.create_index("ix_payments_razorpay_order_id", "payments", ["razorpay_order_id"])


def downgrade() -> None:
    for t in ("payments", "order_items", "orders", "addons", "menu_items",
              "categories", "tables", "staff_users", "cafes"):
        op.drop_table(t)
