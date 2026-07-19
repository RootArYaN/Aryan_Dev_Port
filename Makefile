.PHONY: setup dev-web dev-api test lint build seed admin secrets

setup:
	cd apps/web && npm install
	cd apps/api && uv sync --all-groups

secrets:
	cd apps/api && uv run python scripts/generate_secrets.py

dev-web:
	cd apps/web && npm run dev

dev-api:
	cd apps/api && uv run uvicorn app.main:app --reload

seed:
	cd apps/api && uv run python scripts/seed.py

admin:
	cd apps/api && uv run python scripts/create_admin.py

test:
	cd apps/api && uv run pytest

lint:
	cd apps/web && npm run lint
	cd apps/api && uv run ruff check .

build:
	cd apps/web && npm run build
	cd apps/api && uv build
