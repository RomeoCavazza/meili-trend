import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Hash, Bell, MessageCircle, AtSign, Heart, Trash2, Plus } from 'lucide-react';

export default function Watchlist() {
  const [watchedHashtags, setWatchedHashtags] = useState([
    { name: 'fashion', posts: 1247, alerts: 12, trend: '+34%' },
    { name: 'makeup', posts: 892, alerts: 8, trend: '+28%' },
    { name: 'fitness', posts: 1456, alerts: 15, trend: '+22%' },
  ]);

  // Mock data for pages_read_user_content permission
  const userComments = [
    {
      id: '1',
      user: '@fashionlover23',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
      comment: 'Love this collection! When will it be available? 😍',
      post: 'Summer Collection 2025',
      timestamp: '2h ago',
      likes: 24,
    },
    {
      id: '2',
      user: '@styleicon',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
      comment: 'Amazing quality! Just received my order 🎉',
      post: 'Product Launch Post',
      timestamp: '5h ago',
      likes: 18,
    },
    {
      id: '3',
      user: '@trendhunter',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3',
      comment: 'Can you share the styling tips? 💫',
      post: 'Behind The Scenes',
      timestamp: '1d ago',
      likes: 31,
    },
  ];

  const pageMentions = [
    {
      id: '1',
      user: '@influencer_marie',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marie',
      content: 'Tagged your page in my latest post about sustainable fashion!',
      post_url: 'https://instagram.com/p/xyz123',
      timestamp: '3h ago',
      engagement: 2847,
    },
    {
      id: '2',
      user: '@fashionblogger',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=blogger',
      content: 'Mentioned your brand in my Instagram Story',
      post_url: 'https://instagram.com/p/abc456',
      timestamp: '6h ago',
      engagement: 1523,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Watchlist</h1>
          <p className="text-muted-foreground mt-2">
            Monitor hashtags, creators, and track user-generated content on your pages.
          </p>
        </div>

        {/* Add to Watchlist */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Add to Watchlist
            </CardTitle>
            <CardDescription>
              Track new hashtags or creators to receive automated alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input placeholder="Enter hashtag (e.g., fashion, fitness)" className="flex-1" />
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="hashtags" className="space-y-4">
          <TabsList>
            <TabsTrigger value="hashtags">
              <Hash className="h-4 w-4 mr-2" />
              Hashtags
            </TabsTrigger>
            <TabsTrigger value="comments">
              <MessageCircle className="h-4 w-4 mr-2" />
              Comments
            </TabsTrigger>
            <TabsTrigger value="mentions">
              <AtSign className="h-4 w-4 mr-2" />
              Mentions
            </TabsTrigger>
          </TabsList>

          {/* Hashtags Tab */}
          <TabsContent value="hashtags" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tracked Hashtags</CardTitle>
                <CardDescription>
                  Receive alerts when these hashtags show significant activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {watchedHashtags.map((hashtag) => (
                    <div
                      key={hashtag.name}
                      className="flex items-center justify-between p-4 rounded-lg border hover:border-primary transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Hash className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">#{hashtag.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {hashtag.posts.toLocaleString()} posts tracked
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <Bell className="h-4 w-4 text-success" />
                            <span className="text-sm font-medium">{hashtag.alerts} new alerts</span>
                          </div>
                          <p className="text-xs text-success">{hashtag.trend} growth</p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comments Tab - pages_read_user_content */}
          <TabsContent value="comments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Comments on Your Pages</CardTitle>
                <CardDescription>
                  Monitor and manage user-generated content (pages_read_user_content permission)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userComments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex gap-4 p-4 rounded-lg border hover:border-primary transition-colors"
                    >
                      <img
                        src={comment.avatar}
                        alt={comment.user}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{comment.user}</p>
                          <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm">{comment.comment}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>On: {comment.post}</span>
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            <span>{comment.likes} likes</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            Reply
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mentions Tab - pages_read_user_content */}
          <TabsContent value="mentions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Page Mentions & Tags</CardTitle>
                <CardDescription>
                  Posts where your page is mentioned or tagged (pages_read_user_content permission)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pageMentions.map((mention) => (
                    <div
                      key={mention.id}
                      className="flex gap-4 p-4 rounded-lg border hover:border-primary transition-colors"
                    >
                      <img
                        src={mention.avatar}
                        alt={mention.user}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{mention.user}</p>
                          <Badge variant="secondary">Mentioned</Badge>
                          <span className="text-xs text-muted-foreground">{mention.timestamp}</span>
                        </div>
                        <p className="text-sm">{mention.content}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{mention.engagement.toLocaleString()} engagement</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={mention.post_url} target="_blank" rel="noopener noreferrer">
                            View Post
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Alert Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Alert Settings
            </CardTitle>
            <CardDescription>Configure when to receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">New Comments</p>
                <p className="text-sm text-muted-foreground">Get notified when users comment on your posts</p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">Page Mentions</p>
                <p className="text-sm text-muted-foreground">Alert when your page is mentioned or tagged</p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">Trending Hashtags</p>
                <p className="text-sm text-muted-foreground">Notify when tracked hashtags spike in activity</p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
