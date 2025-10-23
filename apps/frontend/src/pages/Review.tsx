import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, CheckCircle2, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Review() {
  const [hashtag, setHashtag] = useState('');
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (hashtag) {
      setShowResults(true);
    }
  };

  return (
    <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 text-center">
        <Badge className="mb-4 bg-accent">Meta App Review</Badge>
        <h1 className="text-3xl font-bold mb-2">Démo d'intégration Instagram</h1>
        <p className="text-muted-foreground">
          Page de démonstration pour l'App Review Meta
        </p>
      </div>

      <div className="space-y-6">
        {/* OAuth Demo */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Instagram className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Connexion Instagram</h2>
            <Badge variant="outline" className="ml-auto gap-1">
              <CheckCircle2 className="h-3 w-3" />
              OAuth 2.0
            </Badge>
          </div>
          <p className="text-muted-foreground mb-4">
            Connectez votre compte Instagram Business pour accéder aux fonctionnalités complètes d'analyse et de recherche de tendances.
          </p>
          <Button className="gradient-primary gap-2 w-full sm:w-auto" asChild>
            <a href="/auth/instagram/start">
              <Instagram className="h-4 w-4" />
              Connecter Instagram Business
            </a>
          </Button>
        </Card>

        {/* Search Demo */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Recherche par hashtag (Démo)</h2>
          </div>
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <Label htmlFor="hashtag-input">Hashtag de test</Label>
              <Input
                id="hashtag-input"
                value={hashtag}
                onChange={(e) => setHashtag(e.target.value)}
                placeholder="fashion, makeup, fitness..."
              />
            </div>
            <Button type="submit" className="gradient-primary gap-2">
              <Search className="h-4 w-4" />
              Afficher 12 Top Media
            </Button>
          </form>

          {showResults && (
            <div className="mt-6 space-y-3">
              <p className="text-sm font-semibold">12 résultats pour #{hashtag}</p>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
                  >
                    <span className="text-xs text-muted-foreground">Post {i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Legal Links */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Liens légaux requis</h2>
          <div className="flex flex-wrap gap-4">
            <Button asChild variant="outline">
              <Link to="/privacy">Politique de confidentialité</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/terms">Conditions d'utilisation</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/data-deletion">Suppression des données</Link>
            </Button>
          </div>
        </Card>

        {/* Features */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Fonctionnalités</h2>
          <ul className="space-y-3">
            {[
              'Recherche de hashtags Instagram',
              'Analyse de posts publics',
              'Métriques de performance',
              'Respect des limites API',
              'Conformité RGPD',
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </main>
  );
}
