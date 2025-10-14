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

# Démarrage : utiliser sh -c pour que ${PORT} soit substitué
# Fallback en local sur 8000 si PORT n'est pas défini.
# Temporairement utiliser app_simple pour debug
CMD ["sh", "-c", "uvicorn app_simple:app --host 0.0.0.0 --port ${PORT:-8000}"]
