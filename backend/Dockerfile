FROM python:3.12-slim

WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .

# Rendre le script exécutable
RUN chmod +x start.sh

EXPOSE 8000
CMD ["./start.sh"]
