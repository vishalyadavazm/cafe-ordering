# Architecture

```
Cloudflare ──► Nginx (web) ──► React static (served by Nginx)
                    │
                    ├─ /api/* ─► FastAPI (backend) ─┬─► PostgreSQL (source of truth)
                    └─ /ws/*  ─►                    └─► Redis (later: cache + WS fan-out + jobs)
```

- **Multi-tenant, single DB, shared schema.** Every tenant row carries `cafe_id`; all queries scope by it.
- **No customer login.** A table QR encodes `qr_token`; orders carry a `customer_session` token so a phone can track its own orders.
- **Statuses are strings** validated by Python enums (no PG enum types) — adding a status stays a code change.
- **Order line items are snapshotted** (name + price) so history is stable after menu edits.
- **Real-time:** WebSocket hub broadcasts order events to staff boards and the customer tracking screen.
  Keep `UVICORN_WORKERS=1` until Redis is added (multi-worker WS fan-out needs shared pub/sub).
