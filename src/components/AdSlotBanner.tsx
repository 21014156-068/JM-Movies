import React, { useState } from 'react';
import { Sparkles, Film, ExternalLink, Zap, Tv, ShieldCheck, Download, Star } from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { getRandomAdsterraLink, openAdsterraLink } from '../utils/adsterra';

export interface AdSlotBannerProps {
  placement: 'leaderboard' | 'medium-rectangle' | 'in-feed' | 'sticky-bottom' | 'sponsored-stream-button';
  className?: string;
  adsterraScriptSnippet?: string;
}

/**
 * AdSlotBanner: High-CTR monetization banner connected directly to your Adsterra direct links.
 */
export const AdSlotBanner: React.FC<AdSlotBannerProps> = ({
  placement,
  className = '',
  adsterraScriptSnippet
}) => {
  const { setActiveTab } = useMovies();

  // If a custom script is provided, render the container
  if (adsterraScriptSnippet) {
    return (
      <div 
        className={`w-full overflow-hidden flex items-center justify-center bg-black/40 rounded-2xl border border-white/10 ${className}`}
        dangerouslySetInnerHTML={{ __html: adsterraScriptSnippet }}
      />
    );
  }

  // 1. Wide Leaderboard format (e.g. 728x90 / responsive header / modal footer)
  if (placement === 'leaderboard') {
    const targetLink = getRandomAdsterraLink();
    return (
      <div className={`w-full p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-indigo-600/15 border border-amber-400/30 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl relative overflow-hidden ${className}`}>
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0 text-amber-300 shadow-inner">
            <Zap className="w-6 h-6 text-amber-400 fill-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Featured Sponsor
              </span>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30 font-mono">
                Ultra HD Server
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white mt-0.5">
              Stream in 4K Ultra HD & High-Speed Mirror
            </h4>
            <p className="text-xs text-zinc-300">
              Access high-speed movie mirrors, exclusive premiere feeds, and unlimited bandwidth streams.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <a
            href={targetLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => openAdsterraLink()}
            className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs sm:text-sm shadow-md shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 text-center"
          >
            <span>⚡ Access 4K Stream</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => {
              setActiveTab('roulette');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex-1 sm:flex-initial px-4 py-3 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 text-white font-semibold text-xs transition-all hover:scale-105 cursor-pointer text-center"
          >
            🎰 Spin Reel
          </button>
        </div>
      </div>
    );
  }

  // 2. Medium Rectangle format (300x250 / sidebar widget / quiz panel)
  if (placement === 'medium-rectangle') {
    const targetLink = getRandomAdsterraLink();
    return (
      <div className={`w-full p-5 rounded-3xl bg-gradient-to-b from-purple-900/30 via-black/50 to-indigo-950/40 border border-purple-400/30 backdrop-blur-xl space-y-4 shadow-xl relative overflow-hidden ${className}`}>
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-purple-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Sponsored Stream
          </span>
          <span className="text-[10px] text-purple-300 font-mono px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/30">
            Ad
          </span>
        </div>

        <div className="space-y-1.5">
          <h4 className="font-bold text-white text-base leading-tight">
            Unlock High-Speed 4K Cinema Stream
          </h4>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Get instant access to cloud streaming servers with 0 buffering and multi-language audio tracks.
          </p>
        </div>

        <div className="pt-2">
          <a
            href={targetLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => openAdsterraLink()}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 text-center"
          >
            <span>🚀 Open 4K Stream Link</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  // 3. In-Feed native card format (blends seamlessly into movie explore grid)
  if (placement === 'in-feed') {
    const targetLink = getRandomAdsterraLink();
    return (
      <div className={`p-5 rounded-3xl bg-gradient-to-br from-amber-500/20 via-purple-600/15 to-indigo-900/30 border border-amber-400/40 backdrop-blur-xl flex flex-col justify-between shadow-2xl relative group overflow-hidden ${className}`}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-xl bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider border border-amber-400/30">
              Sponsored Cinema Partner
            </span>
            <span className="text-[10px] text-zinc-300 font-mono">Verified HD</span>
          </div>

          <h3 className="text-lg font-black text-white leading-tight">
            Direct High-Speed Movie Download & 4K Mirror
          </h3>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Watch trending blockbusters, classic film archives, and upcoming 2026 releases in ultra-high resolution.
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2">
          <a
            href={targetLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => openAdsterraLink()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black text-xs shadow-md transition-all group-hover:scale-105 cursor-pointer flex items-center justify-center gap-1.5 text-center"
          >
            <span>⚡ Start Fast Stream</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }

  // 5. Sponsored Stream Button format
  if (placement === 'sponsored-stream-button') {
    const targetLink = getRandomAdsterraLink();
    return (
      <a
        href={targetLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => openAdsterraLink()}
        className={`px-5 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${className}`}
      >
        <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
        <span>⚡ Server 2: Fast 4K Mirror [Sponsored]</span>
        <ExternalLink className="w-3.5 h-3.5 text-purple-200" />
      </a>
    );
  }

  // 4. Sticky Bottom Bar
  const bottomLink = getRandomAdsterraLink();
  return (
    <div className={`fixed bottom-4 left-4 right-4 max-w-2xl mx-auto z-30 p-3 rounded-2xl bg-[#0a0d1f]/95 border border-amber-400/30 backdrop-blur-2xl shadow-2xl flex items-center justify-between gap-3 text-xs ${className}`}>
      <div className="flex items-center gap-2 truncate">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <span className="text-white font-semibold truncate">
          Looking for full HD movies? Try 4K Stream Partner
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <a
          href={bottomLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => openAdsterraLink()}
          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold transition-all flex items-center gap-1 cursor-pointer"
        >
          <span>⚡ 4K Mirror</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

