import csv, re, unicodedata, json, sys
from pathlib import Path

def clean_text(s: str) -> str:
    s = re.sub(r"<[^>]+>", " ", s)                 # HTML
    s = re.sub(r"http[s]?://\S+", " ", s)          # URLs
    s = unicodedata.normalize("NFKD", s)
    s = re.sub(r"[\d\p{P}]+", " ", s)              # ponctuation+chiffres
    s = s.lower()
    s = re.sub(r"\s+", " ", s).strip()
    return s

def csv_to_json(csv_path: str, out_path: str):
    rows = []
    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            text = clean_text(f"{r.get('title','')} {r.get('text','')}")
            if len(text) < 50:  # filtrage simple
                continue
            rows.append({
                "id": r.get("id"),
                "source": r.get("source","unknown"),
                "title": r.get("title",""),
                "text": text,
                "hashtags": (r.get("hashtags","") or "").split(),
                "author": r.get("author"),
                "lang": r.get("lang"),
                "date": r.get("date"),
                "likes": int(r.get("likes",0)),
                "views": int(r.get("views",0)),
                "url": r.get("url"),
                "thumb": r.get("thumb")
            })
    Path(out_path).write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {len(rows)} docs -> {out_path}")

if __name__ == "__main__":
    # Exemple: python pipeline_cleaner.py raw.csv data/seed_posts.json
    csv_to_json(sys.argv[1], sys.argv[2])

