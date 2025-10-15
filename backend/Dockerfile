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

# ----- runtime -----
# Railway expects port 8000 (see Networking settings)
CMD bash -lc 'echo "Starting on port 8000" && exec gunicorn app:app \
  -k uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --workers 2 --threads 8 --timeout 120 --keep-alive 75 \
  --access-logfile - --error-logfile -'
