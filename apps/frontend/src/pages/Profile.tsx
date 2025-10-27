import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { Globe, Github, Twitter, Instagram, Facebook, Mail, Phone, MapPin, LogOut } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

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
                  className="rounded-full w-32 h-32 mx-auto mb-4 border-4 border-primary"
                />
                <p className="text-muted-foreground mb-1">Full Stack Developer</p>
                <p className="text-muted-foreground">Bay Area, San Francisco, CA</p>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardContent className="p-0">
                <ul className="divide-y divide-border">
                  <li className="flex items-center justify-between p-4">
                    <Globe className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm text-muted-foreground">https://insidr.dev</span>
                  </li>
                  <li className="flex items-center justify-between p-4">
                    <Github className="h-5 w-5" style={{ color: '#333333' }} />
                    <span className="text-sm text-muted-foreground">insidr-dev</span>
                  </li>
                  <li className="flex items-center justify-between p-4">
                    <Twitter className="h-5 w-5" style={{ color: '#55acee' }} />
                    <span className="text-sm text-muted-foreground">@insidr_dev</span>
                  </li>
                  <li className="flex items-center justify-between p-4">
                    <Instagram className="h-5 w-5" style={{ color: '#ac2bac' }} />
                    <span className="text-sm text-muted-foreground">insidr_trends</span>
                  </li>
                  <li className="flex items-center justify-between p-4">
                    <Facebook className="h-5 w-5" style={{ color: '#3b5998' }} />
                    <span className="text-sm text-muted-foreground">Insidr Trends</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Sign Out Button */}
            <Card>
              <CardContent className="p-6">
                <Button 
                  variant="outline" 
                  className="w-full gap-2"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
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
                <hr className="border-border" />
                
                <div className="flex items-start">
                  <div className="w-1/4">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">(097) 234-5678</p>
                  </div>
                </div>
                <hr className="border-border" />
                
                <div className="flex items-start">
                  <div className="w-1/4">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Mobile
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">(098) 765-4321</p>
                  </div>
                </div>
                <hr className="border-border" />
                
                <div className="flex items-start">
                  <div className="w-1/4">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Bay Area, San Francisco, CA</p>
                  </div>
                </div>
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
    </div>
  );
}
