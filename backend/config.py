import os
from dotenv import load_dotenv

load_dotenv()

MEILI_HOST = os.getenv("MEILI_HOST", "http://meilisearch:7700")
MEILI_MASTER_KEY = os.getenv("MEILI_MASTER_KEY", "masterKey")
MEILI_INDEX = os.getenv("MEILI_INDEX", "posts")
IG_ACCESS_TOKEN = os.getenv("IG_ACCESS_TOKEN")
IG_USER_ID = os.getenv("IG_USER_ID")
API_PORT = int(os.getenv("API_PORT", "8000"))

def validate_settings():
    missing = []
    if not IG_ACCESS_TOKEN:
        missing.append("IG_ACCESS_TOKEN")
    if not IG_USER_ID:
        missing.append("IG_USER_ID")
    if missing:
        raise RuntimeError(f"Variables manquantes: {', '.join(missing)}")

validate_settings()
