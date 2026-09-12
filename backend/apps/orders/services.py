"""Order creation + status transitions (steps 8 & 11).

create_order():
  - next order_number: Cafe.objects.select_for_update() on the cafe row, bump order_seq
  - compute subtotal/tax/total from DB prices (never trust client amounts)
  - snapshot name+price into OrderItem
Status transitions stamp accepted_at/ready_at/served_at and (step 10) broadcast over WS.
"""
import secrets
from decimal import ROUND_HALF_UP, Decimal

from django.db import transaction

from apps.cafes.models import Cafe
from apps.menu.models import AddOn, MenuItem
from apps.orders.models import Order, OrderItem


def _quantize(amount: Decimal) -> Decimal:
    return amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


@transaction.atomic
def create_order(*, table, items_data, special_instructions=""):
    """items_data: [{"menu_item_id": UUID, "quantity": int, "addon_ids": [UUID, ...]}]

    Locks the cafe row for the order_number bump, re-fetches every price from the
    DB (client-sent amounts are never trusted), and snapshots name/price onto each
    OrderItem so past orders stay correct after the menu changes.
    """
    cafe = Cafe.objects.select_for_update().get(pk=table.cafe_id)

    line_items = []
    subtotal = Decimal("0")
    for entry in items_data:
        try:
            menu_item = MenuItem.objects.get(
                pk=entry["menu_item_id"], cafe=cafe, is_available=True,
            )
        except MenuItem.DoesNotExist:
            raise ValueError(f"Menu item {entry['menu_item_id']} is not available.")

        addon_ids = set(entry.get("addon_ids") or [])
        addons = list(AddOn.objects.filter(pk__in=addon_ids, menu_item=menu_item, is_active=True))
        if len(addons) != len(addon_ids):
            raise ValueError("One or more add-ons are invalid for this item.")

        quantity = entry["quantity"]
        addon_unit_total = sum((a.price for a in addons), Decimal("0"))
        line_total = _quantize((menu_item.price + addon_unit_total) * quantity)
        subtotal += line_total

        line_items.append(OrderItem(
            menu_item=menu_item,
            name_snapshot=menu_item.name,
            unit_price=menu_item.price,
            quantity=quantity,
            line_total=line_total,
            addons=[{"name": a.name, "price": str(a.price)} for a in addons],
        ))

    subtotal = _quantize(subtotal)
    tax = _quantize(subtotal * cafe.gst_rate / Decimal("100"))
    total = subtotal + tax

    order_number = cafe.order_seq
    cafe.order_seq = order_number + 1
    cafe.save(update_fields=["order_seq"])

    order = Order.objects.create(
        cafe=cafe,
        table=table,
        order_number=order_number,
        subtotal=subtotal,
        tax=tax,
        total=total,
        special_instructions=special_instructions,
        customer_session=secrets.token_urlsafe(32),
    )
    for item in line_items:
        item.order = order
    OrderItem.objects.bulk_create(line_items)

    return order
