import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Hash, User, Grid3x3, Table, Heart, MessageCircle, Eye, TrendingUp, Plus, X } from 'lucide-react';

export default function Watchlist() {
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  // Mock data: Niches suivies
  const niches = [
    { id: 1, name: 'fashion', posts: 1247, growth: '+34%', engagement: 8.2 },
    { id: 2, name: 'makeup', posts: 892, growth: '+28%', engagement: 7.5 },
    { id: 3, name: 'fitness', posts: 1456, growth: '+22%', engagement: 9.1 },
    { id: 4, name: 'travel', posts: 2156, growth: '+41%', engagement: 6.8 },
    { id: 5, name: 'food', posts: 1876, growth: '+18%', engagement: 7.9 },
  ];

  // Mock data: Utilisateurs suivis
  const followedUsers = [
    { id: 1, username: '@fashionicon', name: 'Fashion Icon', followers: '125K', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1', posts: 247, engagement: 12.5 },
    { id: 2, username: '@makeupqueen', name: 'Makeup Queen', followers: '98K', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2', posts: 189, engagement: 15.2 },
    { id: 3, username: '@fitnesspro', name: 'Fitness Pro', followers: '342K', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user3', posts: 512, engagement: 9.8 },
    { id: 4, username: '@travelblog', name: 'Travel Blog', followers: '256K', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user4', posts: 398, engagement: 11.4 },
  ];

  // Mock data: Posts d'un utilisateur
  const getUserPosts = (userId: number) => [
    { id: 1, media: 'https://picsum.photos/400/400?random=1', likes: 12456, comments: 234, engagement: 12.5, date: '2 days ago' },
    { id: 2, media: 'https://picsum.photos/400/400?random=2', likes: 8934, comments: 187, engagement: 9.8, date: '5 days ago' },
    { id: 3, media: 'https://picsum.photos/400/400?random=3', likes: 15678, comments: 312, engagement: 15.2, date: '1 week ago' },
    { id: 4, media: 'https://picsum.photos/400/400?random=4', likes: 5678, comments: 98, engagement: 8.4, date: '1 week ago' },
    { id: 5, media: 'https://picsum.photos/400/400?random=5', likes: 10123, comments: 201, engagement: 10.9, date: '2 weeks ago' },
    { id: 6, media: 'https://picsum.photos/400/400?random=6', likes: 7890, comments: 145, engagement: 7.6, date: '2 weeks ago' },
  ];

  const selectedUserData = followedUsers.find(u => u.id === selectedUser);
  const posts = selectedUser ? getUserPosts(selectedUser) : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold tracking-tight">Watchlist</h1>
          <p className="text-muted-foreground mt-2">
            Suivez vos niches, créateurs et analysez leurs performances
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="niches" className="space-y-4">
          <TabsList>
            <TabsTrigger value="niches">
              <Hash className="h-4 w-4 mr-2" />
              Niches Suivies
            </TabsTrigger>
            <TabsTrigger value="users">
              <User className="h-4 w-4 mr-2" />
              Utilisateurs Suivis
            </TabsTrigger>
          </TabsList>

          {/* Niches Suivies Tab */}
          <TabsContent value="niches" className="space-y-4">
            {/* Add Niche */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Ajouter une Niche
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Input placeholder="Nom de la niche (ex: fashion)" className="flex-1" />
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Niches Table */}
            <Card>
              <CardHeader>
                <CardTitle>Niches Suivies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Niche</th>
                        <th className="text-right p-3 font-semibold">Posts</th>
                        <th className="text-right p-3 font-semibold">Croissance</th>
                        <th className="text-right p-3 font-semibold">Engagement</th>
                        <th className="text-center p-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {niches.map((niche) => (
                        <tr key={niche.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Hash className="h-5 w-5 text-primary" />
                              </div>
                              <span className="font-medium">#{niche.name}</span>
                            </div>
                          </td>
                          <td className="text-right p-3 font-medium">{niche.posts.toLocaleString()}</td>
                          <td className="text-right p-3">
                            <span className="text-success">{niche.growth}</span>
                          </td>
                          <td className="text-right p-3">
                            <span className="font-medium">{niche.engagement}%</span>
                          </td>
                          <td className="text-center p-3">
                            <Button variant="ghost" size="icon">
                              <X className="h-4 w-4 text-destructive" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Utilisateurs Suivis Tab */}
          <TabsContent value="users" className="space-y-4">
            {/* Add User */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Ajouter un Utilisateur
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Input placeholder="@username" className="flex-1" />
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Grille des Utilisateurs */}
            {!selectedUser && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {followedUsers.map((user) => (
                  <Card 
                    key={user.id} 
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => setSelectedUser(user.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-16 h-16 rounded-full"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">{user.username}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-2xl font-bold">{user.followers}</p>
                          <p className="text-xs text-muted-foreground">Followers</p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-2xl font-bold">{user.posts}</p>
                          <p className="text-xs text-muted-foreground">Posts</p>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                        <div className="flex items-center justify-center gap-2">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          <span className="font-medium">{user.engagement}%</span>
                          <span className="text-sm text-muted-foreground">Engagement</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Vue Utilisateur Unique avec Posts */}
            {selectedUser && selectedUserData && (
              <div className="space-y-4">
                {/* Header Utilisateur */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img 
                          src={selectedUserData.avatar}
                          alt={selectedUserData.name}
                          className="w-20 h-20 rounded-full"
                        />
                        <div>
                          <h2 className="text-2xl font-bold">{selectedUserData.name}</h2>
                          <p className="text-muted-foreground">{selectedUserData.username}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="font-medium">{selectedUserData.followers} followers</span>
                            <span className="font-medium">{selectedUserData.posts} posts</span>
                            <span className="font-medium">{selectedUserData.engagement}% engagement</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" onClick={() => setSelectedUser(null)}>
                        <X className="h-4 w-4 mr-2" />
                        Retour
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Posts en Tableau */}
                <Card>
                  <CardHeader>
                    <CardTitle>Posts Récents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-3 font-semibold">Média</th>
                            <th className="text-right p-3 font-semibold">Likes</th>
                            <th className="text-right p-3 font-semibold">Comments</th>
                            <th className="text-right p-3 font-semibold">Engagement</th>
                            <th className="text-left p-3 font-semibold">Date</th>
                            <th className="text-center p-3 font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {posts.map((post) => (
                            <tr key={post.id} className="border-b hover:bg-muted/50 transition-colors">
                              <td className="p-3">
                                <img 
                                  src={post.media} 
                                  alt={`Post ${post.id}`}
                                  className="w-20 h-20 object-cover rounded-lg"
                                />
                              </td>
                              <td className="text-right p-3">
                                <div className="flex items-center justify-end gap-2">
                                  <Heart className="h-4 w-4 text-destructive" />
                                  <span>{post.likes.toLocaleString()}</span>
                                </div>
                              </td>
                              <td className="text-right p-3">
                                <div className="flex items-center justify-end gap-2">
                                  <MessageCircle className="h-4 w-4" />
                                  <span>{post.comments.toLocaleString()}</span>
                                </div>
                              </td>
                              <td className="text-right p-3">
                                <span className="font-medium">{post.engagement}%</span>
                              </td>
                              <td className="p-3 text-muted-foreground">{post.date}</td>
                              <td className="text-center p-3">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Posts en Grille (Optionnel) */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Grid3x3 className="h-5 w-5" />
                      Vue Grille
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {posts.map((post) => (
                        <div key={post.id} className="relative group cursor-pointer">
                          <img 
                            src={post.media} 
                            alt={`Post ${post.id}`}
                            className="w-full aspect-square object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-4 text-white">
                            <div className="flex items-center gap-2">
                              <Heart className="h-5 w-5" />
                              <span className="font-semibold">{post.likes.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MessageCircle className="h-5 w-5" />
                              <span className="font-semibold">{post.comments.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
