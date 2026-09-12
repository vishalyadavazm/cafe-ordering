from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(["POST"])
@permission_classes([AllowAny])
def razorpay_create(request):
    """Step 9: create a Razorpay order for an order id. TODO."""
    return Response({"detail": "not implemented"})


@api_view(["POST"])
@permission_classes([AllowAny])
def razorpay_verify(request):
    """Step 9: verify payment signature. TODO."""
    return Response({"detail": "not implemented"})


@api_view(["POST"])
@permission_classes([AllowAny])
def razorpay_webhook(request):
    """Step 9: handle Razorpay webhook (verify webhook secret). TODO."""
    return Response({"detail": "not implemented"})
