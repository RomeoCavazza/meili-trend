# jobs/jobs_endpoints.py
# Endpoints pour déclencher les jobs de synchronisation TikTok

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from db.base import get_db
from db.models import User
from auth_unified.auth_endpoints import get_current_user
from jobs.tiktok_sync_job import TikTokSyncJob, run_sync_job
import asyncio

jobs_router = APIRouter(prefix="/api/v1/jobs", tags=["jobs"])

class SyncHashtagsRequest(BaseModel):
    hashtags: List[str]
    trending: bool = False

@jobs_router.post("/sync/tiktok")
async def sync_tiktok_hashtags(
    request: SyncHashtagsRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Déclenche une synchronisation TikTok pour des hashtags spécifiques"""
    if current_user.role not in ["admin", "analyst"]:
        raise HTTPException(
            status_code=403,
            detail="Vous devez être admin ou analyst pour déclencher des synchronisations"
        )
    
    # Exécuter en arrière-plan
    background_tasks.add_task(
        run_sync_job,
        hashtags=request.hashtags if not request.trending else None,
        trending=request.trending
    )
    
    return {
        "message": "Synchronisation TikTok démarrée en arrière-plan",
        "hashtags": request.hashtags if not request.trending else "trending",
        "status": "processing"
    }

@jobs_router.post("/sync/tiktok/trending")
async def sync_tiktok_trending(
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
):
    """Déclenche une synchronisation des hashtags tendance TikTok"""
    if current_user.role not in ["admin", "analyst"]:
        raise HTTPException(
            status_code=403,
            detail="Vous devez être admin ou analyst pour déclencher des synchronisations"
        )
    
    background_tasks.add_task(run_sync_job, trending=True)
    
    return {
        "message": "Synchronisation des hashtags tendance TikTok démarrée",
        "status": "processing"
    }

