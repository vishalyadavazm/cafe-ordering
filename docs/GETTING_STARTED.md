# Getting started

## Prereqs
- Docker + Docker Compose (for the full stack)
- Node 20+ and Python 3.12+ (only if running a service outside Docker)

## Run the whole stack
```bash
cp .env.example .env
docker compose up --build
```
App at http://localhost, API docs at http://localhost:8000/docs.
The backend runs `alembic upgrade head` on start, so the schema is created automatically.

## Backend dev (outside Docker)
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt -r requirements-dev.txt
# point DATABASE_URL at a local/Docker postgres, then:
alembic upgrade head
uvicorn app.main:app --reload
```

## Frontend dev (outside Docker)
```bash
cd frontend
npm install
npm run dev        # Vite dev server on :5173, proxies /api and /ws to :8000
```
Set `VITE_USE_MOCKS=true` in `frontend/.env` to develop against MSW mocks before the API is ready.

## Add a migration after changing models
```bash
docker compose run --rm backend alembic revision --autogenerate -m "add X"
docker compose run --rm backend alembic upgrade head
```

## shadcn/ui components
```bash
cd frontend && npx shadcn@latest add button card input ...
```
Generated components land in `src/components/ui/`.
