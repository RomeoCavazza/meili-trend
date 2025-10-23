import { SearchParams, SearchResponse } from '@insider/shared/types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://insidr-production.up.railway.app';

export async function searchPosts(params: SearchParams): Promise<SearchResponse> {
  const searchParams = new URLSearchParams();
  
  // Filter out empty/null values
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value != null) {
      searchParams.set(key, String(value));
    }
  });

  const url = `${API_BASE}/v1/search/posts?${searchParams.toString()}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('RATE_LIMIT');
    }
    throw new Error(`HTTP_${response.status}`);
  }
  
  return response.json();
}

export async function checkHealth(): Promise<{ status: string }> {
  const response = await fetch('https://insidr-production.up.railway.app/api/healthz');
  return response.json();
}
