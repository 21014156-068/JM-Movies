import React from 'react';
import { Film, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { SEOKeywordsIndex } from './SEOKeywordsIndex';

export const Footer: React.FC = () => {
  const { setActiveTab, setAiConciergeOpen } = useMovies();

  return (
    <footer className="bg-white/[0.02] border-t border-white/10 text-zinc-300 text-xs py-12 backdrop-blur-md">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 space-y-12">
        
        {/* Keyword Index Section */}
        <SEOKeywordsIndex />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* Brand */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-zinc-950 shadow-md shadow-amber-500/20">
                <Film className="w-4 h-4" />
              </div>
              <span className="text-lg font-black text-white uppercase tracking-wider">
                Jamal Cinema Studio
              </span>
            </div>
            <p className="text-zinc-400 max-w-md text-xs leading-relaxed">
              Open public cinema portal powered by TMDB global catalog, upcoming 2026 previews, verified public domain streaming, and Google Gemini AI movie concierge.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-zinc-300">
            <button onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-400 transition-colors cursor-pointer">
              Home
            </button>
            <button onClick={() => { setActiveTab('upcoming'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-amber-400 transition-colors cursor-pointer">
              Upcoming Premieres
            </button>
            <button onClick={() => { setActiveTab('public-domain'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-emerald-400 transition-colors cursor-pointer">
              Watch Free Classics
            </button>
            <a href="/sitemap-movies.xml" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 text-zinc-400 transition-colors">
              Movie Sitemap
            </a>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 text-zinc-400 transition-colors">
              XML Index
            </a>
            <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 text-zinc-400 transition-colors">
              Robots.txt
            </a>
            <button onClick={() => setAiConciergeOpen(true)} className="hover:text-amber-400 text-amber-300/90 transition-colors cursor-pointer flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Vibe Matcher</span>
            </button>
          </div>

        </div>

        {/* Legal & Compliance Notice */}
        <div className="pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] text-zinc-400">
          <div className="space-y-1">
            <div className="text-zinc-200 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              TMDB API Attribution & Compliance
            </div>
            <p>
              This product uses the TMDB API but is not endorsed or certified by TMDB. All movie posters, cast metadata, and plot synopses are provided under TMDB terms for educational and portfolio demonstration.
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-zinc-200 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Public Domain Video Provenance
            </div>
            <p>
              All streamable full-length motion pictures in our Public Domain Cinema collection are verified open-license and hosted legally through the Internet Archive open film library.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-zinc-400 text-[11px] gap-2 border-t border-white/5">
          <div>
            © {new Date().getFullYear()} Jamal Movies Studio. Public Cinema Discovery.
          </div>
          <div className="flex items-center gap-1.5 text-amber-300/80">
            <Sparkles className="w-3 h-3" />
            <span>Frosted Glass Edition</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
