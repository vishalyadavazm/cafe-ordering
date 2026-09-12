from django.urls import path

from apps.orders.public_views import create_public_order, public_menu

urlpatterns = [
    path("<uuid:qr_token>/", public_menu, name="public-menu"),
    path("<uuid:qr_token>/orders/", create_public_order, name="public-order-create"),
]
