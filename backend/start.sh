#!/bin/bash
set -e

# Utiliser le port Railway ou 8000 par défaut
PORT=${PORT:-8000}

echo "Starting Insidr API on port $PORT..."

# Démarrer uvicorn
exec uvicorn app:app --host 0.0.0.0 --port $PORT
