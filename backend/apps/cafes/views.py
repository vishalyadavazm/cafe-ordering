from rest_framework import mixins, viewsets
from rest_framework.response import Response

from apps.cafes.models import Cafe
from apps.cafes.serializers import CafeSerializer
from apps.common.permissions import IsCafeStaff


class MyCafeViewSet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
    """GET/PATCH the caller's own cafe (/cafes/me/). Owner mgmt expands in step 4."""
    serializer_class = CafeSerializer
    permission_classes = [IsCafeStaff]

    def get_object(self):
        return self.request.user.cafe
