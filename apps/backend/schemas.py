from pydantic import BaseModel, Field
from typing import List, Any, Optional, Literal
from datetime import datetime, timezone
import math
import re

def extract_hashtags(caption: Optional[str]) -> List[str]:
    return list({m.group(1).lower() for m in re.finditer(r"#(\w+)", caption or "")})

def compute_score(likes: int, comments: int, posted_at: datetime) -> float:
    if posted_at.tzinfo is None:
        posted_at = posted_at.replace(tzinfo=timezone.utc)
    hours = (datetime.now(timezone.utc) - posted_at).total_seconds() / 3600
    decay = math.exp(-hours / 24) * 10
    return 0.5 * math.sqrt(max(likes, 0)) + 0.3 * math.sqrt(max(comments, 0)) * 2 + 0.2 * decay

class PostModel(BaseModel):
    id: str
    platform: Literal["instagram"] = "instagram"
    username: Optional[str] = None
    caption: Optional[str] = None
    hashtags: List[str] = Field(default_factory=list)
    media_type: Optional[str] = None
    media_url: Optional[str] = None
    permalink: Optional[str] = None
    posted_at: datetime
    like_count: int = 0
    comments_count: int = 0
    score_trend: float = 0.0
    
    @classmethod
    def from_ig_media(cls, media: dict) -> "PostModel":
        timestamp_str = media.get("timestamp", "")
        try:
            posted_at = datetime.fromisoformat(timestamp_str.replace("Z", "+00:00"))
        except:
            posted_at = datetime.now(timezone.utc)
        
        caption = media.get("caption", "")
        hashtags = extract_hashtags(caption)
        media_url = media.get("media_url") or media.get("thumbnail_url")
        like_count = int(media.get("like_count", 0))
        comments_count = int(media.get("comments_count", 0))
        score = compute_score(like_count, comments_count, posted_at)
        
        return cls(
            id=f"ig_{media['id']}",
            username=media.get("username"),
            caption=caption,
            hashtags=hashtags,
            media_type=media.get("media_type"),
            media_url=media_url,
            permalink=media.get("permalink"),
            posted_at=posted_at,
            like_count=like_count,
            comments_count=comments_count,
            score_trend=score
        )

