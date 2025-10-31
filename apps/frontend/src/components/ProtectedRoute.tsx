import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Ne rediriger que si le loading est terminé ET qu'il n'y a pas de token
    if (!loading && !user) {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('🔒 ProtectedRoute: No token found, redirecting to /auth');
        // Sauvegarder la page demandée pour rediriger après login
        sessionStorage.setItem('redirectAfterLogin', location.pathname + location.search);
        navigate('/auth');
      } else {
        console.log('⚠️ ProtectedRoute: Token exists but no user. This might be a state sync issue.');
        // Token existe mais user est null - peut-être un problème de synchronisation
        // Attendre un peu pour laisser le temps au AuthContext de charger
      }
    }
  }, [user, loading, navigate, location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
