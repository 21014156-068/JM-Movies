import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showBackOnline, setShowBackOnline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowBackOnline(true);
      setTimeout(() => setShowBackOnline(false), 4000);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowBackOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (showBackOnline) {
    return (
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-emerald-500/90 text-zinc-950 font-bold px-3 py-2 text-xs shadow-2xl backdrop-blur-md border border-emerald-400/40 animate-in slide-in-from-bottom-3">
        <Wifi className="w-4 h-4" />
        <span>Connected — Back online</span>
      </div>
    );
  }

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500/95 text-zinc-950 font-bold px-3.5 py-2 text-xs shadow-2xl backdrop-blur-md border border-amber-400 animate-pulse">
      <WifiOff className="w-4 h-4" />
      <span>Offline Mode — Using cached cinema catalog</span>
    </div>
  );
};
