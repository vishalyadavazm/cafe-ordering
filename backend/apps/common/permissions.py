from rest_framework.permissions import BasePermission

from apps.common.enums import StaffRole


class IsCafeStaff(BasePermission):
    """User must be authenticated and attached to a cafe."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.cafe_id)


def role_required(*roles):
    class _RolePerm(BasePermission):
        def has_permission(self, request, view):
            return bool(request.user and request.user.role in roles)
    return _RolePerm


# Convenience
IsOwnerOrManager = role_required(StaffRole.OWNER, StaffRole.MANAGER)
