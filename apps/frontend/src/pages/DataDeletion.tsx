import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Trash2, Shield } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function DataDeletion() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8">
        <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Data Deletion Request</h1>
          <p className="text-muted-foreground mt-2">
            Request deletion of your personal data from Insider Trends
          </p>
        </div>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertTitle>Your Data Rights</AlertTitle>
          <AlertDescription>
            In compliance with GDPR and privacy regulations, you have the right to request deletion
            of your personal data. This process typically takes 30 days to complete.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>What Will Be Deleted</CardTitle>
            <CardDescription>
              Submitting this request will permanently delete the following data:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Trash2 className="h-4 w-4 text-destructive mt-0.5" />
                <span>Your account profile and authentication data</span>
              </li>
              <li className="flex items-start gap-2">
                <Trash2 className="h-4 w-4 text-destructive mt-0.5" />
                <span>Connected Instagram Business accounts and Pages</span>
              </li>
              <li className="flex items-start gap-2">
                <Trash2 className="h-4 w-4 text-destructive mt-0.5" />
                <span>Saved searches and watchlist preferences</span>
              </li>
              <li className="flex items-start gap-2">
                <Trash2 className="h-4 w-4 text-destructive mt-0.5" />
                <span>Generated analytics reports and insights</span>
              </li>
              <li className="flex items-start gap-2">
                <Trash2 className="h-4 w-4 text-destructive mt-0.5" />
                <span>Usage logs and activity history</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Deletion Request Form</CardTitle>
            <CardDescription>
              Fill out this form to request deletion of your data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter the email associated with your Insider Trends account
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="user-id" className="text-sm font-medium">
                  User ID (Optional)
                </label>
                <Input
                  id="user-id"
                  type="text"
                  placeholder="Found in your profile settings"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="reason" className="text-sm font-medium">
                  Reason for Deletion (Optional)
                </label>
                <Textarea
                  id="reason"
                  placeholder="Help us improve by sharing why you're leaving..."
                  rows={4}
                />
              </div>

              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Warning: This action is irreversible</AlertTitle>
                <AlertDescription>
                  Once your data is deleted, it cannot be recovered. You will need to create
                  a new account to use Insider Trends again.
                </AlertDescription>
              </Alert>

              <div className="flex gap-3">
                <Button type="submit" variant="destructive" className="flex-1">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Request Data Deletion
                </Button>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alternative Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Download Your Data</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Before deleting, you can request a copy of your data in JSON format
              </p>
              <Button variant="outline" size="sm">
                Request Data Export
              </Button>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Disconnect Instagram Only</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Remove Instagram access without deleting your Insider Trends account
              </p>
              <Button variant="outline" size="sm">
                Go to Profile Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Questions or Issues?</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              If you need assistance with your data deletion request or have questions about
              our data practices:
            </p>
            <ul>
              <li>Email: <a href="mailto:privacy@insidertrends.com" className="text-primary">privacy@insidertrends.com</a></li>
              <li>Support: <a href="mailto:support@insidertrends.com" className="text-primary">support@insidertrends.com</a></li>
            </ul>
            <p className="text-xs text-muted-foreground mt-4">
              Data deletion requests are processed within 30 days in accordance with GDPR and
              applicable data protection regulations. You will receive a confirmation email
              once the deletion is complete.
            </p>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
