"""API v1 aggregate router. Each app registers its viewsets here."""
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.common.views import health
from apps.tables.views import TableViewSet
from apps.menu.views import AddOnViewSet, CategoryViewSet, MenuItemViewSet
from apps.orders.views import OrderViewSet

router = DefaultRouter()
router.register("tables", TableViewSet, basename="table")
router.register("categories", CategoryViewSet, basename="category")
router.register("menu-items", MenuItemViewSet, basename="menuitem")
router.register("addons", AddOnViewSet, basename="addon")
router.register("orders", OrderViewSet, basename="order")

urlpatterns = [
    path("health/", health),
    path("auth/", include("apps.accounts.urls")),
    path("cafes/", include("apps.cafes.urls")),
    path("public/", include("apps.orders.public_urls")),   # customer, no auth
    path("payments/", include("apps.payments.urls")),
    path("reports/", include("apps.reports.urls")),
    path("", include(router.urls)),
]
