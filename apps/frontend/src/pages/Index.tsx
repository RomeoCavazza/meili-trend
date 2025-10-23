import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, TrendingUp, Eye, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { InstagramIcon } from '@/components/icons/InstagramIcon';
import { TikTokIcon } from '@/components/icons/TikTokIcon';
import { XIcon } from '@/components/icons/XIcon';

const Index = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (code && state) {
      // Traiter l'authentification Instagram
      localStorage.setItem('instagram_auth_code', code);
      localStorage.setItem('instagram_auth_state', state);
      localStorage.setItem('instagram_authenticated', 'true');
      
      // Authentification réussie - pas de redirection automatique
    } else if (error) {
      console.error('Erreur auth Instagram:', error);
    }
  }, [searchParams]);
  const features = [
    {
      icon: Search,
      title: 'Recherche avancée',
      description: 'Trouvez les posts, hashtags et créateurs les plus pertinents en temps réel.',
    },
    {
      icon: TrendingUp,
      title: 'Analyse de tendances',
      description: 'Suivez les performances et identifiez les contenus qui émergent.',
    },
    {
      icon: Eye,
      title: 'Veille personnalisée',
      description: 'Créez des listes de surveillance pour ne rien manquer.',
    },
    {
      icon: Sparkles,
      title: 'Rapports automatiques',
      description: 'Générez des slides et rapports professionnels (bientôt).',
    },
  ];

  return (
    <>
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
          <div className="container relative mx-auto px-4 text-center">
            <div className="mx-auto max-w-3xl space-y-6">
              <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
                Analysez les tendances
                <span className="text-gradient block mt-2">
                  Instagram en temps réel
                </span>
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl">
                Découvrez les hashtags, créateurs et contenus qui font le buzz.
                Votre outil de veille professionnel pour les réseaux sociaux.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button asChild size="lg" className="gradient-primary shadow-glow">
                  <Link to="/search">
                    <Search className="mr-2 h-5 w-5" />
                    Essayer la recherche
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/explore">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Explorer les tendances
                  </Link>
                </Button>
              </div>
            </div>

            {/* Platform badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              <a 
                href="https://www.instagram.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="rounded-full bg-card px-4 py-2 text-sm border border-border flex items-center gap-2 text-white transition-smooth hover:shadow-glow hover:border-primary/50 hover:bg-primary/10"
              >
                <InstagramIcon className="h-4 w-4 text-white" />
                Instagram
              </a>
              <a 
                href="https://www.tiktok.com/en/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="rounded-full bg-card px-4 py-2 text-sm border border-border flex items-center gap-2 text-white transition-smooth hover:shadow-glow hover:border-primary/50 hover:bg-primary/10"
              >
                <TikTokIcon className="h-4 w-4 text-white" />
                TikTok
              </a>
              <a 
                href="https://x.com/home" 
                target="_blank" 
                rel="noopener noreferrer"
                className="rounded-full bg-card px-4 py-2 text-sm border border-border flex items-center gap-2 text-white transition-smooth hover:shadow-glow hover:border-primary/50 hover:bg-primary/10"
              >
                <XIcon className="h-4 w-4 text-white" />
                X
              </a>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Fonctionnalités</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Tout ce dont vous avez besoin pour rester à la pointe des tendances sociales.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="p-6 rounded-lg border border-border bg-card shadow-card transition-smooth hover:shadow-glow hover:border-primary/50"
                >
                  <div className="rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="rounded-2xl border border-border bg-gradient-card p-8 md:p-12 text-center shadow-card">
              <h2 className="text-3xl font-bold mb-4">Prêt à commencer ?</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Rejoignez les professionnels qui utilisent Insider pour leurs analyses de marché.
              </p>
              <Button asChild size="lg" className="gradient-primary shadow-glow">
                <Link to="/search">
                  Lancer une recherche
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Index;
