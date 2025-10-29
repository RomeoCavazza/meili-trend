import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Globe, Instagram, Facebook, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { TikTokIcon } from '@/components/icons/TikTokIcon';

interface ConnectedAccount {
  id: number;
  provider: string;
  provider_user_id: string;
  connected_at: string;
  has_token: boolean;
}

export default function Profile() {
  const { user } = useAuth();
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL || 'https://insidr-production.up.railway.app';

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
          <div className="mt-6">
            {/* My Projects */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>My Projects</CardTitle>
                <Button onClick={() => toast.info('Feature coming soon!')}>
                  Create a project
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center py-8">
                  No projects yet. Create your first project to get started!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
