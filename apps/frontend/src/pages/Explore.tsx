import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Hash, User, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Explore() {
  const topHashtags = [
    { tag: 'fashion', posts: 12500, trend: '+23%' },
    { tag: 'makeup', posts: 9800, trend: '+18%' },
    { tag: 'fitness', posts: 8200, trend: '+15%' },
    { tag: 'travel', posts: 7500, trend: '+12%' },
  ];

  const topCreators = [
    { username: 'fashionista', followers: '250K', engagement: '8.5%' },
    { username: 'makeupro', followers: '180K', engagement: '12.3%' },
    { username: 'fitlife', followers: '320K', engagement: '6.7%' },
    { username: 'wanderlust', followers: '410K', engagement: '5.2%' },
  ];

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explorer</h1>
          <p className="text-muted-foreground">
            Découvrez les tendances du moment et les créateurs qui émergent.
          </p>
        </div>

        <div className="space-y-8">
          {/* Top Hashtags */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Hash className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Top Hashtags</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {topHashtags.map((item, i) => (
                <Link key={i} to={`/search?hashtags=${item.tag}`}>
                  <Card className="p-4 transition-smooth hover:shadow-glow hover:border-primary/50 cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-semibold">#{item.tag}</span>
                      <Badge variant="secondary" className="gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {item.trend}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.posts.toLocaleString()} posts
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* Top Creators */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Top Créateurs</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {topCreators.map((creator, i) => (
                <Link key={i} to={`/search?q=@${creator.username}`}>
                  <Card className="p-4 transition-smooth hover:shadow-glow hover:border-primary/50 cursor-pointer">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent" />
                      <div>
                        <p className="font-semibold">@{creator.username}</p>
                        <p className="text-xs text-muted-foreground">
                          {creator.followers} abonnés
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Zap className="h-3 w-3 text-accent" />
                      <span className="text-muted-foreground">
                        {creator.engagement} engagement
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* Trending Posts placeholder */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Posts Tendance</h2>
            </div>
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                Les posts tendance seront affichés ici une fois les données disponibles.
              </p>
            </Card>
          </section>
        </div>
      </main>
  );
}
