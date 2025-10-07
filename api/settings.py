import os
from dotenv import load_dotenv

load_dotenv()

MEILI_HOST = os.getenv("MEILI_HOST", "http://meilisearch:7700")
MEILI_MASTER_KEY = os.getenv("MEILI_MASTER_KEY", "master_key")
MEILI_INDEX = os.getenv("MEILI_INDEX", "posts")
API_PORT = int(os.getenv("API_PORT", "8000"))
