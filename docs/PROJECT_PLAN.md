# Project Plan — Brew Cafe QR Table Ordering

The complete plan for the project. `CLAUDE.md` (repo root) is the short always-loaded
context; this file is the full reference. Keep the **Status checklist** at the bottom current.

---

## 1. Vision
A real-time restaurant ordering system (not an e-commerce site). A customer sits at a
table, scans its QR, and within a few taps has ordered and paid — no app install, no
account, no typing a table number. Staff see the order appear instantly and move it
through the kitchen. It is **multi-tenant**: one deployment serves many cafes.

## 2. User flows
**Customer:** scan QR → table auto-identified → browse menu → add items (+ add-ons) →
cart → pay (UPI / card / cash) → order confirmed → live tracking → "ready" → served.

**Staff:** new-order notification → accept → start preparation → mark ready → mark served.
Plus: menu management, table management, QR generation, order history, reports.

## 3. Core requirements (from the brief)
- No customer registration, password, app install, or manual table entry.
- Table number always visible to staff.
- Real-time status to **both** customer and staff.
- Customer app is **mobile-first**; staff dashboard is desktop/tablet.
- Realistic sample data; production-quality, consistent UI across both interfaces.

## 4. Tech stack & rationale
| Layer | Choice | Why |
|---|---|---|
| API | Django + DRF | Team knows Django well → faster, fewer surprises; admin + auth + ORM included |
| DB | PostgreSQL 16 | Relational, JSONB where needed, solid multi-tenant story |
| Auth | djangorestframework-simplejwt | JWT with custom `cafe_id`/`role` claims |
| Real-time | Polling → Django Channels + Redis | Ship fast with polling; add true push when Redis arrives (step 10) |
| Payments | Razorpay (+ UPI-QR/cash MVP) | Pay-as-you-go, UPI/cards; no online fee if UPI-QR fallback used |
| Frontend | React + TS + Vite + Tailwind + shadcn + React Query + Router | Modern, fast, matches the prototype; PWA for install-free customer app |
| Infra | Docker Compose + Nginx + Cloudflare | One small VPS runs everything; Cloudflare free SSL/CDN |

**Why Django over FastAPI here:** the team's Django fluency removes the biggest risk
(learning a new async stack under deadline). The only tradeoff is real-time, which is
deferred behind polling and then solved with Channels+Redis exactly where Redis was
already planned.

## 5. Architecture
```
Cloudflare ──► Nginx (web) ──► React static (served by Nginx)
                    │
                    ├─ /api/* ─► Django/DRF (backend) ─┬─► PostgreSQL (source of truth)
                    └─ /ws/*  ─►                        └─► Redis (later: Channels layer + jobs)
```
- The `web` container is the front Nginx: serves the built React app and proxies `/api` + `/ws`.
- Keep `GUNICORN_WORKERS` modest; when Channels is added, WebSocket fan-out uses the Redis channel layer.

## 6. Data model (all tenant tables carry `cafe_id`)
- **Cafe** (tenant root): name, slug, logo_url, address, phone, upi_vpa, gst_rate,
  currency, `order_seq` (per-cafe order counter), is_active.
- **StaffUser** (custom user, email login): cafe (nullable for superuser), email (unique),
  full_name, role `{OWNER,MANAGER,CHEF,WAITER,CASHIER}`, is_active, is_staff.
- **DiningTable**: cafe, number, label, `qr_token` (UUID, unique — goes in the QR URL),
  status `{AVAILABLE,OCCUPIED,ORDERING,PREPARING,READY}`, seats. Unique (cafe, number).
- **Category**: cafe, name, sort_order, is_active.
- **MenuItem**: cafe, category (SET_NULL), name, description, price, image_url, is_veg,
  is_available, sort_order.
- **AddOn**: cafe, menu_item (CASCADE), name, price, is_active.
- **Order**: cafe, table (SET_NULL), `order_number` (per-cafe), status
  `{NEW,ACCEPTED,PREPARING,READY,SERVED,CANCELLED}`, subtotal, tax, total,
  payment_status `{PENDING,PAID,FAILED,REFUNDED}`, payment_method, special_instructions,
  `customer_session` (phone tracking token), accepted_at/ready_at/served_at. Unique (cafe, order_number).
- **OrderItem**: order (CASCADE), menu_item (SET_NULL), `name_snapshot`, unit_price,
  quantity, line_total, addons (JSON). *(Snapshotted — history-safe.)*
- **Payment**: cafe, order (OneToOne), provider, razorpay_order_id/payment_id/signature,
  amount, status, method, notes (JSON).

## 7. Multi-tenancy rules
- Every tenant model inherits `TenantModel` (adds indexed `cafe` FK).
- Every staff query goes through `TenantScopedViewSet` → filtered by `request.user.cafe`,
  `cafe` stamped on create. A cafe can never read or write another cafe's rows.
- Public/customer endpoints resolve the cafe from `qr_token` (menu) or `customer_session`
  (tracking) — never from a client-supplied `cafe_id`.

## 8. API contract (v1, prefix `/api/v1`)
Auth: `Authorization: Bearer <jwt>` for staff routes; public routes need no auth.

**Auth** — `POST /auth/login` → `{access, refresh, staff}`; `POST /auth/refresh`; `GET /auth/me`.
**Cafe** — `GET/PATCH /cafes/me`.
**Staff** — `GET/POST/PATCH/DELETE /staff` *(step 4)*.
**Tables** — `GET/POST/PATCH/DELETE /tables`; `GET /tables/{id}/qr` (PNG); `GET /tables/qr.zip`.
**Menu** — `.../categories`, `.../menu-items`, `.../addons` (full CRUD, tenant-scoped).
**Public** — `GET /public/{qr_token}` → cafe+table+menu; `POST /public/{qr_token}/orders` →
create order → `{id, order_number, customer_session, total}`; `GET /public/orders/{id}` → tracking.
**Orders (staff)** — `GET /orders` (filters); `PATCH /orders/{id}/status`.
**Payments** — `POST /payments/razorpay/order`; `POST /payments/razorpay/verify`; `POST /payments/razorpay/webhook`.
**Reports** — `GET /reports/summary`; `GET /reports/revenue?range=`.
**WebSocket (step 10)** — `WS /ws/staff` (per-cafe board); `WS /ws/orders/{customer_session}` (tracking).

