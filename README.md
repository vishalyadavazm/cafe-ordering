# Brew Cafe — QR Table Ordering (Monorepo)

Multi-tenant cafe ordering system. Customers scan a table QR (no app, no login),
order from their phone, pay, and track live; staff run orders from a dashboard.

## Stack
- **Frontend:** React + TypeScript + Vite + Tailwind + shadcn/ui + React Query + React Router (PWA)
- **Backend:** FastAPI + Pydantic + SQLAlchemy 2.0 (async) + Alembic + WebSockets + JWT
- **DB:** PostgreSQL 16 · **Infra:** Docker Compose + Nginx + Cloudflare · **Payments:** Razorpay
- **Later:** Redis, Celery/workers, WhatsApp notifications

## Repo layout
```
cafe-ordering/
├── backend/     FastAPI service  (owner: BACKEND dev)
├── frontend/    React PWA + staff dashboard  (owner: FRONTEND dev)
├── docs/        API contract, architecture, getting-started
└── docker-compose.yml   brings up db + backend + web
```

## Quick start
```bash
cp .env.example .env          # then edit secrets
docker compose up --build     # db + backend + web
```
- App: http://localhost · API docs: http://localhost:8000/docs · Health: http://localhost:8000/api/v1/health

See **docs/GETTING_STARTED.md** for full setup, and **docs/API_CONTRACT.md** for the shared
request/response shapes (agree on these on Day 1 — frontend builds against MSW mocks until each
endpoint is real).

## Who works where
- **Backend dev** → everything under `backend/`. Build order: auth → cafes → tables/QR → menu → public menu → orders → Razorpay → WebSocket → dashboards/reports.
- **Frontend dev** → everything under `frontend/`. Build order: shell/mocks → auth → customer flow → cart/pay/track → staff dashboards → reports/PWA.
The two only touch the same thing at the **sync points** in the Notion board.
