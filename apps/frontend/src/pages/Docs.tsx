import { Search, Users, FileText, BarChart3, Code, Database, Shield, Zap, CheckCircle2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';

export default function Docs() {
  const navigate = useNavigate();

  const apiFeatures = [
    {
      icon: Code,
      title: 'Meta Graph API Integration',
      description: 'Complete Instagram Business API implementation with all permissions',
      features: [
        'instagram_basic permission',
        'instagram_content_publish permission', 
        'instagram_manage_insights permission',
        'Meta oEmbed Read feature',
        'Business Discovery API',
        'Media Publishing API'
      ],
      status: 'Active',
      endpoints: [
        { method: 'GET', path: '/api/v1/instagram/media', description: 'Fetch Instagram media' },
        { method: 'POST', path: '/api/v1/instagram/media', description: 'Publish to Instagram' },
        { method: 'GET', path: '/api/v1/instagram/insights', description: 'Get media insights' },
        { method: 'GET', path: '/api/v1/instagram/business-discovery', description: 'Business account discovery' }
      ]
    },
    {
      icon: Database,
      title: 'Search & Analytics Engine',
      description: 'Powerful search capabilities with real-time analytics',
      features: [
        'Elasticsearch integration',
        'Real-time trend analysis',
        'Hashtag performance tracking',
        'Creator analytics',
        'Engagement rate calculations',
        'Content scoring algorithm'
      ],
      status: 'Active',
      endpoints: [
        { method: 'GET', path: '/v1/search/posts', description: 'Search Instagram posts' },
        { method: 'GET', path: '/v1/search/hashtags', description: 'Search trending hashtags' },
        { method: 'GET', path: '/v1/analytics/trends', description: 'Get trend analytics' },
        { method: 'GET', path: '/v1/analytics/creators', description: 'Creator performance data' }
      ]
    },
    {
      icon: Shield,
      title: 'Authentication & Security',
      description: 'Enterprise-grade security with OAuth2 and JWT',
      features: [
        'Google OAuth2 integration',
        'JWT token authentication',
        'Rate limiting with Redis',
        'CORS security configuration',
        'Secure API endpoints',
        'User session management'
      ],
      status: 'Active',
      endpoints: [
        { method: 'POST', path: '/api/v1/auth/google/start', description: 'Initiate Google OAuth' },
        { method: 'GET', path: '/api/v1/auth/google/callback', description: 'OAuth callback handler' },
        { method: 'GET', path: '/api/v1/auth/me', description: 'Get current user' },
        { method: 'POST', path: '/api/v1/auth/refresh', description: 'Refresh JWT token' }
      ]
    },
    {
      icon: Zap,
      title: 'Real-time Features',
      description: 'Live data processing and real-time updates',
      features: [
        'WebSocket connections',
        'Real-time notifications',
        'Live trend monitoring',
        'Instant search results',
        'Auto-refresh dashboards',
        'Push notifications'
      ],
      status: 'Beta',
      endpoints: [
        { method: 'WS', path: '/ws/trends', description: 'Real-time trend updates' },
        { method: 'WS', path: '/ws/notifications', description: 'Live notifications' },
        { method: 'GET', path: '/api/v1/live/status', description: 'System status' }
      ]
    }
  ];

  const sections = [
    {
      icon: Search,
      title: 'Advanced Search',
      description: 'Learn how to use our powerful search filters to discover trending hashtags and content across Instagram.',
      topics: [
        'Search by hashtag',
        'Filter by engagement',
        'Date range selection',
        'Platform-specific filters',
      ],
    },
    {
      icon: Users,
      title: 'Creator Intelligence',
      description: 'Analyze influencer performance, discover brand partnerships, and track creator metrics.',
      topics: [
        'Creator profiles',
        'Performance metrics',
        'Partnership opportunities',
        'Audience insights',
      ],
    },
    {
      icon: FileText,
      title: 'Reports Generation',
      description: 'Generate professional reports with automated insights and export to various formats.',
      topics: [
        'Custom reports',
        'Export options',
        'Scheduled reports',
        'Share with team',
      ],
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Track engagement metrics, growth trends, and performance insights in real-time.',
      topics: [
        'Live dashboards',
        'Engagement tracking',
        'Growth analysis',
        'Custom metrics',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-16">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Documentation</h1>
            <p className="text-lg text-muted-foreground">
              Complete technical documentation and API reference for Insider Trends
            </p>
          </div>

          {/* API Features Section */}
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">API Features & Endpoints</h2>
              <p className="text-muted-foreground">
                Comprehensive Meta Graph API integration with Instagram Business capabilities
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {apiFeatures.map((feature, index) => (
                <Card key={index} className="bg-card border-border hover-glow transition-all">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <Badge variant={feature.status === 'Active' ? 'default' : 'secondary'}>
                        {feature.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Features:</h4>
                      <ul className="space-y-1">
                        {feature.features.map((item, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                            <CheckCircle2 className="h-3 w-3 text-success" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">API Endpoints:</h4>
                      <div className="space-y-2">
                        {feature.endpoints.map((endpoint, i) => (
                          <div key={i} className="flex items-center gap-3 text-sm">
                            <Badge variant="outline" className="text-xs">
                              {endpoint.method}
                            </Badge>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {endpoint.path}
                            </code>
                            <span className="text-muted-foreground text-xs">
                              {endpoint.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* User Guides Section */}
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">User Guides</h2>
              <p className="text-muted-foreground">
                Learn how to use Insider Trends effectively with our step-by-step guides
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {sections.map((section, index) => (
                <Card key={index} className="bg-card border-border hover-glow transition-all">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                      <section.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription className="text-base">
                      {section.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.topics.map((topic, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 text-center transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer" onClick={() => navigate('/search')}>
                <div className="space-y-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Search className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Try Search</h3>
                  <p className="text-muted-foreground">
                    Test our advanced search capabilities
                  </p>
                </div>
              </Card>
              
              <Card className="p-6 text-center transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer" onClick={() => navigate('/explore')}>
                <div className="space-y-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <BarChart3 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Explore Trends</h3>
                  <p className="text-muted-foreground">
                    Discover trending hashtags and creators
                  </p>
                </div>
              </Card>
              
              <Card className="p-6 text-center transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer" onClick={() => navigate('/profile')}>
                <div className="space-y-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">View Profile</h3>
                  <p className="text-muted-foreground">
                    Check your Instagram account details
                  </p>
                </div>
              </Card>
            </div>
          </section>

          {/* Support Section */}
          <Card className="gradient-primary border-0 shadow-glow">
            <CardContent className="p-8 text-center space-y-4">
              <h2 className="text-2xl font-bold text-white">Need Technical Support?</h2>
              <p className="text-white/80">
                Contact our development team for API integration help
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  API Documentation
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
