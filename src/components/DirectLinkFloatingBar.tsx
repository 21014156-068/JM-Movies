import React, { useState } from 'react';
import { Zap, Download, ExternalLink, ChevronDown, ChevronUp, Radio, Sparkles } from 'lucide-react';
import { ADSTERRA_TARGETED_CHANNELS, openAdsterraLink } from '../utils/adsterra';

export const DirectLinkFloatingBar: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <aside 
      aria-label="High Speed Cinema Streaming Mirrors"
      className="fixed bottom-4 sm:bottom-6 right-3 sm:right-6 z-40 max-w-[calc(100vw-24px)] sm:max-w-md select-none transition-all duration-300"
    >
      {isMinimized ? (
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs shadow-2xl shadow-amber-500/30 border border-amber-300/40 backdrop-blur-xl transition-all hover:scale-105 active:scale-95 cursor-pointer animate-bounce"
        >
          <Zap className="w-3.5 h-3.5 fill-zinc-950" />
          <span>⚡ Fast 4K VIP Mirrors</span>
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
      ) : (
        <div className="relative p-3.5 sm:p-4 rounded-3xl bg-[#0a0d1f]/95 border border-amber-500/40 shadow-[0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-white space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div className="flex items-center gap-1.5 text-xs font-black text-white">
                <Radio className="w-3.5 h-3.5 text-amber-400" />
                <span>4K VIP Streaming &amp; Mirror Network</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold">
                12ms Ultra CDN
              </span>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                title="Minimize Mirror Bar"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-[11px] text-zinc-300 leading-snug">
            Stream latest blockbusters in 4K HDR or access high-speed direct downloads with zero buffer delays.
          </p>

          {/* High Converting Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={ADSTERRA_TARGETED_CHANNELS.FLOATING_VIP_MIRROR}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => openAdsterraLink(ADSTERRA_TARGETED_CHANNELS.FLOATING_VIP_MIRROR)}
              className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer group"
            >
              <Zap className="w-3.5 h-3.5 fill-zinc-950 group-hover:rotate-12 transition-transform" />
              <span>Stream 4K VIP</span>
              <ExternalLink className="w-3 h-3 text-zinc-900" />
            </a>

            <a
              href={ADSTERRA_TARGETED_CHANNELS.DIRECT_4K_DOWNLOAD}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => openAdsterraLink(ADSTERRA_TARGETED_CHANNELS.DIRECT_4K_DOWNLOAD)}
              className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-purple-600/25 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer group"
            >
              <Download className="w-3.5 h-3.5 text-amber-300 group-hover:translate-y-0.5 transition-transform" />
              <span>Fast Download</span>
              <ExternalLink className="w-3 h-3 text-purple-200" />
            </a>
          </div>

          <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono pt-1">
            <span className="flex items-center gap-1 text-amber-400/90 font-bold">
              <Sparkles className="w-3 h-3" />
              Official Verified Partners
            </span>
            <span>Ad-Free 60FPS</span>
          </div>
        </div>
      )}
    </aside>
  );
};
