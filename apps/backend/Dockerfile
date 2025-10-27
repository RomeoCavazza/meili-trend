FROM python:3.11-slim
# Railway cache invalidation - force reload
# Updated: 2025-10-23 00:25 - FIXED FOR BACKEND CONTEXT

WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

# deps system minimales (certifs, build, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl && \
    rm -rf /var/lib/apt/lists/*

# dépendances Python
COPY requirements.txt ./requirements.txt
RUN pip install -r requirements.txt

# code backend
COPY . ./

# ----- runtime -----
# Railway expects port from $PORT environment variable
EXPOSE $PORT

# Script de démarrage avec migrations
COPY <<EOF /app/start.sh
#!/bin/bash
set -e

echo "🔄 Exécution des migrations Alembic..."
alembic upgrade head

echo "🚀 Démarrage du serveur..."
exec gunicorn app:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:\$PORT
EOF

RUN chmod +x /app/start.sh
CMD ["/app/start.sh"]
