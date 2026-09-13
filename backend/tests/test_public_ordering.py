from decimal import Decimal

import pytest
from rest_framework.test import APIClient

from apps.cafes.models import Cafe
from apps.menu.models import AddOn, Category, MenuItem
from apps.tables.models import DiningTable


@pytest.fixture
def cafe(db):
    return Cafe.objects.create(name="Test Cafe", slug="test-cafe", gst_rate=Decimal("5.00"))


@pytest.fixture
def table(cafe):
    return DiningTable.objects.create(cafe=cafe, number=1)


@pytest.fixture
def menu(cafe):
    category = Category.objects.create(cafe=cafe, name="Coffee", sort_order=1)
    item = MenuItem.objects.create(cafe=cafe, category=category, name="Latte", price=Decimal("100.00"))
    addon = AddOn.objects.create(cafe=cafe, menu_item=item, name="Extra shot", price=Decimal("20.00"))
    unavailable = MenuItem.objects.create(
        cafe=cafe, category=category, name="Seasonal Brew", price=Decimal("150.00"), is_available=False,
    )
    return {"category": category, "item": item, "addon": addon, "unavailable": unavailable}


def test_public_menu_hides_unavailable_items(table, menu):
    client = APIClient()
    resp = client.get(f"/api/v1/public/{table.qr_token}/")
    assert resp.status_code == 200
    data = resp.json()
    assert data["cafe"]["name"] == "Test Cafe"
    assert data["table"]["number"] == 1
    item_names = [i["name"] for c in data["categories"] for i in c["items"]]
    assert "Latte" in item_names
    assert "Seasonal Brew" not in item_names


def test_public_menu_unknown_qr_token_404(db):
    client = APIClient()
    resp = client.get("/api/v1/public/00000000-0000-0000-0000-000000000000/")
    assert resp.status_code == 404


def test_create_order_computes_totals_and_locks_sequence(table, menu, cafe):
    client = APIClient()
    starting_seq = cafe.order_seq
    payload = {
        "items": [
            {"menu_item_id": str(menu["item"].id), "quantity": 2, "addon_ids": [str(menu["addon"].id)]},
        ],
        "special_instructions": "No sugar",
    }
    resp = client.post(f"/api/v1/public/{table.qr_token}/orders/", payload, format="json")
    assert resp.status_code == 201, resp.content
    body = resp.json()

    # (100 + 20) * 2 = 240 subtotal; 5% gst -> 12 tax; 252 total
    assert Decimal(str(body["total"])) == Decimal("252.00")
    assert body["order_number"] == starting_seq

    cafe.refresh_from_db()
    assert cafe.order_seq == starting_seq + 1

    order = cafe.orders.get(pk=body["id"])
    assert order.subtotal == Decimal("240.00")
    assert order.tax == Decimal("12.00")
    assert order.special_instructions == "No sugar"
    item = order.items.get()
    assert item.name_snapshot == "Latte"
    assert item.unit_price == Decimal("100.00")
    assert item.line_total == Decimal("240.00")
    assert item.addons == [{"name": "Extra shot", "price": "20.00"}]
    assert body["customer_session"] == order.customer_session
    assert len(order.customer_session) > 20


def test_create_order_rejects_unavailable_item(table, menu):
    client = APIClient()
    payload = {"items": [{"menu_item_id": str(menu["unavailable"].id), "quantity": 1}]}
    resp = client.post(f"/api/v1/public/{table.qr_token}/orders/", payload, format="json")
    assert resp.status_code == 400


def test_create_order_rejects_empty_cart(table, menu):
    client = APIClient()
    resp = client.post(f"/api/v1/public/{table.qr_token}/orders/", {"items": []}, format="json")
    assert resp.status_code == 400


def test_create_order_rejects_addon_from_other_item(table, menu, cafe):
    other_item = MenuItem.objects.create(cafe=cafe, name="Tea", price=Decimal("50.00"))
    client = APIClient()
    payload = {"items": [{"menu_item_id": str(other_item.id), "quantity": 1, "addon_ids": [str(menu["addon"].id)]}]}
    resp = client.post(f"/api/v1/public/{table.qr_token}/orders/", payload, format="json")
    assert resp.status_code == 400


def test_track_order_by_session(table, menu):
    client = APIClient()
    payload = {"items": [{"menu_item_id": str(menu["item"].id), "quantity": 1}]}
    created = client.post(f"/api/v1/public/{table.qr_token}/orders/", payload, format="json").json()

    resp = client.get(f"/api/v1/public/orders/{created['customer_session']}/")
    assert resp.status_code == 200
    body = resp.json()
    assert body["id"] == created["id"]
    assert body["status"] == "NEW"
    assert body["table_number"] == table.number
    assert body["items"][0]["name_snapshot"] == "Latte"


def test_track_order_unknown_session_404(db):
    client = APIClient()
    resp = client.get("/api/v1/public/orders/not-a-real-session/")
    assert resp.status_code == 404
