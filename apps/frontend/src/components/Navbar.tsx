import { Link, useLocation } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export function Navbar() {
  const { user } = useAuth();
  const location = useLocation();

  // Navigation pour utilisateurs non-connectés
  const publicNavItems = [
    { path: '/', label: 'Product' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/enterprise', label: 'Enterprise' },
    { path: '/docs', label: 'Docs' },
  ];

        // Navigation pour utilisateurs connectés
        const authenticatedNavItems = [
          { path: '/search', label: 'Search' },
          { path: '/watchlist', label: 'Watchlist' },
          { path: '/analytics', label: 'Analytics' },
        ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Insider</span>
          </Link>

          {/* Navigation principale - déplacée à droite du logo */}
          <nav className="hidden md:flex items-center gap-6">
            {(user ? authenticatedNavItems : publicNavItems).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Spacer pour pousser les actions à droite */}
          <div className="flex-1" />

          {/* Actions utilisateur */}
          <div className="flex items-center gap-3">
                   {user ? (
                     <>
                       {/* Profile */}
                       <Link to="/profile" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                         Profile
                       </Link>
                       {/* Sign Out */}
                       <Button 
                         size="sm" 
                         variant="outline"
                         onClick={() => {
                           localStorage.removeItem('token');
                           window.location.href = '/';
                         }}
                       >
                         Sign Out
                       </Button>
                     </>
                   ) : (
                     <>
                       <Link
                         to="/auth"
                         className="text-sm text-foreground hover:text-primary hover:font-bold transition-all"
                       >
                         Log in
                       </Link>
                       <Button size="sm" asChild>
                         <Link to="/auth">Get started</Link>
                       </Button>
                     </>
                   )}
                 </div>
        </div>

        {/* Mobile Navigation */}
        {user && (
          <nav className="flex border-t border-border md:hidden">
            {authenticatedNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex-1 flex items-center justify-center py-3 text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-primary bg-accent'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
