import os
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
application = get_asgi_application()

# ---- Step 10 (real-time): swap to Channels ProtocolTypeRouter ----
# from channels.routing import ProtocolTypeRouter, URLRouter
# from channels.auth import AuthMiddlewareStack
# from apps.realtime.routing import websocket_urlpatterns
# application = ProtocolTypeRouter({
#     "http": application,
#     "websocket": AuthMiddlewareStack(URLRouter(websocket_urlpatterns)),
# })
