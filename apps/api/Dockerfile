FROM python:3.13-slim AS builder
WORKDIR /app
RUN pip install --no-cache-dir uv==0.10.0
COPY pyproject.toml ./
COPY app ./app
RUN uv sync --no-dev --no-editable

FROM python:3.13-slim
ENV PATH="/app/.venv/bin:$PATH" PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
COPY --from=builder /app/.venv /app/.venv
COPY app ./app
COPY scripts ./scripts
COPY alembic.ini ./
COPY alembic ./alembic
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers"]
