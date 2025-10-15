import os
from dotenv import load_dotenv

load_dotenv()

MEILI_HOST = os.getenv("MEILI_HOST", "https://meili.insidr.dev")
MEILI_MASTER_KEY = os.getenv("MEILI_MASTER_KEY", "masterKey")
MEILI_INDEX = os.getenv("MEILI_INDEX", "posts")
IG_ACCESS_TOKEN = os.getenv("IG_ACCESS_TOKEN")
IG_USER_ID = os.getenv("IG_USER_ID")
WEBHOOK_VERIFY_TOKEN = os.getenv("WEBHOOK_VERIFY_TOKEN") or os.getenv("META_VERIFY_TOKEN") or "insidr_verify_2025"

if not IG_ACCESS_TOKEN or not IG_USER_ID:
    raise RuntimeError("IG_ACCESS_TOKEN et IG_USER_ID requis")
