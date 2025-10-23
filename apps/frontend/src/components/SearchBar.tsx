import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { SearchParams, SortKey } from '@insider/shared/types';

interface SearchBarProps {
  params: SearchParams;
  onParamsChange: (params: Partial<SearchParams>) => void;
  onSearch: () => void;
}

export function SearchBar({ params, onParamsChange, onSearch }: SearchBarProps) {
  const [localQuery, setLocalQuery] = useState(params.q || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onParamsChange({ q: localQuery });
    onSearch();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="Rechercher posts, #hashtags, @utilisateurs, niches…"
            className="pl-10"
            aria-label="Rechercher"
          />
        </div>
        <Button type="submit" className="gradient-primary" aria-label="Lancer la recherche">
          Rechercher
        </Button>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filtres</SheetTitle>
            </SheetHeader>
            <div className="space-y-6 mt-6">
              <div className="space-y-2">
                <Label>Plateforme</Label>
                <Select
                  value={params.platform || 'instagram'}
                  onValueChange={(v) => onParamsChange({ platform: v as 'instagram' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="tiktok" disabled>
                      TikTok (bientôt)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Hashtags</Label>
                <Input
                  value={params.hashtags || ''}
                  onChange={(e) => onParamsChange({ hashtags: e.target.value })}
                  placeholder="fashion, makeup"
                />
              </div>

              <div className="space-y-2">
                <Label>Tri</Label>
                <Select
                  value={params.sort || 'score_trend:desc'}
                  onValueChange={(v) => onParamsChange({ sort: v as SortKey })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="score_trend:desc">Tendance</SelectItem>
                    <SelectItem value="posted_at:desc">Plus récent</SelectItem>
                    <SelectItem value="like_count:desc">Plus de likes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </form>
    </div>
  );
}
