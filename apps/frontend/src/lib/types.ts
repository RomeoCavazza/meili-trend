// Types locaux pour éviter les problèmes de résolution de modules
// Ce fichier contient les types nécessaires pour l'application frontend

export type SortKey = 'score_trend:desc' | 'posted_at:desc' | 'like_count:desc';
export type Platform = 'instagram' | 'tiktok';

export interface SearchParams {
  q?: string;
  hashtags?: string;
  platform?: Platform;
  date_from?: string;
  date_to?: string;
  sort?: SortKey;
  limit?: number;
  cursor?: string | null;
}

export interface PostHit {
  id: string;
  platform: Platform;
  username?: string;
  caption?: string;
  hashtags?: string[];
  media_type?: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  posted_at: string;
  like_count?: number;
  comment_count?: number;
  view_count?: number;
  score_trend?: number;
}

export interface SearchResponse {
  hits: PostHit[];
  limit: number;
  cursor?: string | null;
  processing_time_ms?: number;
  estimatedTotalHits?: number;
  query?: string;
}

export interface WatchItem {
  kind: 'hashtag' | 'user' | 'niche';
  value: string;
  created_at: string;
}

export interface TrendData {
  label: string;
  value: number;
}

export interface HealthResponse {
  status: string;
  message?: string;
}
