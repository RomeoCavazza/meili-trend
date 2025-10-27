import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { connectedPages, type ConnectedPage } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { User, Settings, CheckCircle2, Facebook, Instagram, Link as LinkIcon, LogOut } from 'lucide-react';

export default function Profile() {
  const { user, signOut } = useAuth();
  
  // Mock data for instagram_basic permission
  const accountInfo = {
    username: '@insidertrends_official',
    full_name: user?.name || 'Insider Trends',
    email: user?.email || '',
    bio: 'Professional Instagram Analytics Platform 📊 | Helping marketers discover trends 🚀 | Trusted by 2,800+ agencies',
    website: 'https://insidertrends.com',
    followers: '45.2K',
    following: '892',
    posts: '1,247',
    account_type: 'Business',
    verified: true,
    profile_picture: user?.email || 'https://api.dicebear.com/7.x/shapes/svg?seed=insidertrends',
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground mt-2">
              Manage your connected Instagram Business accounts and Facebook Pages.
            </p>
          </div>
          <Button variant="outline" onClick={signOut} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Social Connections */}
        <Card>
          <CardHeader>
            <CardTitle>Connect Social Accounts</CardTitle>
            <CardDescription>
              Link your Instagram, TikTok, and X accounts to access all features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Connectez vos comptes sociaux pour accéder à toutes les fonctionnalités.</p>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="account" className="space-y-4">
          <TabsList>
            <TabsTrigger value="account">
              <User className="h-4 w-4 mr-2" />
              Account Info
            </TabsTrigger>
            <TabsTrigger value="pages">
              <Facebook className="h-4 w-4 mr-2" />
              Connected Pages
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Account Info Tab - instagram_basic */}
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Instagram Business Account</CardTitle>
                <CardDescription>
                  Basic metadata from your Instagram Business account (instagram_basic permission)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <img
                      src={accountInfo.profile_picture}
                      alt={accountInfo.username}
                      className="w-24 h-24 rounded-full border-4 border-primary"
                    />
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-bold">{accountInfo.full_name}</h3>
                        {accountInfo.verified && (
                          <CheckCircle2 className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <p className="text-muted-foreground">{accountInfo.username}</p>
                      <Badge variant="secondary" className="mt-2">
                        {accountInfo.account_type} Account
                      </Badge>
                    </div>

                    <p className="text-sm">{accountInfo.bio}</p>

                    <div className="flex items-center gap-2 text-sm text-primary">
                      <LinkIcon className="h-4 w-4" />
                      <a href={accountInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {accountInfo.website}
                      </a>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{accountInfo.posts}</p>
                        <p className="text-sm text-muted-foreground">Posts</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{accountInfo.followers}</p>
                        <p className="text-sm text-muted-foreground">Followers</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{accountInfo.following}</p>
                        <p className="text-sm text-muted-foreground">Following</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Details */}
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>
                  Detailed information from Instagram Graph API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex justify-between items-center p-3 rounded-lg border">
                    <span className="text-sm font-medium">Account ID</span>
                    <span className="text-sm text-muted-foreground">17841400000000000</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg border">
                    <span className="text-sm font-medium">Username</span>
                    <span className="text-sm text-muted-foreground">{accountInfo.username}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg border">
                    <span className="text-sm font-medium">Account Type</span>
                    <Badge variant="secondary">{accountInfo.account_type}</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg border">
                    <span className="text-sm font-medium">Verification Status</span>
                    {accountInfo.verified ? (
                      <Badge variant="default" className="bg-success">Verified</Badge>
                    ) : (
                      <Badge variant="secondary">Not Verified</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Connected Pages Tab - pages_show_list */}
          <TabsContent value="pages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Connected Facebook Pages</CardTitle>
                <CardDescription>
                  List of Pages you manage (pages_show_list permission)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {connectedPages.map((page) => (
                    <div
                      key={page.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:border-primary transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={page.profile_picture}
                          alt={page.name}
                          className="w-16 h-16 rounded-lg"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{page.name}</p>
                            {page.verified && (
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{page.username}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {page.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {page.followers} followers
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-success">
                          <Instagram className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="w-full mt-4" variant="outline">
                  <Facebook className="h-4 w-4 mr-2" />
                  Connect Another Page
                </Button>
              </CardContent>
            </Card>

            {/* Page Permissions */}
            <Card>
              <CardHeader>
                <CardTitle>Page Permissions</CardTitle>
                <CardDescription>
                  Current permissions granted to Insider Trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {[
                    'pages_show_list',
                    'pages_read_engagement',
                    'pages_read_user_content',
                    'instagram_basic',
                    'instagram_manage_insights',
                  ].map((permission) => (
                    <div key={permission} className="flex items-center justify-between p-3 rounded-lg border">
                      <span className="text-sm font-mono">{permission}</span>
                      <Badge variant="default" className="bg-success">Granted</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates about your analytics</p>
                  </div>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">Auto-Refresh Data</p>
                    <p className="text-sm text-muted-foreground">Automatically sync Instagram data</p>
                  </div>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">Data Retention</p>
                    <p className="text-sm text-muted-foreground">Keep analytics data for 90 days</p>
                  </div>
                  <Badge variant="secondary">90 days</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  Disconnect Instagram Account
                </Button>
                <Button variant="outline" className="w-full text-destructive hover:bg-destructive hover:text-destructive-foreground">
                  Delete All Data
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  );
}
