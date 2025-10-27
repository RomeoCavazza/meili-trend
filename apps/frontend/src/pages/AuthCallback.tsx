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

    if (token && userId && email && name) {
      // Sauvegarder les informations d'authentification
      localStorage.setItem('token', token);
      setToken(token);
      setUser({
        id: parseInt(userId),
        email: email,
        name: name,
        role: 'user',
        created_at: new Date().toISOString(),
        is_active: true
      });

      // Rediriger vers la page principale
      navigate('/analytics');
    } else {
      // En cas d'erreur, rediriger vers la page de connexion
      navigate('/auth');
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
