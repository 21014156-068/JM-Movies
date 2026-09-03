import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';
import { useMovies } from '../context/MovieContext';

export const KeyboardShortcutsModal: React.FC = () => {
  const { isShortcutsOpen, setShortcutsOpen } = useMovies();

  if (!isShortcutsOpen) return null;

  const shortcuts = [
    { key: '/', label: 'Quick Search', desc: 'Focus TMDB & Public Domain search bar instantly' },
    { key: 'W', label: 'Watchlist', desc: 'Open your saved movies and shareable queue' },
    { key: '?', label: 'Help Guide', desc: 'Toggle this keyboard shortcuts cheat sheet' },
    { key: 'Esc', label: 'Close / Back', desc: 'Close any active modal, player, or trailer' },
    { key: 'L', label: 'Cinema Lights', desc: 'Toggle lights-off theater mode in streaming player' },
    { key: 'Space', label: 'Play / Pause', desc: 'Toggle playback in video player' },
    { key: 'F', label: 'Fullscreen', desc: 'Enter / exit fullscreen in streaming player' },
    { key: 'M', label: 'Mute Audio', desc: 'Toggle sound on or off' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#090c1e] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-white">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-amber-500/10 to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight text-white">Keyboard Shortcuts</h2>
              <p className="text-[11px] text-zinc-400">Navigate Jamal Movies like a cinema pro</p>
            </div>
          </div>
          <button
            onClick={() => setShortcutsOpen(false)}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-6 space-y-3">
          {shortcuts.map((s, idx) => (
            <div
              key={`sc-${idx}`}
              className="flex items-center justify-between py-2 border-b border-white/[0.06] last:border-0 text-xs"
            >
              <div className="space-y-0.5">
                <div className="font-bold text-white">{s.label}</div>
                <div className="text-zinc-400 text-[11px]">{s.desc}</div>
              </div>
              <kbd className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/20 text-amber-300 font-mono text-xs shadow-inner shrink-0">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-white/[0.02] border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
          <span>Press <strong>Esc</strong> to close</span>
          <button
            onClick={() => setShortcutsOpen(false)}
            className="text-amber-400 hover:underline cursor-pointer font-medium"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