> If a shape changes, update this section **and** `frontend/src/types/` in the same commit.

## 9. Real-time strategy
1. **Polling (now):** tracking screen + kitchen board re-fetch every 3–5s. Zero infra.
2. **Channels + Redis (step 10):** enable `channels`, add the Redis channel layer, implement
   `apps/realtime/consumers.py` (StaffConsumer per cafe, OrderConsumer per session), broadcast
   on status changes. Switch `asgi.py` to the `ProtocolTypeRouter` (already stubbed).

## 10. Payments strategy
- **MVP:** show the cafe's UPI-QR (from `Cafe.upi_vpa`) + "cash at counter"; staff confirm
  payment. Zero integration, zero fee.
- **Online:** Razorpay create-order → checkout on the client → verify signature → webhook.
  Funds must reach each cafe (per-cafe Razorpay account, or Razorpay Route for a marketplace split).

## 11. Build order (17 steps) — goal · key files · owner · done-when
1. **Project + Docker** — compose (db/backend/web), Dockerfiles, Nginx. *BE.* ✅
2. **DB design** — models + migrations for all 9 tables. *BE.* ✅
3. **Auth** — JWT login/refresh/me, custom claims, `get_current_staff`/permissions. *BE.* ✅ (staff mgmt UI later)
4. **Cafe/owner mgmt** — owner signup, `/cafes/me`, staff CRUD, seed script. *BE.*
5. **Tables + QR** — table CRUD, `qr_token` URL, PNG render, "download all" zip. *BE.*
6. **Menu/category** — CRUD + availability toggle. *BE.* (CRUD ✅, polish pending)
7. **Public menu** — resolve table from `qr_token` → cafe+table+menu. *BE.*
8. **Cart + order create** — `orders/services.create_order` (lock, totals, snapshots). *BE.*
9. **Razorpay** — create-order, verify signature, webhook. *BE.*
10. **WebSocket** — Channels hub + broadcast on order events. *BE.*
11. **Order dashboard** — status transitions + stat endpoints. *BE + FE.*
12. **Kitchen** — live Kanban board (WS/poll), advance states. *FE.*
13. **Waiter** — serve flow + order detail. *FE.*
14. **Order tracking** — customer timeline + countdown (WS/poll). *FE.*
15. **Reports** — revenue/orders/AOV/top items endpoints + charts. *BE + FE.*
16. **Security + testing** — RBAC, rate-limit, webhook-sig, validation, pytest, responsive/PWA/a11y. *both.*
17. **Deploy** — VPS + Compose + Cloudflare + SSL + backups; pilot cafe onboarding. *both.*

**Frontend build order:** shell/mocks → auth → customer (welcome→menu→cart→pay→track) →
staff (dashboard→kanban→kitchen→waiter) → tables/QR → reports → PWA/responsive/a11y.

## 12. Two-person day-by-day (≈4 weeks, sync points marked ⇄)
- **Wk1 Foundation:** BE auth/cafe/menu · FE shell/customer(welcome→menu). ⇄ Day 5: login + menu E2E.
- **Wk2 Ordering:** BE public menu/order-create/Razorpay/WS · FE cart/pay/track. ⇄ Day 10: order→pay→track E2E.
- **Wk3 Dashboards:** BE transitions/stats/lists · FE kanban/kitchen/waiter. ⇄ Day 14: staff runs a full order live.
- **Wk4 Harden+Ship:** BE reports/security/deploy · FE reports/PWA/deploy. ⇄ Day 19: staging live → **launch**.

## 13. Deployment & cost
One small always-on VPS (Hetzner/DigitalOcean, ~₹350–600/mo) running the Compose stack;
Cloudflare (free) in front for SSL/CDN; domain ~₹70/mo; Razorpay pay-as-you-go (~2%/txn) or
free UPI-QR. Nightly `pg_dump` to Cloudflare R2 for backups. *(Prices are ballpark — confirm before committing.)*
**Prod:** remove the dev `ports:` on `db`/`backend` (only `web:80` public), set `DJANGO_DEBUG=false`,
real `DJANGO_SECRET_KEY`, `DJANGO_ALLOWED_HOSTS`, and scoped `BACKEND_CORS_ORIGINS`.

## 14. Status checklist
Update as you go (`[x]` done, `[~]` partial, `[ ]` pending).
- [x] 1 · Project setup + Docker
- [x] 2 · Database design (models + migrations)
- [x] 3 · JWT auth (login / refresh / me, custom claims)
- [ ] 4 · Cafe/owner management + staff CRUD + seed
- [~] 5 · Tables (CRUD ✅) + QR generation (pending)
- [~] 6 · Menu/category CRUD (✅) + polish
- [ ] 7 · Public menu by qr_token
- [ ] 8 · Cart + order create (service: lock/totals/snapshots)
- [ ] 9 · Razorpay
- [ ] 10 · WebSocket / Channels real-time
- [ ] 11 · Order dashboard (transitions + stats)
- [ ] 12 · Kitchen dashboard (Kanban)
- [ ] 13 · Waiter dashboard
- [ ] 14 · Customer order tracking
- [ ] 15 · Reports
- [ ] 16 · Security + testing
- [ ] 17 · Production deployment
