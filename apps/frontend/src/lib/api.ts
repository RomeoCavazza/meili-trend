// src/lib/api.ts - API client pour Lovable
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export interface SearchParams {
  q?: string;
  hashtags?: string;
  platform?: 'instagram' | 'tiktok';
  date_from?: string;
  date_to?: string;
  sort?: 'score_trend:desc' | 'posted_at:desc' | 'like_count:desc';
  limit?: number;
  cursor?: string | null;
}

export interface PostHit {
  id: string;
  platform: string;
  username?: string;
  caption?: string;
  hashtags?: string[];
  media_type?: string;
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

export async function searchPosts(params: SearchParams): Promise<SearchResponse> {
  const searchParams = new URLSearchParams();
  
  // Filter out empty/null values
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value != null) {
      searchParams.set(key, String(value));
    }
  });

  const url = `${API_BASE}/api/v1/posts/search?${searchParams.toString()}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
    }
  });
  
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('RATE_LIMIT');
    }
    throw new Error(`HTTP_${response.status}`);
  }
  
  return response.json();
}

export async function searchHashtags(q: string, platform: string = 'instagram'): Promise<any[]> {
  const response = await fetch(`${API_BASE}/v1/search/hashtags?q=${q}&platform=${platform}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP_${response.status}`);
  }
  
  return response.json();
}

export async function checkHealth(): Promise<{ status: string }> {
  const response = await fetch(`${API_BASE}/healthz`);
  return response.json();
}

// Nouvelles fonctions d'authentification
export async function login(email: string, password: string) {
  const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  return response.json();
}

export async function register(email: string, password: string, name?: string) {
  const response = await fetch(`${API_BASE}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name })
  });
  
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  
  return response.json();
}

export async function getMe(token: string) {
  const response = await fetch(`${API_BASE}/api/v1/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!response.ok) {
    throw new Error('Failed to get user info');
  }
  
  return response.json();
}
