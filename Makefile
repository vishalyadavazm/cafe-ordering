.PHONY: up down logs migrate revision seed fmt test fe-install fe-dev
up:        ; docker compose up --build
down:      ; docker compose down
logs:      ; docker compose logs -f backend
migrate:   ; docker compose run --rm backend alembic upgrade head
revision:  ; docker compose run --rm backend alembic revision --autogenerate -m "$(m)"
seed:      ; docker compose run --rm backend python scripts/seed.py
fmt:       ; docker compose run --rm backend ruff format app
test:      ; docker compose run --rm backend pytest -q
fe-install:; cd frontend && npm install
fe-dev:    ; cd frontend && npm run dev
