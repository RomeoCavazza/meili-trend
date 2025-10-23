import os
from dotenv import load_dotenv

load_dotenv()

# Configuration Instagram
IG_ACCESS_TOKEN = os.getenv("IG_ACCESS_TOKEN")
IG_USER_ID = os.getenv("IG_USER_ID")
WEBHOOK_VERIFY_TOKEN = os.getenv("WEBHOOK_VERIFY_TOKEN") or os.getenv("META_VERIFY_TOKEN") or "change-me-webhook-token"

# Configuration OAuth Instagram
IG_APP_ID = os.getenv("IG_APP_ID")
IG_APP_SECRET = os.getenv("IG_APP_SECRET")
IG_REDIRECT_URI = os.getenv("IG_REDIRECT_URI", "https://www.insidr.dev/auth/callback")
OAUTH_STATE_SECRET = os.getenv("OAUTH_STATE_SECRET", "change-me")

# Configuration Base de Données PostgreSQL
DATABASE_URL = "postgresql+psycopg2://postgres:Gn10bryg@shinkansen.proxy.rlwy.net:26230/railway"