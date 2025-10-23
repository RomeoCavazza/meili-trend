import { Link } from 'react-router-dom';
import { HealthBadge } from './HealthBadge';

export function Footer() {
  const legalLinks = [
    { path: '/privacy', label: 'Confidentialité' },
    { path: '/terms', label: 'Conditions' },
    { path: '/data-deletion', label: 'Suppression des données' },
    { path: '/review', label: 'App Review' },
  ];

  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © 2025 Insider Trends. Analyse de tendances sociales.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
              <p className="text-xs text-muted-foreground">
                Instagram · TikTok · X · API Direct
              </p>
              <HealthBadge />
            </div>
          </div>

          <nav className="flex flex-wrap justify-center gap-4">
            {legalLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className="text-sm text-muted-foreground transition-smooth hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
