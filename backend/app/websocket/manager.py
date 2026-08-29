"""In-memory connection hub (step 10). Tracks staff sockets per cafe and customer
sockets per customer_session, and broadcasts order events to both.

NOTE: in-memory only works with a single uvicorn worker. Multi-worker needs Redis
pub/sub (see docs/ARCHITECTURE.md) — that's the 'Later' Redis step.
"""
# TODO
