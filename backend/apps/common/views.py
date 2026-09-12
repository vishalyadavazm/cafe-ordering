from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from apps.common.permissions import IsCafeStaff


@api_view(["GET"])
@permission_classes([AllowAny])
def health(request):
    return Response({"status": "ok"})


class TenantScopedViewSet(viewsets.ModelViewSet):
    """Base for all staff CRUD. Scopes every query to the caller's cafe and
    stamps cafe on create — this is the multi-tenant guard."""
    permission_classes = [IsCafeStaff]

    def get_queryset(self):
        return super().get_queryset().filter(cafe=self.request.user.cafe)

    def perform_create(self, serializer):
        serializer.save(cafe=self.request.user.cafe)
