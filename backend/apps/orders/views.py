from rest_framework import mixins, viewsets

from apps.common.permissions import IsCafeStaff
from apps.orders.models import Order
from apps.orders.serializers import OrderSerializer


class OrderViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    """Staff: list/retrieve orders for the cafe. Status transitions added in step 11
    (PATCH /orders/{id}/status via @action)."""
    serializer_class = OrderSerializer
    permission_classes = [IsCafeStaff]

    def get_queryset(self):
        return (Order.objects.filter(cafe=self.request.user.cafe)
                .select_related("table").prefetch_related("items"))
