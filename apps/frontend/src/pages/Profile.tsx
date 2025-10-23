import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, CreditCard, FileText, AlertCircle, LogIn } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { login, register, getMe } from '@/lib/api';
import { toast } from 'sonner';

const NOTES_STORAGE_KEY = 'insider_business_notes';

export default function Profile() {
  const [notes, setNotes] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '', name: '' });

  useEffect(() => {
    const stored = localStorage.getItem(NOTES_STORAGE_KEY);
    if (stored) setNotes(stored);
    
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsLoggedIn(true);
      getMe(token).then(setUser).catch(() => {
        localStorage.removeItem('access_token');
        setIsLoggedIn(false);
      });
    }
  }, []);

  const handleSaveNotes = () => {
    localStorage.setItem(NOTES_STORAGE_KEY, notes);
    toast.success('Notes sauvegardées');
  };

  const handleLogin = async () => {
    try {
      const result = await login(loginData.email, loginData.password);
      localStorage.setItem('access_token', result.access_token);
      setIsLoggedIn(true);
      setUser(result.user);
      setShowLogin(false);
      toast.success('Connexion réussie');
    } catch (error) {
      toast.error('Erreur de connexion');
    }
  };

  const handleRegister = async () => {
    try {
      const result = await register(loginData.email, loginData.password, loginData.name);
      localStorage.setItem('access_token', result.access_token);
      setIsLoggedIn(true);
      setUser(result.user);
      setShowLogin(false);
      toast.success('Inscription réussie');
    } catch (error) {
      toast.error('Erreur d\'inscription');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
    setUser(null);
    toast.success('Déconnexion réussie');
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
            
            {isLoggedIn && user ? (
              <div className="space-y-4">
                <div>
                  <Label>Nom</Label>
                  <Input value={user.name || 'Non défini'} disabled />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={user.email} disabled />
                </div>
                <div>
                  <Label>Rôle</Label>
                  <Input value={user.role} disabled />
                </div>
                <Badge variant="outline">Compte connecté</Badge>
                <Button onClick={handleLogout} variant="outline" className="w-full">
                  Se déconnecter
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {!showLogin ? (
                  <div className="text-center py-8">
                    <LogIn className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">Connectez-vous pour accéder à votre profil</p>
                    <Button onClick={() => setShowLogin(true)} className="gradient-primary">
                      Se connecter / S'inscrire
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label>Email</Label>
                      <Input 
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        placeholder="votre@email.com"
                      />
                    </div>
                    <div>
                      <Label>Mot de passe</Label>
                      <Input 
                        type="password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <Label>Nom (optionnel)</Label>
                      <Input 
                        value={loginData.name}
                        onChange={(e) => setLoginData({...loginData, name: e.target.value})}
                        placeholder="Votre nom"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleLogin} className="flex-1">
                        Se connecter
                      </Button>
                      <Button onClick={handleRegister} variant="outline" className="flex-1">
                        S'inscrire
                      </Button>
                    </div>
                    <Button onClick={() => setShowLogin(false)} variant="ghost" className="w-full">
                      Annuler
                    </Button>
                  </div>
                )}
              </div>
            )}
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
