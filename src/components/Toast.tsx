import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useMovies } from '../context/MovieContext';

export const Toast: React.FC = () => {
  const { toasts, removeToast } = useMovies();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => {
        let icon = <Info className="w-4 h-4 text-sky-300 shrink-0" />;
        let borderClass = 'border-white/15 bg-[#0a0d1f]/95 text-zinc-100';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
          borderClass = 'border-emerald-500/30 bg-[#0a0d1f]/95 text-emerald-100';
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
          borderClass = 'border-rose-500/30 bg-[#0a0d1f]/95 text-rose-100';
        } else if (toast.type === 'warning') {
          icon = <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />;
          borderClass = 'border-amber-500/30 bg-[#0a0d1f]/95 text-amber-100';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border ${borderClass} shadow-2xl backdrop-blur-2xl flex items-center justify-between gap-3 text-xs sm:text-sm animate-in slide-in-from-bottom-5 duration-200`}
          >
            <div className="flex items-center gap-2.5">
              {icon}
              <span className="font-medium text-white">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.1] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
