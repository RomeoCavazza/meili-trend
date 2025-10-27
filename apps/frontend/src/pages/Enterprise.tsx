import { Link } from 'react-router-dom';
import { Building, Users, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';

export default function Enterprise() {
  const features = [
    {
      icon: Building,
      title: 'Custom Solutions',
      description: 'Tailored features and integrations for your organization',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Advanced tools for teams to work together seamlessly',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'SOC 2 compliance, SSO, and advanced security features',
    },
    {
      icon: Zap,
      title: 'Priority Support',
      description: 'Dedicated account manager and 24/7 priority support',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="container py-24">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-display text-gradient">
            Enterprise Solutions
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Scale your social media intelligence with custom solutions designed for large organizations and agencies
          </p>
          <Button size="lg" asChild>
            <Link to="/auth">Contact Sales</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {features.map((feature) => (
            <Card key={feature.title} className="p-8">
              <feature.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>

        <Card className="p-12 max-w-3xl mx-auto text-center bg-card/50">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-8">
            Let's discuss how Insider can help your organization achieve its goals
          </p>
          <Button size="lg" asChild>
            <Link to="/auth">Schedule a Demo</Link>
          </Button>
        </Card>
      </section>
    </div>
  );
}
