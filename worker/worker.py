import os
import sys
import time
import json
import httpx
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

POLL_INTERVAL = int(os.getenv("POLL_INTERVAL_SECONDS", "600"))
MAX_DOCS_PER_RUN = int(os.getenv("MAX_DOCS_PER_RUN", "500"))
API_URL = "http://api:8000"
STATE_FILE = Path(".state")

def load_state():
    if STATE_FILE.exists():
        return int(STATE_FILE.read_text().strip())
    return int(time.time()) - 3600

def save_state(timestamp):
    STATE_FILE.write_text(str(timestamp))

def get_posts():
    posts = []
    
    try:
        from connectors.instagram_graph import get_instagram_posts
        posts.extend(get_instagram_posts(load_state()))
    except ImportError:
        pass
    
    try:
        from connectors.tiktok_api import get_tiktok_posts
        posts.extend(get_tiktok_posts(load_state()))
    except ImportError:
        pass
    
    return posts[:MAX_DOCS_PER_RUN]

def send_posts(posts):
    if not posts:
        return
    
    with httpx.Client() as client:
        for i in range(0, len(posts), 500):
            batch = posts[i:i+500]
            r = client.post(f"{API_URL}/posts/bulk", json=batch)
            r.raise_for_status()
            print(f"Sent batch of {len(batch)} posts")

def run_once():
    print("Starting worker run...")
    posts = get_posts()
    print(f"Found {len(posts)} posts")
    
    if posts:
        send_posts(posts)
        save_state(int(time.time()))
        print("Worker run completed")
    else:
        print("No new posts found")

def run_loop():
    print(f"Starting worker loop (interval: {POLL_INTERVAL}s)")
    while True:
        try:
            run_once()
            time.sleep(POLL_INTERVAL)
        except KeyboardInterrupt:
            print("Worker stopped")
            break
        except Exception as e:
            print(f"Error: {e}")
            time.sleep(60)

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--loop":
        run_loop()
    else:
        run_once()
