# API contract (v1)  —  agree on Day 1

Base prefix: `/api/v1`. Auth: `Authorization: Bearer <jwt>` for staff routes.
Public (customer) routes need no auth. Fill in exact fields as you build; keep this file the
single source of truth so frontend can mock (MSW) and backend can implement in parallel.

## Auth
- `POST /auth/login`            → { access_token, token_type, staff: {...} }
- `POST /auth/register`         (owner signup; step 4)

## Cafes / staff  (owner/manager)
- `GET/PATCH /cafes/me`
- `GET/POST/PATCH/DELETE /staff`

## Tables + QR
- `GET/POST/PATCH/DELETE /tables`
- `GET /tables/{id}/qr`         → PNG · `GET /tables/qr.zip` → all QRs

## Menu  (staff)
- `GET/POST/PATCH/DELETE /categories`
- `GET/POST/PATCH/DELETE /menu-items`  (+ availability toggle)

## Public (customer, no auth)
- `GET /public/{qr_token}`      → { cafe, table, categories, items }  (resolves table from QR)

## Orders
- `POST /public/{qr_token}/orders`   → creates order (returns { id, order_number, customer_session, total })
- `GET  /public/orders/{id}`         → order + status (customer tracking; also via WS)
- `GET  /orders` (staff, filters)    · `PATCH /orders/{id}/status` (accept→prep→ready→served)

## Payments (Razorpay)
- `POST /payments/razorpay/order`    → { razorpay_order_id, amount, key_id }
- `POST /payments/razorpay/verify`   (signature check) · `POST /payments/razorpay/webhook`

## Reports (staff)
- `GET /reports/summary` · `GET /reports/revenue?range=...`

## WebSocket
- `WS /ws/staff?token=...`           staff board live updates
- `WS /ws/orders/{customer_session}` customer tracking live updates
