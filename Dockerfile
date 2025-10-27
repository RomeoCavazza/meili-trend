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
COPY apps/backend/requirements.txt ./requirements.txt
RUN pip install -r requirements.txt

# code backend
COPY apps/backend/ ./

# Créer start.sh directement dans le conteneur
RUN echo '#!/bin/bash' > start.sh && \
    echo 'set -e' >> start.sh && \
    echo '' >> start.sh && \
    echo 'echo "🔄 Exécution des migrations Alembic..."' >> start.sh && \
    echo 'cd /app' >> start.sh && \
    echo 'alembic upgrade head' >> start.sh && \
    echo '' >> start.sh && \
    echo 'echo "🚀 Démarrage du serveur..."' >> start.sh && \
    echo 'exec gunicorn app:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:${PORT:-8000}' >> start.sh && \
    chmod +x start.sh

# ----- runtime -----
# Railway expects port from $PORT environment variable
EXPOSE $PORT


CMD ["./start.sh"]
