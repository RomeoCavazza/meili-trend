import { Card } from '@/components/ui/card';

export default function Privacy() {
  return (
    <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-6">Politique de confidentialité</h1>
          
          <div className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Données collectées</h2>
              <p className="text-muted-foreground">
                Insider Trends collecte uniquement les données publiques Instagram via l'API officielle.
                Nous ne stockons pas de données personnelles sans consentement explicite.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Utilisation des données</h2>
              <p className="text-muted-foreground">
                Les données sont utilisées pour fournir des analyses de tendances et des fonctionnalités
                de recherche. Nous ne vendons ni ne partageons vos données avec des tiers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Cookies</h2>
              <p className="text-muted-foreground">
                Nous utilisons des cookies essentiels pour le fonctionnement du service.
                Aucun cookie de tracking tiers n'est utilisé.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Vos droits</h2>
              <p className="text-muted-foreground">
                Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression
                de vos données. Contactez-nous pour exercer ces droits.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Contact</h2>
              <p className="text-muted-foreground">
                Pour toute question concernant cette politique : contact@insider-trends.com
              </p>
            </section>
          </div>
        </Card>
      </main>
  );
}
