import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser, setToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('user_id');
    const email = searchParams.get('email');
    const name = searchParams.get('name');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    console.log('📥 AuthCallback - Paramètres reçus:', { 
      hasToken: !!token, 
      hasUserId: !!userId, 
      hasEmail: !!email,
      hasName: !!name,
      error,
      errorDescription
    });

    // Gérer les erreurs OAuth
    if (error) {
      console.error('❌ OAuth error:', error, errorDescription);
      // TODO: Afficher un toast d'erreur si disponible
      navigate('/auth?error=' + encodeURIComponent(errorDescription || error));
      return;
    }

    // Si on a un token, récupérer les infos utilisateur depuis le backend
    if (token) {
      // Décoder le token si nécessaire (il est URL-encodé)
      const decodedToken = decodeURIComponent(token);
      localStorage.setItem('token', decodedToken);
      setToken(decodedToken);
      
      // Récupérer les infos utilisateur depuis l'API pour s'assurer qu'elles sont à jour
      const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : 'https://insidr-production.up.railway.app');
      
      fetch(`${API_BASE}/api/v1/auth/me`, {
        headers: {
          'Authorization': `Bearer ${decodedToken}`
        }
      })
        .then(response => {
          if (!response.ok) {
            console.error('❌ /api/v1/auth/me failed:', response.status, response.statusText);
            return response.text().then(text => {
              console.error('Response body:', text);
              throw new Error(`HTTP ${response.status}: ${text}`);
            });
          }
          return response.json();
        })
        .then((userData) => {
          console.log('✅ User data received:', userData);
          setUser(userData);
          // Attendre un peu plus pour que le state soit mis à jour avant redirection
          // Utiliser window.location.href pour forcer un rechargement complet
          setTimeout(() => {
            console.log('🚀 Redirection vers /analytics');
            window.location.href = '/analytics';
          }, 300);
        })
        .catch((error) => {
          console.error('❌ Error fetching user info:', error);
          // Fallback: utiliser les paramètres URL si disponibles
          if (userId && email) {
            const decodedEmail = email ? decodeURIComponent(email) : '';
            const decodedName = name ? decodeURIComponent(name) : '';
            setUser({
              id: parseInt(userId),
              email: decodedEmail,
              name: decodedName || decodedEmail.split('@')[0],
              role: 'user',
              created_at: new Date().toISOString(),
              is_active: true
            });
            setTimeout(() => {
              console.log('🚀 Redirection vers /analytics (fallback)');
              window.location.href = '/analytics';
            }, 300);
          } else {
            console.error('❌ Missing userId/email for fallback');
            navigate('/auth?error=invalid_token');
          }
        });
    } else if (userId && email) {
      // Fallback: utiliser les paramètres URL si le token n'est pas dans l'URL
      // (cas où on stocke le token différemment)
      const decodedEmail = decodeURIComponent(email);
      const decodedName = name ? decodeURIComponent(name) : '';
      setUser({
        id: parseInt(userId),
        email: decodedEmail,
        name: decodedName || decodedEmail.split('@')[0],
        role: 'user',
        created_at: new Date().toISOString(),
        is_active: true
      });
      setTimeout(() => {
        console.log('🚀 Redirection vers /analytics (fallback userId)');
        window.location.href = '/analytics';
      }, 300);
    } else {
      // En cas d'erreur, rediriger vers la page de connexion
      console.error('Missing required parameters:', { token, userId, email });
      navigate('/auth?error=missing_params');
    }
  }, [searchParams, navigate, setUser, setToken]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Connexion en cours...</p>
      </div>
    </div>
  );
}
