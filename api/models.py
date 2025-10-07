from pydantic import BaseModel, Field
from typing import List, Optional, Any
from datetime import datetime

class Post(BaseModel):
    id: str
    source: str
    title: str
    text: str
    hashtags: List[str] = []
    author: str | None = None
    lang: str | None = None
    date: str | datetime
    likes: int = 0
    views: int = 0
    url: str | None = None
    thumb: str | None = None

class SearchQuery(BaseModel):
    q: str = ""
    filter: str | None = None
    facets: List[str] = Field(default_factory=lambda: ["source","lang","hashtags"])
    sort: List[str] | None = None
    page: int = 1
    hitsPerPage: int = 20
    hybrid: dict | None = None
    attributesToHighlight: List[str] | None = ["title","text"]

class MeiliResponse(BaseModel):
    hits: list[Any]
    offset: int | None = None
    limit: int | None = None
    estimatedTotalHits: int | None = None
    facetDistribution: dict | None = None
