import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Hash, User, Plus, X, Heart, MessageCircle, Eye, ArrowLeft, Settings } from 'lucide-react';
import { getFakeProject, getFakeProjectPosts, fakeCreators, fakePosts } from '@/lib/fakeData';
import { useToast } from '@/hooks/use-toast';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : 'https://insidr-production.up.railway.app');

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [creators, setCreators] = useState<any[]>([]);
  const [niches, setNiches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger projet depuis API
    const loadProject = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/auth');
          return;
        }

        // Charger projet depuis API
        const response = await fetch(`${API_BASE}/api/v1/projects/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to load project: ${response.status}`);
        }

        const projectData = await response.json();
        console.log('Project loaded:', projectData);
        
        setProject(projectData);
        
               // Extraire créateurs depuis creators (nouvelle structure)
               const projectCreators = projectData.creators || [];
               const creatorsData = projectCreators.map((c: any) => ({
                 handle: c.creator_username,
                 platform: projectData.platforms[0] || 'instagram',
                 profile_picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.creator_username}`,
               }));
               setCreators(creatorsData);
               
               // Si pas de créateurs mais scope_query contient des users, extraire
               if (creatorsData.length === 0 && projectData.scope_query) {
                 const queryUsers = projectData.scope_query.split(',').map((q: string) => q.trim().replace('@', ''));
                 setCreators(queryUsers.map((username: string) => ({
                   handle: username,
                   platform: projectData.platforms[0] || 'instagram',
                   profile_picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
                 })));
               }
        
        // Extraire hashtags depuis scope_query ou séparer par virgule
        const query = projectData.scope_query || '';
        const hashtagsFromQuery = query.split(',').map((q: string) => q.trim()).filter(Boolean);
        setNiches(hashtagsFromQuery.map((name: string, idx: number) => ({
          id: idx + 1,
          name: name.replace('#', ''),
          posts: 0,
          growth: '0%',
          engagement: 0,
        })));
        
        // Pour l'instant, utiliser fake posts (à remplacer par vraie API)
        const projectPosts = getFakeProjectPosts(id || '');
        setPosts(projectPosts);
        
      } catch (error: any) {
        console.error('Error loading project:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to load project',
          variant: 'destructive',
        });
        // Fallback sur fake data
        const fakeProject = getFakeProject(id || '');
        if (fakeProject) {
          setProject(fakeProject);
          setPosts(getFakeProjectPosts(id || ''));
          setCreators(fakeCreators);
          setNiches([
            { id: 1, name: 'fashion', posts: 1247, growth: '+34%', engagement: 8.2 },
            { id: 2, name: 'makeup', posts: 892, growth: '+28%', engagement: 7.5 },
            { id: 3, name: 'fitness', posts: 1456, growth: '+22%', engagement: 9.1 },
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProject();
    }
  }, [id, navigate, toast]);

  const handleAddCreator = () => {
    toast({
      title: 'Add Creator',
      description: 'Feature coming soon',
    });
  };

  const handleAddNiche = () => {
    toast({
      title: 'Add Niche',
      description: 'Feature coming soon',
    });
  };

  if (loading || !project) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/projects')}
              className="mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
            <h1 className="text-4xl font-bold tracking-tight">{project.name}</h1>
            {project.description && (
              <p className="text-muted-foreground mt-2">{project.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
              {project.status}
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{creators.length}</div>
              <div className="text-sm text-muted-foreground">Creators</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{posts.length}</div>
              <div className="text-sm text-muted-foreground">Posts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{niches.length}</div>
              <div className="text-sm text-muted-foreground">Niches</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{project.signals_count || 0}</div>
              <div className="text-sm text-muted-foreground">Signals</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="watchlist" className="space-y-4">
          <TabsList>
            <TabsTrigger value="watchlist">
              Watchlist
            </TabsTrigger>
            <TabsTrigger value="analytics">
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Watchlist - Feed + Creators + Niches */}
          <TabsContent value="watchlist" className="space-y-6">
            {/* Section: Feed Posts */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Posts Feed</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.length > 0 ? (
                  posts.map((post) => {
                    const creator = creators.find(c => c.handle === post.username);
                    return (
                      <Card key={post.id} className="overflow-hidden">
                        <div className="relative">
                          <img
                            src={post.media_url}
                            alt={post.caption}
                            className="w-full h-64 object-cover"
                          />
                          <div className="absolute top-2 right-2 flex gap-2">
                            <Badge variant="secondary" className="bg-black/50 text-white">
                              {post.platform}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            {creator?.profile_picture && (
                              <img
                                src={creator.profile_picture}
                                alt={creator.handle}
                                className="w-6 h-6 rounded-full"
                              />
                            )}
                            <span className="text-sm font-medium">{post.username}</span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {post.caption}
                          </p>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Heart className="h-4 w-4" />
                                <span>{post.like_count?.toLocaleString() || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-4 w-4" />
                                <span>{post.comment_count?.toLocaleString() || 0}</span>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    No posts found
                  </div>
                )}
              </div>
            </div>

            {/* Section: Creators */}
            {creators.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Creators ({creators.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {creators.map((creator) => (
                    <Card
                      key={creator.id || creator.handle}
                      className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => navigate(`/projects/${id}/creator/${creator.handle.replace('@', '')}`)}
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center gap-4">
                          <img
                            src={creator.profile_picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.handle}`}
                            alt={creator.handle}
                            className="w-20 h-20 rounded-full"
                          />
                          <div>
                            <h3 className="font-semibold">{creator.handle}</h3>
                            {creator.followers && (
                              <p className="text-sm text-muted-foreground">
                                {creator.followers.toLocaleString()} followers
                              </p>
                            )}
                          </div>
                          {creator.avg_engagement && (
                            <div className="w-full p-3 bg-primary/10 rounded-lg">
                              <div className="text-center">
                                <span className="font-medium">{creator.avg_engagement}%</span>
                                <p className="text-xs text-muted-foreground">Engagement</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Section: Niches/Hashtags */}
            {niches.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Hashtags ({niches.length})</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-3 font-semibold">Hashtag</th>
                            <th className="text-right p-3 font-semibold">Posts</th>
                            <th className="text-right p-3 font-semibold">Growth</th>
                            <th className="text-right p-3 font-semibold">Engagement</th>
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
                              <td className="text-right p-3 font-medium">{niche.posts?.toLocaleString() || 0}</td>
                              <td className="text-right p-3">
                                <span className="text-green-600">{niche.growth || '0%'}</span>
                              </td>
                              <td className="text-right p-3">
                                <span className="font-medium">{niche.engagement || 0}%</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Tab 2: Analytics */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-3xl font-bold">{project.creators_count || 0}</div>
                      <div className="text-sm text-muted-foreground">Total Creators</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{project.posts_count || 0}</div>
                      <div className="text-sm text-muted-foreground">Total Posts</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">{project.signals_count || 0}</div>
                      <div className="text-sm text-muted-foreground">Signals Detected</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Project Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                        {project.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Platforms:</span>
                      <span>{project.platforms?.join(', ') || 'N/A'}</span>
                    </div>
                    {project.last_run_at && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Run:</span>
                        <span>{new Date(project.last_run_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Analytics Coming Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Detailed analytics and insights for this project will be available here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

