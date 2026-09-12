from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(["GET"])
@permission_classes([AllowAny])
def public_menu(request, qr_token):
    """Step 7: resolve table from qr_token -> return cafe + table + menu. TODO."""
    return Response({"detail": "not implemented", "qr_token": qr_token})


@api_view(["POST"])
@permission_classes([AllowAny])
def create_public_order(request, qr_token):
    """Step 8: create an order from the customer's cart. TODO."""
    return Response({"detail": "not implemented"})
