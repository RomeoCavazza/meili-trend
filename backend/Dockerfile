FROM python:3.11-slim

WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

# deps system minimales (certifs, build, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl && \
    rm -rf /var/lib/apt/lists/*

# dépendances Python
COPY backend/requirements.txt ./requirements.txt
RUN pip install -r requirements.txt

# code
COPY backend/ ./

# Démarrage : utiliser exactement le port Railway (pas de fallback)
# Railway doit fournir $PORT, sinon ça plante
CMD ["sh", "-c", "echo 'Starting uvicorn on port $PORT' && uvicorn app:app --host 0.0.0.0 --port $PORT"]
