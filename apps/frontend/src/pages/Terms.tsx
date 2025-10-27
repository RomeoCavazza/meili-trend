import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-muted-foreground mt-2">Last updated: January 22, 2025</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              By accessing and using Insider Trends ("Service"), you accept and agree to be bound
              by these Terms of Service. If you do not agree to these terms, please do not use our Service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Service Description</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              Insider Trends is an Instagram trend intelligence platform that provides:
            </p>
            <ul>
              <li>Hashtag search and analysis tools</li>
              <li>Instagram Business account analytics</li>
              <li>Content performance tracking</li>
              <li>Trend monitoring and alerts</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. User Obligations</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>You agree to:</p>
            <ul>
              <li>Provide accurate account information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Use the Service in compliance with applicable laws</li>
              <li>Not engage in unauthorized scraping or data collection</li>
              <li>Respect intellectual property rights</li>
              <li>Comply with Meta's Platform Terms and Policies</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Prohibited Activities</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>You may NOT:</p>
            <ul>
              <li>Use the Service for spam or malicious activities</li>
              <li>Attempt to reverse engineer or hack the platform</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on others' privacy or intellectual property rights</li>
              <li>Use automated bots or scripts without authorization</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Data Usage & Privacy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              Your use of the Service is also governed by our{' '}
              <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
              We collect and process Instagram data in accordance with Meta's policies and applicable
              data protection laws (GDPR, CCPA).
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              All content, features, and functionality of Insider Trends are owned by us and
              protected by copyright, trademark, and other intellectual property laws.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              Insider Trends is provided "as is" without warranties of any kind. We are not liable
              for any indirect, incidental, or consequential damages arising from your use of the Service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Termination</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              We reserve the right to suspend or terminate your access to the Service at any time
              for violations of these Terms or for any other reason at our sole discretion.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              We may update these Terms from time to time. Continued use of the Service after
              changes constitutes acceptance of the updated Terms.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>For questions about these Terms:</p>
            <ul>
              <li>Email: legal@insidertrends.com</li>
              <li>Support: support@insidertrends.com</li>
            </ul>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card mt-auto">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <img src="/logo.svg" alt="Insider" className="h-6 w-auto" />
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link to="/data-deletion" className="hover:text-foreground transition-colors">
                Data Deletion
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Insider. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
