import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Globe, Instagram, Facebook, LogOut, FileText, Edit, Trash2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { TikTokIcon } from '@/components/icons/TikTokIcon';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ConnectedAccount {
  id: number;
  provider: string;
  provider_user_id: string;
  connected_at: string;
  has_token: boolean;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'archived' | 'draft';
}

export default function Profile() {
  const { user } = useAuth();
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchConnectedAccounts();
  }, []);

  const fetchConnectedAccounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/v1/auth/accounts/connected`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setConnectedAccounts(data.accounts || []);
      }
    } catch (error) {
      console.error('Error fetching connected accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async (accountId: number, provider: string) => {
    if (!confirm(`Voulez-vous déconnecter votre compte ${provider} ?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/v1/auth/accounts/${accountId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success(`Compte ${provider} déconnecté`);
        fetchConnectedAccounts();
      } else {
        toast.error('Erreur lors de la déconnexion');
      }
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const handleConnect = (provider: string) => {
    window.location.href = `${API_BASE}/api/v1/auth/${provider}/start`;
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'instagram':
        return <Instagram className="h-5 w-5" style={{ color: '#ac2bac' }} />;
      case 'facebook':
        return <Facebook className="h-5 w-5" style={{ color: '#3b5998' }} />;
      case 'tiktok':
        return <TikTokIcon className="h-5 w-5" />;
      default:
        return <Globe className="h-5 w-5" />;
    }
  };

  const getProviderName = (provider: string) => {
    const names: Record<string, string> = {
      instagram: 'Instagram',
      facebook: 'Facebook',
      tiktok: 'TikTok'
    };
    return names[provider] || provider;
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">

        <div className="max-w-2xl mx-auto">
          {/* Profile Section */}
          <div>
            {/* Profile Card */}
            <Card className="mb-4">
              <CardContent className="pt-6 text-center">
                <img
                  src={`https://api.dicebear.com/7.x/shapes/svg?seed=${user?.email || 'user'}`}
                  alt="avatar"
                  className="rounded-full w-32 h-32 mx-auto mb-4"
                />
                <p className="text-sm font-medium mb-1">{user?.name || 'Utilisateur'}</p>
                <p className="text-sm text-muted-foreground">{user?.email || 'user@example.com'}</p>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle>Réseaux sociaux</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {['instagram', 'facebook', 'tiktok'].map((provider) => {
                  const account = connectedAccounts.find(acc => acc.provider === provider);
                  const isConnected = !!account;
                  
                  return (
                    <div
                      key={provider}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getProviderIcon(provider)}
                        <div>
                          <p className="text-sm font-medium">{getProviderName(provider)}</p>
                          <p className={`text-xs ${isConnected ? 'text-green-500' : 'text-muted-foreground'}`}>
                            {isConnected ? 'Connecté' : 'Non connecté'}
                          </p>
                        </div>
                      </div>
                      {isConnected ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDisconnect(account!.id, provider)}
                          className="text-destructive hover:text-destructive"
                        >
                          Déconnecter
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleConnect(provider)}
                        >
                          Connecter
                        </Button>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Sign Out Button - Simplified */}
            <Button 
              variant="outline" 
              className="w-full gap-2"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>

          {/* My Projects Section */}
          <div className="mt-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>My Projects</CardTitle>
                {projects.length > 0 && (
                  <Button onClick={() => toast.info('Création de projet en cours de développement')}>
                    + New project
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-6">
                {projects.length === 0 ? (
                  /* Empty State */
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No projects found
                    </h3>
                    <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
                      {searchQuery ? (
                        <>
                          Your search "<span className="font-medium">{searchQuery}</span>" did not match any projects. Please try again.
                        </>
                      ) : (
                        'You haven\'t created any projects yet. Create your first project to get started!'
                      )}
                    </p>
                    <div className="flex gap-3">
                      {searchQuery && (
                        <Button
                          variant="outline"
                          onClick={() => setSearchQuery('')}
                        >
                          Clear search
                        </Button>
                      )}
                      <Button onClick={() => toast.info('Création de projet en cours de développement')}>
                        + New project
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Projects Grid */
                  <div className="space-y-4">
                    {/* Search bar (optional - can be added later) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {projects.filter(project => 
                        searchQuery === '' || 
                        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        project.description?.toLowerCase().includes(searchQuery.toLowerCase())
                      ).map((project) => (
                        <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-base mb-1">{project.name}</CardTitle>
                                {project.description && (
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {project.description}
                                  </p>
                                )}
                              </div>
                              <Badge 
                                variant={
                                  project.status === 'active' ? 'default' : 
                                  project.status === 'archived' ? 'secondary' : 
                                  'outline'
                                }
                                className="ml-2"
                              >
                                {project.status === 'active' ? 'Active' : 
                                 project.status === 'archived' ? 'Archived' : 
                                 'Draft'}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {format(new Date(project.updatedAt), 'dd MMM yyyy', { locale: fr })}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex-1"
                                onClick={() => toast.info('Édition de projet en cours de développement')}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => {
                                  if (confirm(`Voulez-vous supprimer le projet "${project.name}" ?`)) {
                                    setProjects(projects.filter(p => p.id !== project.id));
                                    toast.success('Projet supprimé');
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
