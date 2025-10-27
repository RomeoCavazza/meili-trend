import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground mt-2">Last updated: January 22, 2025</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Data Collection</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              Insider Trends ("we", "our", or "us") collects and processes Instagram public data through
              authorized Meta Graph API endpoints. We only collect data you explicitly authorize us to access.
            </p>
            <h4>Data We Collect:</h4>
            <ul>
              <li>Public Instagram posts and hashtag data</li>
              <li>Page metadata (likes, followers, engagement metrics)</li>
              <li>User-generated content on connected Pages (comments, ratings)</li>
              <li>Account profile information (username, bio, profile picture)</li>
              <li>Analytics insights (aggregated and anonymized)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. How We Use Your Data</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>We use collected data to:</p>
            <ul>
              <li>Provide trend intelligence and analytics services</li>
              <li>Generate insights for marketing and advertising purposes</li>
              <li>Improve our application and user experience</li>
              <li>Aggregate and anonymize data for research purposes</li>
            </ul>
            <p className="font-semibold mt-4">
              We do NOT use your data for individual profiling or re-identification purposes.
              All analytics insights are aggregated, de-identified, and anonymized.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Data Storage & Security</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              We implement industry-standard security measures to protect your data:
            </p>
            <ul>
              <li>Encrypted data transmission (HTTPS/TLS)</li>
              <li>Secure cloud infrastructure with access controls</li>
              <li>Regular security audits and updates</li>
              <li>Limited data retention (90 days default)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Third-Party Services</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              We integrate with Meta's Instagram Graph API and comply with Meta's Platform Terms
              and Developer Policies. We do not share your personal data with third parties
              except as required to provide our services or comply with legal obligations.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Your Rights (GDPR Compliance)</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>You have the right to:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of your data</li>
              <li><strong>Rectification:</strong> Correct inaccurate data</li>
              <li><strong>Erasure:</strong> Request deletion of your data</li>
              <li><strong>Restriction:</strong> Limit processing of your data</li>
              <li><strong>Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Objection:</strong> Object to data processing</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, visit our{' '}
              <a href="/data-deletion" className="text-primary hover:underline">
                Data Deletion page
              </a>{' '}
              or contact us at privacy@insidertrends.com
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              For privacy-related questions or concerns:
            </p>
            <ul>
              <li>Email: privacy@insidertrends.com</li>
              <li>Data Deletion Requests: <a href="/data-deletion" className="text-primary hover:underline">/data-deletion</a></li>
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
