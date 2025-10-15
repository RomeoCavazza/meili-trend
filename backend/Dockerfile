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
# Use a *shell-form* CMD so $PORT is expanded by the shell
CMD bash -lc 'exec gunicorn app:app \
  -k uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:$PORT \
  --workers 2 --threads 8 --timeout 120 --keep-alive 75 \
  --access-logfile - --error-logfile -'
