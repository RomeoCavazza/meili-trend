import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Hash, User, Zap } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

export default function Explore() {
  const topHashtags = [
    { tag: 'fashion', posts: 12500, trend: '+23%' },
    { tag: 'makeup', posts: 9800, trend: '+18%' },
    { tag: 'fitness', posts: 8200, trend: '+15%' },
    { tag: 'travel', posts: 7500, trend: '+12%' },
    { tag: 'food', posts: 6800, trend: '+8%' },
    { tag: 'lifestyle', posts: 5900, trend: '+5%' },
  ];

  const topCreators = [
    { username: 'fashionista', followers: '250K', engagement: '8.5%' },
    { username: 'makeupro', followers: '180K', engagement: '12.3%' },
    { username: 'fitlife', followers: '320K', engagement: '6.7%' },
    { username: 'wanderlust', followers: '410K', engagement: '5.2%' },
    { username: 'foodie', followers: '190K', engagement: '9.1%' },
    { username: 'lifestyle', followers: '280K', engagement: '7.3%' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Explore Trends</h1>
            <p className="text-muted-foreground mt-2">
              Discover trending hashtags, top creators, and emerging content across Instagram
            </p>
          </div>

          {/* Top Hashtags */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Hash className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">Trending Hashtags</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topHashtags.map((item, i) => (
                <Link key={i} to={`/search?q=${item.tag}`}>
                  <Card className="p-6 transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <span className="font-semibold text-lg">#{item.tag}</span>
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
            <div className="flex items-center gap-2 mb-6">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">Top Creators</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topCreators.map((creator, i) => (
                <Link key={i} to={`/search?q=@${creator.username}`}>
                  <Card className="p-6 transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                        {creator.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold">@{creator.username}</p>
                        <p className="text-sm text-muted-foreground">
                          {creator.followers} followers
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Zap className="h-4 w-4 text-accent" />
                      <span className="text-muted-foreground">
                        {creator.engagement} engagement
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold">Quick Actions</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Link to="/search">
                <Card className="p-8 text-center transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer">
                  <div className="space-y-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <Hash className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Search Content</h3>
                    <p className="text-muted-foreground">
                      Find specific posts, hashtags, and creators
                    </p>
                  </div>
                </Card>
              </Link>
              <Link to="/watchlist">
                <Card className="p-8 text-center transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer">
                  <div className="space-y-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">My Watchlist</h3>
                    <p className="text-muted-foreground">
                      Manage your saved hashtags and creators
                    </p>
                  </div>
                </Card>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
