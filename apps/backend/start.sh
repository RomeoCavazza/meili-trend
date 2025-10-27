#!/bin/bash
set -e

echo "🚀 Démarrage du serveur..."
echo "Note: Les tables seront créées automatiquement au démarrage de l'app"
exec gunicorn app:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:${PORT:-8000}
