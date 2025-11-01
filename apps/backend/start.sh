#!/bin/bash
set -e

echo "🚀 Démarrage du serveur..."
echo "Note: Les tables seront créées automatiquement au démarrage de l'app"

# Railway utilise le port fourni par la variable d'environnement PORT
PORT=${PORT:-8000}

# Gunicorn avec Uvicorn worker pour FastAPI
# Note: Les flags --forwarded-allow-ips et --proxy-headers sont des flags uvicorn,
# mais gunicorn ne les transmet pas directement. On doit utiliser une variable d'environnement
# ou passer par uvicorn directement. Pour Railway, on utilise gunicorn qui fonctionne mieux.
exec gunicorn app:app \
  -k uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:${PORT} \
  --workers 1 \
  --timeout 120 \
  --access-logfile - \
  --error-logfile -
