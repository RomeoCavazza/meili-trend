def fetch_since(source_env: dict, since_ts: int) -> list[dict]:
    return []

def normalize(raw: dict) -> dict:
    return {
        "id": raw.get("id", ""),
        "source": raw.get("source", "unknown"),
        "title": raw.get("title", ""),
        "text": raw.get("text", ""),
        "hashtags": raw.get("hashtags", []),
        "author": raw.get("author"),
        "lang": raw.get("lang"),
        "date": raw.get("date", ""),
        "likes": raw.get("likes", 0),
        "views": raw.get("views", 0),
        "url": raw.get("url"),
        "thumb": raw.get("thumb")
    }
