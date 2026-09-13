from django.db.models import Prefetch
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from apps.menu.models import AddOn, Category, MenuItem
from apps.orders.models import Order
from apps.orders.public_serializers import (
    PublicCafeSerializer,
    PublicCategorySerializer,
    PublicOrderSerializer,
    PublicTableSerializer,
)
from apps.orders.serializers import OrderCreateSerializer
from apps.orders.services import create_order
from apps.tables.models import DiningTable


def _resolve_table(qr_token):
    return get_object_or_404(
        DiningTable.objects.select_related("cafe"), qr_token=qr_token, cafe__is_active=True,
    )


@api_view(["GET"])
@permission_classes([AllowAny])
def public_menu(request, qr_token):
    """Resolve the table from qr_token -> cafe + table + available menu."""
    table = _resolve_table(qr_token)
    categories = (
        Category.objects.filter(cafe=table.cafe, is_active=True)
        .prefetch_related(
            Prefetch(
                "items",
                queryset=MenuItem.objects.filter(is_available=True)
                .prefetch_related(Prefetch("addons", queryset=AddOn.objects.filter(is_active=True)))
                .order_by("sort_order"),
            )
        )
        .order_by("sort_order")
    )
    return Response({
        "cafe": PublicCafeSerializer(table.cafe).data,
        "table": PublicTableSerializer(table).data,
        "categories": PublicCategorySerializer(categories, many=True).data,
    })


@api_view(["POST"])
@permission_classes([AllowAny])
def create_public_order(request, qr_token):
    """Create an order from the customer's cart: item ids + quantities + add-ons only."""
    table = _resolve_table(qr_token)

    serializer = OrderCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    try:
        order = create_order(
            table=table,
            items_data=serializer.validated_data["items"],
            special_instructions=serializer.validated_data.get("special_instructions", ""),
        )
    except ValueError as exc:
        raise ValidationError({"items": str(exc)})

    return Response(
        {
            "id": order.id,
            "order_number": order.order_number,
            "customer_session": order.customer_session,
            "total": order.total,
        },
        status=201,
    )


@api_view(["GET"])
@permission_classes([AllowAny])
def track_public_order(request, customer_session):
    """A phone tracks its own order with the session token handed back at
    creation — never by guessable order id (see CLAUDE.md convention 8)."""
    order = get_object_or_404(
        Order.objects.select_related("table", "cafe").prefetch_related("items"),
        customer_session=customer_session,
    )
    return Response(PublicOrderSerializer(order).data)
