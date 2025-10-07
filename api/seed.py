import json
from pathlib import Path
from meili import add_documents

def load_seed():
    p = Path("data/seed_posts.json")
    docs = json.loads(p.read_text(encoding="utf-8"))
    return add_documents(docs)
