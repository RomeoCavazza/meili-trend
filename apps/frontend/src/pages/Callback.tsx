import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        return;
      }

      if (code && state) {
        try {
          // Stocker le token dans localStorage
          localStorage.setItem('instagram_auth_code', code);
          localStorage.setItem('instagram_auth_state', state);
          localStorage.setItem('instagram_authenticated', 'true');
          
          setStatus('success');
          
          // Rediriger vers la page de recherche après 2 secondes
          setTimeout(() => {
            navigate('/search');
          }, 2000);
        } catch (err) {
          console.error('Erreur callback:', err);
          setStatus('error');
        }
      } else {
        setStatus('error');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <h2 className="text-xl font-semibold">Authentification en cours...</h2>
            <p className="text-muted-foreground">Traitement de votre connexion Instagram</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="text-green-500 text-4xl">✅</div>
            <h2 className="text-xl font-semibold text-green-500">Authentification réussie !</h2>
            <p className="text-muted-foreground">Redirection vers la recherche...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="text-red-500 text-4xl">❌</div>
            <h2 className="text-xl font-semibold text-red-500">Erreur d'authentification</h2>
            <p className="text-muted-foreground">Une erreur est survenue lors de la connexion</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Retour à l'accueil
            </button>
          </>
        )}
      </div>
    </div>
  );
}
