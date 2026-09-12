"""Step 10 — Django Channels consumers (enable `channels` in settings first).

class StaffConsumer(AsyncJsonWebsocketConsumer): group per cafe; receives order events.
class OrderConsumer(AsyncJsonWebsocketConsumer): group per customer_session.
Needs channels + channels-redis (Redis channel layer) for multi-worker fan-out.
"""
# TODO
