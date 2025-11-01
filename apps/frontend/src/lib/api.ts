// src/lib/api.ts - API client pour Lovable
// En dev : utiliser le proxy Vite (vite.config.ts) qui redirige vers Railway
// En prod : utiliser VITE_API_URL si défini, sinon Railway
// Force HTTPS pour éviter les erreurs mixed content
export const getApiBase = (): string => {
  // En développement, utiliser le proxy Vite
  if (import.meta.env.DEV) {
    return ''; // Proxy Vite redirige vers Railway
  }
  
  // En production, TOUJOURS utiliser le proxy Vercel (vercel.json)
  // Railway fait des redirections 307 au niveau infrastructure qu'on ne peut pas contrôler
  // Le proxy Vercel évite les problèmes CORS/mixed content car :
  // - Frontend → Vercel (même domaine HTTPS)
  // - Vercel → Railway (proxy interne, pas de problème CORS)
  // - Pas de redirection 307 visible par le navigateur
  
  // TOUJOURS retourner '' pour forcer l'utilisation du proxy Vercel en production
  return ''; // Proxy Vercel gère la redirection vers Railway
};

// Calculer API_BASE à chaque fois pour éviter les problèmes de cache
// Ne pas utiliser une constante, mais une fonction qui recalcule à chaque appel
export const getApiBaseUrl = () => getApiBase();

// Pour compatibilité avec le code existant
const API_BASE = getApiBase();

// Debug: log API_BASE pour vérifier la configuration
if (import.meta.env.DEV) {
  console.log('🔧 API_BASE (dev):', API_BASE || '(using Vite proxy to Railway)');
}

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

  const apiBase = getApiBase();
  const url = apiBase ? `${apiBase}/api/v1/posts/search?${searchParams.toString()}` : `/api/v1/posts/search?${searchParams.toString()}`;
  
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
  const apiBase = getApiBase();
  const url = apiBase ? `${apiBase}/v1/search/hashtags?q=${q}&platform=${platform}` : `/v1/search/hashtags?q=${q}&platform=${platform}`;
  const response = await fetch(url, {
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
  const apiBase = getApiBase();
  const url = apiBase ? `${apiBase}/healthz` : '/healthz';
  const response = await fetch(url);
  return response.json();
}

// Nouvelles fonctions d'authentification
export async function login(email: string, password: string) {
  const apiBase = getApiBase();
  const url = apiBase ? `${apiBase}/api/v1/auth/login` : '/api/v1/auth/login';
  const response = await fetch(url, {
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
  const apiBase = getApiBase();
  const url = apiBase ? `${apiBase}/api/v1/auth/register` : '/api/v1/auth/register';
  const response = await fetch(url, {
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
  const apiBase = getApiBase();
  const url = apiBase ? `${apiBase}/api/v1/auth/me` : '/api/v1/auth/me';
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!response.ok) {
    throw new Error('Failed to get user info');
  }
  
  return response.json();
}

// Projects API
export interface ProjectCreate {
  name: string;
  description?: string;
  platforms: string[];
  scope_type?: string;
  scope_query?: string;
  hashtag_names?: string[];
  creator_usernames?: string[];
}

export interface Project {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  status: string;
  platforms: string[];
  scope_type?: string;
  scope_query?: string;
  creators_count?: number;
  posts_count?: number;
  signals_count?: number;
  last_run_at?: string;
  last_signal_at?: string;
  created_at: string;
  updated_at: string;
  hashtags?: Array<{id: number; name: string; platform_id: number}>;
  creators?: Array<{id: number; creator_username: string; platform_id: number}>;
}

export async function createProject(project: ProjectCreate): Promise<Project> {
  const token = localStorage.getItem('token');
  
  // TOUJOURS utiliser le chemin relatif (proxy Vite en dev, proxy Vercel en prod)
  // Le proxy Vercel évite les redirections 307 de Railway
  const url = '/api/v1/projects';
  
  console.log('API: Creating project at:', url);
  console.log('API: Using proxy:', import.meta.env.DEV ? 'Vite' : 'Vercel');
  console.log('API: Request body:', JSON.stringify(project, null, 2));
  
  const response = await fetch(url, {
    mode: 'cors',
    credentials: 'same-origin', // Utiliser same-origin pour le proxy Vercel
    redirect: 'manual', // Ne pas suivre les redirections automatiquement (Vercel gère)
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`,
    },
    body: JSON.stringify(project),
  });
  
  console.log('API: Response status:', response.status);
  console.log('API: Response type:', response.type);
  console.log('API: Response redirected:', response.redirected);
  
  // Si redirection, suivre manuellement via le proxy
  if (response.type === 'opaqueredirect' || response.status === 0) {
    // Redirection détectée - réessayer avec la nouvelle URL si fournie
    const location = response.headers.get('Location');
    if (location && location.startsWith('/')) {
      // Redirection relative - suivre via le proxy
      return fetch(location, {
        mode: 'cors',
        credentials: 'same-origin',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`,
        },
        body: JSON.stringify(project),
      }).then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: Failed to create project`);
        }
        return res.json();
      });
    }
  }
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('API: Error response:', errorText);
    let error;
    try {
      error = JSON.parse(errorText);
    } catch {
      error = { detail: errorText || 'Failed to create project' };
    }
    throw new Error(error.detail || `HTTP ${response.status}: Failed to create project`);
  }
  
  const data = await response.json();
  console.log('API: Project created successfully:', data);
  return data;
}

export async function getProjects(): Promise<Project[]> {
  const token = localStorage.getItem('token');
  
  // TOUJOURS utiliser le chemin relatif (proxy Vite en dev, proxy Vercel en prod)
  // IMPORTANT: Ajouter slash final pour éviter redirection Railway
  const url = '/api/v1/projects/';
  
  const response = await fetch(url, {
    mode: 'cors',
    credentials: 'same-origin', // Utiliser same-origin pour le proxy Vercel
    headers: {
      'Authorization': `Bearer ${token || ''}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to get projects');
  }
  
  return response.json();
}