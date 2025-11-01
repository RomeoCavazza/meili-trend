import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, MessageCircle, Heart, Share2 } from 'lucide-react';

export default function Community() {
  // Données de démonstration pour la communauté
  const trendingTopics = [
    { id: 1, name: 'fashion', posts: 1247, growth: '+34%' },
    { id: 2, name: 'makeup', posts: 892, growth: '+28%' },
    { id: 3, name: 'fitness', posts: 1456, growth: '+22%' },
    { id: 4, name: 'food', posts: 983, growth: '+18%' },
  ];

  const topCreators = [
    { id: 1, username: '@fashionista', followers: '125K', engagement: 8.2, platform: 'instagram' },
    { id: 2, username: '@makeup_pro', followers: '89K', engagement: 7.5, platform: 'instagram' },
    { id: 3, username: '@fitness_guru', followers: '203K', engagement: 9.1, platform: 'tiktok' },
    { id: 4, username: '@foodie_life', followers: '156K', engagement: 6.8, platform: 'instagram' },
  ];

  const recentDiscussions = [
    { id: 1, title: 'New fashion trend for 2025', author: '@user1', replies: 12, likes: 45 },
    { id: 2, title: 'Best makeup products this month', author: '@user2', replies: 8, likes: 32 },
    { id: 3, title: 'Fitness routine sharing', author: '@user3', replies: 15, likes: 67 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Community</h1>
          <p className="text-muted-foreground mt-2">
            Connect with creators, discover trends, and share insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendingTopics.map((topic) => (
                    <div
                      key={topic.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">#{topic.name}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {topic.posts.toLocaleString()} posts
                        </span>
                      </div>
                      <span className="text-sm font-medium text-green-600">{topic.growth}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Discussions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Recent Discussions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentDiscussions.map((discussion) => (
                    <div
                      key={discussion.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <h3 className="font-semibold mb-2">{discussion.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{discussion.author}</span>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{discussion.replies}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{discussion.likes}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Top Creators */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Top Creators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCreators.map((creator) => (
                    <div
                      key={creator.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{creator.username}</p>
                          <p className="text-xs text-muted-foreground">
                            {creator.followers} followers
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{creator.engagement}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Community Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Members</span>
                    <span className="font-medium">1,234</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Topics Discussed</span>
                    <span className="font-medium">456</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Posts Shared</span>
                    <span className="font-medium">8,901</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

