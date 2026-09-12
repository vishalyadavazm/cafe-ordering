from apps.common.views import TenantScopedViewSet
from apps.menu.models import AddOn, Category, MenuItem
from apps.menu.serializers import AddOnSerializer, CategorySerializer, MenuItemSerializer


class CategoryViewSet(TenantScopedViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class MenuItemViewSet(TenantScopedViewSet):
    queryset = MenuItem.objects.select_related("category").prefetch_related("addons")
    serializer_class = MenuItemSerializer


class AddOnViewSet(TenantScopedViewSet):
    queryset = AddOn.objects.all()
    serializer_class = AddOnSerializer
