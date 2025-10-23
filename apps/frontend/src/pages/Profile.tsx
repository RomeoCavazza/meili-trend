import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, CreditCard, FileText, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const NOTES_STORAGE_KEY = 'insider_business_notes';

export default function Profile() {
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(NOTES_STORAGE_KEY);
    if (stored) setNotes(stored);
  }, []);

  const handleSaveNotes = () => {
    localStorage.setItem(NOTES_STORAGE_KEY, notes);
  };

  return (
    <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profil</h1>
          <p className="text-muted-foreground">
            Gérez vos informations et paramètres de compte.
          </p>
        </div>

        <div className="space-y-6">
          {/* User Info */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Informations</h2>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Nom</Label>
                <Input value="John Doe" disabled />
              </div>
              <div>
                <Label>Email</Label>
                <Input value="john@example.com" disabled />
              </div>
              <Badge variant="outline">Compte démo</Badge>
            </div>
          </Card>

          {/* Plans & Billing */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Plans & Facturation</h2>
            </div>
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                {['Starter', 'Pro', 'Enterprise'].map((plan, i) => (
                  <Card
                    key={plan}
                    className={`p-4 ${
                      i === 1 ? 'border-primary shadow-glow' : ''
                    }`}
                  >
                    <h3 className="font-semibold mb-2">{plan}</h3>
                    <p className="text-2xl font-bold mb-1">
                      {i === 0 ? '49€' : i === 1 ? '99€' : '249€'}
                      <span className="text-sm font-normal text-muted-foreground">
                        /mois
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      {i === 0
                        ? '1000 recherches/mois'
                        : i === 1
                        ? '10000 recherches/mois'
                        : 'Illimité'}
                    </p>
                    <Button
                      variant={i === 1 ? 'default' : 'outline'}
                      className={i === 1 ? 'gradient-primary w-full' : 'w-full'}
                      disabled
                    >
                      {i === 1 ? 'Plan actuel' : 'Choisir'}
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </Card>

          {/* Bank Details */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Données bancaires</h2>
            </div>
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Désactivé pour le MVP — affichage démo uniquement. Aucune donnée réelle n'est stockée.
              </AlertDescription>
            </Alert>
            <div className="space-y-4 opacity-50">
              <div>
                <Label>Numéro de carte</Label>
                <Input value="**** **** **** 1234" disabled />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date d'expiration</Label>
                  <Input value="12/25" disabled />
                </div>
                <div>
                  <Label>CVV</Label>
                  <Input value="***" disabled />
                </div>
              </div>
            </div>
          </Card>

          {/* Business Notes */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Business Plan / Notes</h2>
            </div>
            <div className="space-y-4">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notez vos idées, stratégies, objectifs..."
                rows={8}
                className="resize-none"
              />
              <Button onClick={handleSaveNotes} className="gradient-primary">
                Enregistrer les notes
              </Button>
            </div>
          </Card>
        </div>
      </main>
  );
}
