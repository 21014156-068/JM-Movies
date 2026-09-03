import React from 'react';
import { X, Play, Film, ExternalLink, Zap, Download } from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { ADSTERRA_TARGETED_CHANNELS, getRandomAdsterraLink, openAdsterraLink } from '../utils/adsterra';

export const TrailerModal: React.FC = () => {
  const { trailerMovie, setTrailerMovie } = useMovies();

  if (!trailerMovie || !trailerMovie.trailerKey) return null;

  const adsterraLink = getRandomAdsterraLink();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#05060f]/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl lg:max-w-6xl xl:max-w-7xl bg-[#0a0d1f]/95 border border-white/15 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 bg-white/[0.04] backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-300 flex items-center justify-center border border-amber-500/30 backdrop-blur-md">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <div className="text-base font-bold text-white flex items-center gap-2">
                <span>{trailerMovie.title}</span>
                <span className="text-xs font-normal text-zinc-400">({trailerMovie.releaseYear})</span>
              </div>
              <div className="text-xs text-amber-300 font-medium">Official Theatrical Trailer</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={adsterraLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => openAdsterraLink()}
              className="text-xs text-zinc-950 font-black px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20 hover:scale-105 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-zinc-950" />
              <span className="hidden sm:inline">Stream 4K Full Film</span>
              <span className="sm:hidden">4K Stream</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href={`https://www.youtube.com/watch?v=${trailerMovie.trailerKey}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-300 hover:text-white px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/10 transition-colors flex items-center gap-1.5 backdrop-blur-md"
            >
              <span>YouTube</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={() => setTrailerMovie(null)}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.1] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player IFrame */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${trailerMovie.trailerKey}?autoplay=1&rel=0&modestbranding=1`}
            title={`${trailerMovie.title} Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-none"
          />
        </div>

        {/* High-Converting Stream & Download Action Bar */}
        <div className="p-3.5 sm:p-4 bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-indigo-500/15 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Ready to watch full film? Official 4K Mirror &amp; High-Speed CDN are Live</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href={ADSTERRA_TARGETED_CHANNELS.STREAM_SERVER_1}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => openAdsterraLink(ADSTERRA_TARGETED_CHANNELS.STREAM_SERVER_1)}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-zinc-950" />
              <span>Stream Full Film (4K VIP)</span>
              <ExternalLink className="w-3 h-3 text-zinc-950" />
            </a>

            <a
              href={ADSTERRA_TARGETED_CHANNELS.FAST_DOWNLOAD_SERVER}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => openAdsterraLink(ADSTERRA_TARGETED_CHANNELS.FAST_DOWNLOAD_SERVER)}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 text-zinc-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download 1080p</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </a>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="p-4 bg-white/[0.03] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-300 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-white/[0.08] text-zinc-200 border border-white/10 font-mono text-[11px]">1080p HD</span>
            <span>Audio: Dolby Atmos</span>
            <span>•</span>
            <span>Director: {trailerMovie.director || 'Various'}</span>
          </div>

          <a
            href={adsterraLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => openAdsterraLink()}
            className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>⚡ High-Speed Direct Mirror (Adsterra 4K Server)</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </div>
  );
};

