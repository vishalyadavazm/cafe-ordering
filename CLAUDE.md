# CLAUDE.md

> Read this first. It is the working context for the whole project so we don't
> re-explain things each session. Full detail lives in `docs/PROJECT_PLAN.md`.

## What this is
**Brew Cafe — QR Table Ordering.** A multi-tenant SaaS: customers scan a table
QR (no app, no login), order from their phone, pay, and track live; cafe staff run
orders from a dashboard. One codebase serves many cafes, separated by `cafe_id`.

## Stack (decided — don't swap without a reason)
- **Backend:** Django 5 + Django REST Framework, PostgreSQL 16, simplejwt (JWT auth),
  drf-spectacular (API docs). Real-time starts as **polling**, upgrades to **Django
  Channels + Redis** at step 10.
- **Frontend:** React + TypeScript + Vite + Tailwind + shadcn/ui + React Query + React Router (PWA).
- **Infra:** Docker Compose + Nginx + Cloudflare. **Payments:** Razorpay (UPI-QR + cash fallback for MVP).

## Team
Two developers working in parallel:
- **Backend dev** → everything in `backend/`.
- **Frontend dev** → everything in `frontend/` (unchanged by the Django switch — it only
  speaks JSON per `docs/PROJECT_PLAN.md` › API contract).
They only touch the same thing at the **sync points** in the plan.

## Commands
```bash
# whole stack
cp .env.example .env && docker compose up --build
# backend (inside container or venv)
python manage.py makemigrations && python manage.py migrate
python manage.py createsuperuser
python manage.py test
# frontend
cd frontend && npm install && npm run dev     # VITE_USE_MOCKS=true to use MSW mocks
```
- API: `http://localhost:8000/api/v1/` · Docs: `/api/docs/` · Admin: `/admin/` · Health: `/api/v1/health/`

## Repo map
```
backend/
  config/            settings, urls, api_urls, wsgi, asgi (Channels-ready)
  apps/
    common/          base models (UUID/Timestamp/Tenant), enums, TenantScopedViewSet, permissions
    cafes/           Cafe (tenant root)              accounts/  StaffUser (custom user) + JWT auth
    tables/          DiningTable + QR                menu/      Category, MenuItem, AddOn
    orders/          Order, OrderItem + public API   payments/  Payment + Razorpay
    reports/         analytics                       realtime/  Channels consumers (step 10)
frontend/
  src/features/{customer,staff,auth}/pages   src/lib/{api,queryClient,ws}   src/routes  src/store
docs/PROJECT_PLAN.md                         the full plan + status checklist
```

## Non-negotiable conventions (apply these without being asked)
1. **Tenant scoping is mandatory.** Every staff query filters by the caller's cafe.
   Use `TenantScopedViewSet` (in `apps/common/views.py`) — it filters `get_queryset`
   by `request.user.cafe` and stamps `cafe` on create. New tenant models inherit
   `TenantModel` (in `apps/common/models.py`). Never return or accept another cafe's data.
2. **Never trust client-sent money.** Compute `subtotal/tax/total` server-side from DB
   prices when creating an order. The client sends item ids + quantities + chosen add-ons only.
3. **Snapshot order line items.** Copy name + unit price into `OrderItem` at creation so
   past orders stay correct after the menu changes.
4. **Per-cafe order numbers under a lock.** Generate `order_number` by
   `select_for_update()` on the `Cafe` row and bumping `order_seq` inside the transaction.
5. **Statuses are `TextChoices`** in `apps/common/enums.py` (stored as short strings, no PG
   enum types). Order lifecycle: `NEW → ACCEPTED → PREPARING → READY → SERVED` (+ `CANCELLED`).
6. **Migrations via Django.** After model changes run `makemigrations`; commit the migration files.
7. **JWT carries `cafe_id` + `role`** (see `accounts/serializers.py::CafeTokenObtainPairSerializer`).
   The frontend reads these; permissions use `role`.
8. **Customers never log in.** A table's `qr_token` (a UUID, not the row id) is the public
   entry; an order's `customer_session` token lets a phone track its own orders.
9. **Keep the frontend/backend contract in sync** with `docs/PROJECT_PLAN.md`. If you change
   a response shape, update the plan and the frontend `src/types/` in the same change.
10. **Style:** backend `ruff`; frontend TypeScript strict + shadcn `cn()` helper. Small, focused commits.

## How to add things
- **New staff endpoint:** model (inherit `TenantModel`) → `serializer` (`exclude = ("cafe",)`)
  → viewset (subclass `TenantScopedViewSet`) → register in `config/api_urls.py`.
- **New public/customer endpoint:** put it in `apps/orders/public_views.py` + `public_urls.py`,
  permission `AllowAny`, resolve the cafe from `qr_token` / `customer_session`.
- **Business logic** goes in the app's `services.py`, not the view (e.g. `orders/services.py`).

## Current status (keep this honest; details + checklist in the plan)
- **Done:** project + Docker (1); DB models + migrations (2); JWT auth login/refresh/me (3);
  tenant-scoped CRUD for tables, categories, menu-items, add-ons (parts of 5–6); Django admin back-office.
- **Next:** order create (`orders/services.py`) + public menu endpoint (7–8), then Razorpay (9),
  then WebSocket/Channels (10), then the React dashboards.

## When unsure
Ask, or check `docs/PROJECT_PLAN.md`. Prefer the smallest change that fits the conventions
above. Don't introduce new libraries or patterns without noting why in the PR/commit.
