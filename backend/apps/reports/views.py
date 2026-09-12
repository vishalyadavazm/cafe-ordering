from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from apps.common.permissions import IsCafeStaff


@api_view(["GET"])
@permission_classes([IsCafeStaff])
def summary(request):
    """Step 15: today's orders/revenue/AOV, most-ordered, etc. TODO."""
    return Response({"detail": "not implemented"})
