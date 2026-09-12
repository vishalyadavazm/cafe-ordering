# Django backend — how to drop this into your repo

This package replaces the **backend** with a Django + DRF version. The React
**frontend is unchanged** — it talks to the same JSON API.

Replace these in your existing repo:
- `backend/`            -> use the `backend/` in this package (Django project)
- `docker-compose.yml`  -> use the one here (backend service now runs Django/Gunicorn)
- `.env.example`        -> use the one here (Django env vars)

Keep as-is: `frontend/`, `docs/`, `.github/`, `Makefile` (still fine).

## Run
```bash
cp .env.example .env
docker compose up --build
```
- API:        http://localhost:8000/api/v1/
- API docs:   http://localhost:8000/api/docs/     (Swagger, via drf-spectacular)
- Admin:      http://localhost:8000/admin/         (your free back-office)
- Health:     http://localhost:8000/api/v1/health/

Create an admin user:
```bash
docker compose run --rm backend python manage.py createsuperuser
```

## Why Django here
You know Django well, so you'll move faster and lean on the admin. Real-time starts
as **polling** (no extra infra); add **Django Channels + Redis** at step 10 when you
want true WebSocket push — that's exactly where Redis was already planned.
