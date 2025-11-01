#!/bin/bash
set -e

echo "🚀 Démarrage du serveur..."
echo "Note: Les tables seront créées automatiquement au démarrage de l'app"
# --forwarded-allow-ips='*' : Permettre tous les proxies (Railway, Vercel, etc.)
# --proxy-headers : Activer la reconnaissance des headers X-Forwarded-*
exec gunicorn app:app -k uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:${PORT:-8000} \
  --forwarded-allow-ips='*' \
  --proxy-headers
