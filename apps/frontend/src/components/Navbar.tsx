import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
  const isProfileActive = location.pathname === '/profile';

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo.svg" alt="Insider" className="h-8 w-auto" />
          </Link>

          {/* Desktop Navigation - LEFT ALIGNED with spacing */}
          <nav className="hidden lg:flex items-center gap-6 ml-8">
            {(user ? authenticatedNavItems : publicNavItems).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm transition-all ${
                  isActive(item.path)
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Spacer */}
          <div className="hidden lg:block flex-1" />

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <Link to="/profile" className={`text-sm transition-all ${
                isProfileActive
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}>
                Profile
              </Link>
            ) : (
              <Button size="sm" asChild>
                <Link to="/auth">Get started</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background">
            <nav className="flex flex-col py-4 px-4 gap-1">
              {(user ? authenticatedNavItems : publicNavItems).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 px-4 text-sm transition-colors ${
                    isActive(item.path)
                      ? 'text-white font-medium'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {user && (
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 px-4 text-sm transition-colors ${
                    isProfileActive
                      ? 'text-white font-medium'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Profile
                </Link>
              )}
              {!user && (
                <Button size="sm" asChild className="mt-2">
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>Get started</Link>
                </Button>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
