import { Card } from '@/components/ui/card';

export default function Terms() {
  return (
    <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-6">Conditions d'utilisation</h1>
          
          <div className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptation des conditions</h2>
              <p className="text-muted-foreground">
                En utilisant Insider Trends, vous acceptez ces conditions d'utilisation dans leur intégralité.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Service fourni</h2>
              <p className="text-muted-foreground">
                Insider Trends est un service d'analyse de tendances sociales. Nous nous efforçons de
                fournir des données précises mais ne garantissons pas leur exactitude absolue.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Utilisation acceptable</h2>
              <p className="text-muted-foreground">
                Vous vous engagez à utiliser le service de manière légale et éthique.
                Toute tentative de manipulation ou d'abus du service est interdite.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Limitation de responsabilité</h2>
              <p className="text-muted-foreground">
                Insider Trends ne peut être tenu responsable des décisions prises sur la base
                des données fournies par le service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Modifications</h2>
              <p className="text-muted-foreground">
                Nous nous réservons le droit de modifier ces conditions à tout moment.
                Les utilisateurs seront notifiés des changements importants.
              </p>
            </section>
          </div>
        </Card>
      </main>
  );
}
