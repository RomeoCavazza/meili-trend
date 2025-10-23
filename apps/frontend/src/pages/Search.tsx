import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SearchBar } from '@/components/SearchBar';
import { PostCard } from '@/components/PostCard';
import { SkeletonGrid } from '@/components/SkeletonGrid';
import { EmptyState } from '@/components/EmptyState';
import { searchPosts } from '@/lib/api';
import { SearchParams } from '@insider/shared/types';
import { useDebounce } from '@/hooks/useDebounce';
import { useWatchlist } from '@/contexts/WatchlistContext';
import { toast } from 'sonner';

export default function Search() {
  const [params, setParams] = useState<SearchParams>({
    platform: 'instagram',
    sort: 'score_trend:desc',
    limit: 24,
  });
  const [shouldSearch, setShouldSearch] = useState(false);
  const debouncedParams = useDebounce(params, 300);
  const { addItem } = useWatchlist();

  const hasQuery = !!(params.q || params.hashtags);

  const { data, isLoading, error } = useQuery({
    queryKey: ['search', debouncedParams],
    queryFn: () => searchPosts(debouncedParams),
    enabled: shouldSearch && hasQuery,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message === 'RATE_LIMIT') {
        return failureCount < 3;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const handleParamsChange = (newParams: Partial<SearchParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  const handleSearch = () => {
    setShouldSearch(true);
  };

  const handleAddToWatch = (value: string, kind: 'hashtag' | 'user') => {
    addItem({ kind, value, created_at: new Date().toISOString() });
    toast.success(`${kind === 'hashtag' ? '#' : '@'}${value} ajouté à la veille`);
  };

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Recherche</h1>
          <p className="text-muted-foreground">
            Explorez les posts Instagram et identifiez les tendances émergentes.
          </p>
        </div>

        <SearchBar
          params={params}
          onParamsChange={handleParamsChange}
          onSearch={handleSearch}
        />

        <div className="mt-8">
          {error ? (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
              <p className="text-sm text-destructive">
                {error instanceof Error && error.message === 'RATE_LIMIT'
                  ? 'Limite de requêtes atteinte. Veuillez patienter quelques instants.'
                  : 'Une erreur est survenue. Veuillez réessayer.'}
              </p>
            </div>
          ) : isLoading ? (
            <SkeletonGrid />
          ) : data?.hits && data.hits.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  {data.hits.length} résultat{data.hits.length > 1 ? 's' : ''}
                  {data.processing_time_ms && ` · ${data.processing_time_ms}ms`}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.hits.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onAddToWatch={() =>
                      handleAddToWatch(post.username || post.id, 'user')
                    }
                  />
                ))}
              </div>
            </>
          ) : shouldSearch ? (
            <EmptyState />
          ) : (
            <EmptyState
              title="Commencez une recherche"
              description="Rechercher posts, #hashtags, @utilisateurs, niches…"
            />
          )}
        </div>
      </main>
  );
}
