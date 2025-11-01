import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, MessageCircle, Eye, Grid3x3, Table } from 'lucide-react';
import { fakeCreators, fakePosts } from '@/lib/fakeData';

export default function CreatorDetail() {
  const { id, username } = useParams<{ id: string; username: string }>();
  const navigate = useNavigate();

  // Simuler chargement créateur
  const creator = fakeCreators.find(c => c.handle.replace('@', '') === username);

  // Simuler posts du créateur
  const creatorPosts = fakePosts.filter(p => p.username === creator?.handle.replace('@', '') || p.username === username);

  if (!creator) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8">
          <div className="text-center">Creator not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/projects/${id}`)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Project
          </Button>

          {/* Creator Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <img
                  src={creator.profile_picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.handle}`}
                  alt={creator.handle}
                  className="w-24 h-24 rounded-full"
                />
                <div className="flex-1">
                  <h1 className="text-3xl font-bold">{creator.handle}</h1>
                  <div className="flex items-center gap-6 mt-2 text-sm text-muted-foreground">
                    <span className="font-medium">{creator.followers.toLocaleString()} followers</span>
                    <span className="font-medium">{creatorPosts.length} posts</span>
                    <span className="font-medium">{creator.avg_engagement}% engagement</span>
                  </div>
                  <Badge variant="secondary" className="mt-2">
                    {creator.platform}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Posts</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Table className="h-4 w-4 mr-2" />
                Table
              </Button>
              <Button variant="outline" size="sm">
                <Grid3x3 className="h-4 w-4 mr-2" />
                Grid
              </Button>
            </div>
          </div>

          {/* Grid View */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {creatorPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden cursor-pointer hover:border-primary transition-colors">
                <div className="relative">
                  <img
                    src={post.media_url}
                    alt={post.caption}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                    <div className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      <span className="font-semibold">{post.like_count.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      <span className="font-semibold">{post.comment_count.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-3">
                  <p className="text-xs text-muted-foreground line-clamp-2">{post.caption}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Table View (Alternative) */}
        <Card>
          <CardHeader>
            <CardTitle>Posts Table</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Média</th>
                    <th className="text-right p-3 font-semibold">Likes</th>
                    <th className="text-right p-3 font-semibold">Comments</th>
                    <th className="text-left p-3 font-semibold">Caption</th>
                    <th className="text-center p-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {creatorPosts.map((post) => (
                    <tr key={post.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-3">
                        <img
                          src={post.media_url}
                          alt={post.caption}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </td>
                      <td className="text-right p-3">
                        <div className="flex items-center justify-end gap-2">
                          <Heart className="h-4 w-4 text-destructive" />
                          <span>{post.like_count.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="text-right p-3">
                        <div className="flex items-center justify-end gap-2">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comment_count.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground max-w-md line-clamp-2">
                        {post.caption}
                      </td>
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
      </div>
    </div>
  );
}

