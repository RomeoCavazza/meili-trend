import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWatchlist } from '@/contexts/WatchlistContext';
import { Eye, Trash2, FileText, Hash, User, Tag, Search, TrendingUp } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';

export default function Watch() {
  const { items, removeItem } = useWatchlist();
  const [activeTab, setActiveTab] = useState('daily');
  const [showDemo, setShowDemo] = useState(false);

  // Demo items pour montrer le rendu
  const demoItems = [
    { kind: 'hashtag' as const, value: 'fashion', created_at: new Date().toISOString() },
    { kind: 'user' as const, value: 'makeupro', created_at: new Date().toISOString() },
  ];

  const displayItems = showDemo ? [...items, ...demoItems] : items;

  const getIcon = (kind: string) => {
    switch (kind) {
      case 'hashtag':
        return Hash;
      case 'user':
        return User;
      default:
        return Tag;
    }
  };

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Ma veille</h1>
          <p className="text-muted-foreground">
            Suivez vos hashtags, créateurs et niches favoris.
          </p>
        </div>

        {items.length === 0 && !showDemo ? (
          <div className="space-y-6">
            <Card className="p-8 text-center border-dashed">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun élément surveillé</h3>
              <p className="text-muted-foreground mb-4">
                Ajoutez un #hashtag, un @compte ou une niche depuis la recherche.
              </p>
              <div className="flex gap-2 justify-center">
                <Button asChild className="gap-2">
                  <Link to="/search">
                    <Search className="h-4 w-4" />
                    Aller à la recherche
                  </Link>
                </Button>
                <Button variant="outline" onClick={() => setShowDemo(!showDemo)}>
                  {showDemo ? 'Masquer la démo' : 'Voir la démo'}
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Demo toggle */}
            {items.length > 0 && (
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDemo(!showDemo)}
                >
                  {showDemo ? 'Masquer la démo' : 'Afficher avec démo'}
                </Button>
              </div>
            )}

            {/* Watchlist */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Éléments surveillés ({displayItems.length})
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayItems.map((item, i) => {
                  const Icon = getIcon(item.kind);
                  const isDemo = i >= items.length;
                  return (
                    <Card key={i} className="p-4 relative">
                      {isDemo && (
                        <Badge className="absolute top-2 right-2 text-xs" variant="secondary">
                          Démo
                        </Badge>
                      )}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-primary" />
                          <span className="font-semibold">
                            {item.kind === 'hashtag' && '#'}
                            {item.kind === 'user' && '@'}
                            {item.value}
                          </span>
                        </div>
                        {!isDemo && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeItem(i)}
                            aria-label="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.kind}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-2">
                        Ajouté le{' '}
                        {format(new Date(item.created_at), 'dd MMM yyyy', {
                          locale: fr,
                        })}
                      </p>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* Analytics */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Analyses & Tendances
              </h2>
              <Card className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="daily">Jour</TabsTrigger>
                    <TabsTrigger value="weekly">Semaine</TabsTrigger>
                    <TabsTrigger value="monthly">Mois</TabsTrigger>
                    <TabsTrigger value="yearly">Année</TabsTrigger>
                  </TabsList>
                  {['daily', 'weekly', 'monthly', 'yearly'].map((period) => (
                    <TabsContent key={period} value={period} className="mt-6">
                      <div className="aspect-video rounded-lg border border-dashed border-border bg-muted/20 flex flex-col items-center justify-center gap-3">
                        <TrendingUp className="h-12 w-12 text-muted-foreground" />
                        <div className="text-center px-4">
                          <p className="text-muted-foreground font-medium">
                            Graphiques {period === 'daily' ? 'quotidiens' : period === 'weekly' ? 'hebdomadaires' : period === 'monthly' ? 'mensuels' : 'annuels'}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Évolution des métriques • Comparaison 7j vs 7j-1 • Détection de pics
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </Card>
            </section>

            {/* Slides generation */}
            <section>
              <Card className="p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">Génération de slides</h3>
                      <Badge variant="secondary" className="text-xs">Bientôt</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Créez automatiquement des présentations professionnelles à partir de vos données de veille. Export PowerPoint, Google Slides ou PDF.
                    </p>
                    <Button disabled title="Fonctionnalité en développement">
                      <FileText className="h-4 w-4 mr-2" />
                      Générer des slides
                    </Button>
                  </div>
                </div>
              </Card>
            </section>
          </div>
        )}
      </main>
  );
}
