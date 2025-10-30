import { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Activity } from 'lucide-react';

export function HealthBadge() {
  const [status, setStatus] = useState<'checking' | 'healthy' | 'down'>('checking');

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '' : 'https://insidr-production.up.railway.app');
    
    const checkHealth = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/healthz`);
        setStatus(response.ok ? 'healthy' : 'down');
      } catch {
        setStatus('down');
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const getVariant = () => {
    switch (status) {
      case 'healthy': return 'secondary';
      case 'down': return 'destructive';
      default: return 'outline';
    }
  };

  const getText = () => {
    switch (status) {
      case 'healthy': return 'API OK';
      case 'down': return 'API Off';
      default: return 'Health...';
    }
  };

  return (
    <Badge
      variant={getVariant()}
      className="gap-1.5 text-xs"
      title={status === 'healthy' ? 'Backend opérationnel' : 'Backend non disponible'}
    >
      <Activity className="h-3 w-3" />
      {getText()}
    </Badge>
  );
}
