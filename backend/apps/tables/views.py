from apps.common.views import TenantScopedViewSet
from apps.tables.models import DiningTable
from apps.tables.serializers import TableSerializer


class TableViewSet(TenantScopedViewSet):
    queryset = DiningTable.objects.all().order_by("number")
    serializer_class = TableSerializer
    # Step 5: add @action detail QR download + list "download all" (zip).
