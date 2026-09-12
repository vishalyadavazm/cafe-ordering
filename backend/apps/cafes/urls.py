from django.urls import path

from apps.cafes.views import MyCafeViewSet

me = MyCafeViewSet.as_view({"get": "retrieve", "patch": "partial_update"})
urlpatterns = [path("me/", me, name="cafe-me")]
