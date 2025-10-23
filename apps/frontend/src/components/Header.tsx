import { Link, useLocation } from 'react-router-dom';
import { Search, TrendingUp, Eye, User, Instagram, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';

export function Header() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('instagram_authenticated');
      setIsAuthenticated(auth === 'true');
    };
    
    checkAuth();
    
    // Écouter les changements de localStorage
    window.addEventListener('storage', checkAuth);
    
    // Re-vérifier toutes les secondes
    const interval = setInterval(checkAuth, 1000);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('instagram_authenticated');
    localStorage.removeItem('instagram_auth_code');
    localStorage.removeItem('instagram_auth_state');
    setIsAuthenticated(false);
  };

  const navItems = [
    { path: '/search', label: 'Recherche', icon: Search },
    { path: '/explore', label: 'Explorer', icon: TrendingUp },
    { path: '/watch', label: 'Ma veille', icon: Eye },
    { path: '/profile', label: 'Profil', icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 transition-smooth hover:opacity-80">
          <img src="/logo.png" alt="Insider" className="h-10 w-10" />
          <span className="text-xl font-bold">Insider</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path}>
              <Button
                variant={location.pathname === path ? 'secondary' : 'ghost'}
                size="sm"
                className="gap-2"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            </Link>
          ))}
        </nav>

        {isAuthenticated ? (
          <button 
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 hover:shadow-lg"
          >
            <LogOut className="h-4 w-4" />
            Déconnecter
          </button>
        ) : (
          <a 
            href="/auth/instagram/start" 
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 hover:shadow-lg"
          >
            <Instagram className="h-4 w-4" />
            Connecter Instagram
          </a>
        )}
      </div>

      {/* Mobile nav */}
      <nav className="flex border-t border-border md:hidden">
        {navItems.map(({ path, label, icon: Icon }) => (
          <Link key={path} to={path} className="flex-1">
            <Button
              variant={location.pathname === path ? 'secondary' : 'ghost'}
              size="sm"
              className="w-full gap-1 rounded-none"
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs">{label}</span>
            </Button>
          </Link>
        ))}
      </nav>
    </header>
  );
}
