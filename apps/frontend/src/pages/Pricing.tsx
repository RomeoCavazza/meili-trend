import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';

export default function Pricing() {
  const plans = [
    {
      name: 'Free',
      description: 'Discover what Insider can do for you',
      price: '$0',
      period: 'per month',
      features: [
        '5 requests per month',
        'Basic trend search',
        'Public trends',
      ],
    },
    {
      name: 'Starter',
      description: 'Perfect for individuals getting started',
      price: '$29',
      period: 'per month',
      features: [
        'Basic trend search',
        '100 searches per month',
        'Email support',
        'Basic analytics',
      ],
    },
    {
      name: 'Pro',
      description: 'Designed for fast-moving teams',
      price: '$99',
      period: 'per month',
      popular: true,
      features: [
        'Advanced trend search',
        'Unlimited searches',
        'Priority support',
        'Advanced analytics',
        'API access',
        'Custom reports',
      ],
    },
    {
      name: 'Enterprise',
      description: 'Built for large orgs needing flexibility',
      price: 'Custom',
      period: '',
      features: [
        'Everything in Pro',
        'Dedicated account manager',
        'Custom integrations',
        'SLA guarantee',
        'Team collaboration',
        'White-label options',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="container py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Pricing plans
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start for free. Upgrade to get the capacity that exactly matches your team's needs.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`p-6 relative flex flex-col ${
                plan.popular ? 'border-primary' : ''
              }`}
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 min-h-[40px]">
                  {plan.description}
                </p>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-sm text-muted-foreground ml-2">{plan.period}</span>
                  )}
                </div>
                <Button
                  className="w-full mb-6"
                  variant={plan.popular ? 'default' : 'outline'}
                  asChild
                >
                  <Link to="/auth">{plan.name === 'Enterprise' ? 'Book a demo' : 'Get Started'}</Link>
                </Button>
              </div>
              <ul className="space-y-3 flex-grow">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* Student Discount Section */}
        <Card className="max-w-4xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Student discount</h3>
              <p className="text-sm text-muted-foreground">
                Verify student status and get access to up to 50% off Insider Pro.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/auth">Learn more</Link>
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
