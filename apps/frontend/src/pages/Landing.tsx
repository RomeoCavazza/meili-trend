import { Link } from 'react-router-dom';
import { TrendingUp, Sparkles, Users2, FileBarChart, TrendingUpDown, FileText, Search as SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function Landing() {
  const features = [
    {
      icon: Sparkles,
      title: 'Advanced Search',
      description: 'Discover trends with powerful filters.',
    },
    {
      icon: Users2,
      title: 'Creator Intelligence',
      description: 'Analyze influencer performance and partnerships.',
    },
    {
      icon: FileBarChart,
      title: 'Reports Generation',
      description: 'Generate professional reports with insights.',
    },
    {
      icon: TrendingUpDown,
      title: 'Real-time Analytics',
      description: 'Track engagement and growth trends.',
    },
  ];


  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="container py-32 md:py-40">
        <div className="flex flex-col items-center text-center space-y-12 max-w-4xl mx-auto">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gradient">
              Discover Social Media Trends
            </h1>
            
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              The ultimate platform for tracking Instagram trends, analyzing creators, and discovering what's trending across social platforms
            </p>
          </div>

                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
                   <Link to="/projects/new">
                     <Button size="lg" className="gradient-primary shadow-glow">
                       <Sparkles className="mr-2 h-5 w-5" />
                       Start a demo
                     </Button>
                   </Link>
                   <Link to="/docs">
                     <Button size="lg" variant="outline">
                       <FileText className="mr-2 h-5 w-5" />
                       Documentation
                     </Button>
                   </Link>
                 </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container py-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-4 p-8 rounded-2xl bg-card/50 border border-border/50">
                <feature.icon className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Link to="/docs">
              <Button variant="outline" size="lg" className="rounded-xl">
                <FileText className="h-4 w-4 mr-2" />
                Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
}
