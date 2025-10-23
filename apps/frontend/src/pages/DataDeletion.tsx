import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export default function DataDeletion() {
  return (
    <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
      <Card className="p-8">
        <h1 className="text-3xl font-bold mb-6">Suppression des données</h1>
        
        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">Vos droits</h2>
            <p className="text-muted-foreground">
              Conformément au RGPD, vous avez le droit de demander la suppression de toutes
              vos données personnelles stockées par Insider Trends.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Données concernées</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Informations de compte</li>
              <li>Historique de recherches</li>
              <li>Listes de veille personnalisées</li>
              <li>Notes et préférences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Procédure</h2>
            <p className="text-muted-foreground mb-4">
              Pour demander la suppression de vos données, cliquez sur le bouton ci-dessous.
              La suppression sera effective sous 30 jours maximum.
            </p>
            <Button variant="destructive" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Demander la suppression de mes données
            </Button>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Important</h2>
            <p className="text-muted-foreground">
              La suppression de vos données est irréversible. Votre compte sera désactivé
              et vous ne pourrez plus accéder au service avec les mêmes identifiants.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Contact</h2>
            <p className="text-muted-foreground">
              Questions ? Contactez-nous : privacy@insider-trends.com
            </p>
          </section>
        </div>
      </Card>
    </main>
  );
}
