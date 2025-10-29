import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { Globe, Instagram, Facebook, Mail, LogOut } from 'lucide-react';
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

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Column - Avatar & Social Links */}
          <div className="lg:col-span-4">
            {/* Profile Card */}
            <Card className="mb-4">
              <CardContent className="pt-6 text-center">
                <img
                  src={`https://api.dicebear.com/7.x/shapes/svg?seed=${user?.email || 'user'}`}
                  alt="avatar"
                  className="rounded-full w-32 h-32 mx-auto mb-4"
                />
                <p className="text-muted-foreground mb-1">Full Stack Developer</p>
                <p className="text-muted-foreground">Bay Area, San Francisco, CA</p>
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

          {/* Right Column - Details & Stats */}
          <div className="lg:col-span-8 space-y-4">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <div className="w-1/4">
                    <p className="text-sm font-medium">Full Name</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{user?.name || 'John Doe'}</p>
                  </div>
                </div>
                <hr className="border-border" />
                
                <div className="flex items-start">
                  <div className="w-1/4">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{user?.email || 'user@example.com'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Connected Accounts */}
            <Card>
              <CardHeader>
                <CardTitle>Connected Accounts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? (
                  <p className="text-sm text-muted-foreground">Chargement...</p>
                ) : (
                  <>
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
                  </>
                )}
              </CardContent>
            </Card>

            {/* Project Stats */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    <span className="text-primary italic">assignment</span> Project Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Web Design</span>
                      <span>80%</span>
                    </div>
                    <Progress value={80} />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Website Markup</span>
                      <span>72%</span>
                    </div>
                    <Progress value={72} />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>One Page</span>
                      <span>89%</span>
                    </div>
                    <Progress value={89} />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Mobile Template</span>
                      <span>55%</span>
                    </div>
                    <Progress value={55} />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Backend API</span>
                      <span>66%</span>
                    </div>
                    <Progress value={66} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    <span className="text-primary italic">assignment</span> Skills Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>JavaScript</span>
                      <span>90%</span>
                    </div>
                    <Progress value={90} />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>React</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>TypeScript</span>
                      <span>78%</span>
                    </div>
                    <Progress value={78} />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Python</span>
                      <span>70%</span>
                    </div>
                    <Progress value={70} />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Database</span>
                      <span>65%</span>
                    </div>
                    <Progress value={65} />
                  </div>
                </CardContent>
              </Card>
                         </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
