from django.urls import path

from apps.orders.public_views import create_public_order, public_menu, track_public_order

urlpatterns = [
    path("orders/<str:customer_session>/", track_public_order, name="public-order-track"),
    path("<uuid:qr_token>/", public_menu, name="public-menu"),
    path("<uuid:qr_token>/orders/", create_public_order, name="public-order-create"),
]
