import React, { useState, useEffect, useRef } from 'react';
import { 
  Film, 
  Search, 
  Sparkles, 
  Menu, 
  X, 
  Tv, 
  Calendar,
  Compass,
  RotateCw,
  Swords,
  HelpCircle,
  Zap,
  ExternalLink,
  Bookmark,
  Keyboard,
  Clapperboard
} from 'lucide-react';
import { useMovies, TabType } from '../context/MovieContext';
import { Movie } from '../types';
import { ADSTERRA_TARGETED_CHANNELS, openAdsterraLink } from '../utils/adsterra';
import { PWAInstallButton } from './PWAInstallButton';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setAiConciergeOpen, 
    openMovieDetails,
    watchlist,
    setWatchlistOpen,
    setShortcutsModalOpen
  } = useMovies();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Quick live search debounce via TMDB search API
  useEffect(() => {
    if (!localSearch.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/movies/search?q=${encodeURIComponent(localSearch)}&limit=6`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.movies || data.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [localSearch]);

  const handleNavClick = (tab: TabType) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#05060f]/90 backdrop-blur-2xl border-b border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] py-3' 
          : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent py-4'
      }`}
    >
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 flex items-center justify-between gap-3">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6 lg:gap-8">
          <button 
            id="nav-brand-logo"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform border border-amber-300/30">
              <Film className="w-5 h-5 text-zinc-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-wider text-amber-400 uppercase font-sans">
                  JM
                </span>
                <span className="text-xl font-black tracking-wider text-white uppercase font-sans">
                  CINEMA
                </span>
              </div>
              <div className="text-[9px] tracking-widest text-zinc-400 uppercase font-mono font-medium -mt-1">
                Movie Universe
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            <button
              id="nav-link-home"
              onClick={() => handleNavClick('home')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'home' 
                  ? 'text-amber-300 bg-amber-500/15 border border-amber-500/30 shadow-sm' 
                  : 'text-zinc-300 hover:text-white hover:bg-white/[0.08] border border-transparent'
              }`}
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Catalog</span>
            </button>

            <button
              id="nav-link-upcoming"
              onClick={() => handleNavClick('upcoming')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'upcoming' 
                  ? 'text-amber-300 bg-amber-500/15 border border-amber-500/30 shadow-sm' 
                  : 'text-zinc-300 hover:text-white hover:bg-white/[0.08] border border-transparent'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Upcoming</span>
            </button>

            <button
              id="nav-link-roulette"
              onClick={() => handleNavClick('roulette')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'roulette' 
                  ? 'text-amber-300 bg-amber-500/20 border border-amber-400/40 shadow-sm' 
                  : 'text-zinc-300 hover:text-amber-300 hover:bg-white/[0.08] border border-transparent'
              }`}
            >
              <RotateCw className="w-4 h-4 text-amber-400" />
              <span>Roulette</span>
              <span className="px-1.5 py-0.2 text-[9px] bg-amber-500/20 text-amber-300 rounded font-mono font-bold border border-amber-500/30">
                SPIN
              </span>
            </button>

            <button
              id="nav-link-watch"
              onClick={() => handleNavClick('public-domain')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'public-domain' 
                  ? 'text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 shadow-sm' 
                  : 'text-zinc-300 hover:text-white hover:bg-white/[0.08] border border-transparent'
              }`}
            >
              <Tv className="w-4 h-4 text-emerald-400" />
              <span>Free</span>
            </button>

            <button
              id="nav-link-collections"
              onClick={() => handleNavClick('collections')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'collections' 
                  ? 'text-amber-300 bg-amber-500/15 border border-amber-500/30 shadow-sm' 
                  : 'text-zinc-300 hover:text-white hover:bg-white/[0.08] border border-transparent'
              }`}
            >
              <Clapperboard className="w-4 h-4 text-purple-400" />
              <span>Hubs</span>
            </button>
          </nav>
        </div>

        {/* Right Controls: PWA, Watchlist, AI Assistant & Search Bar */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* PWA Install Button */}
          <PWAInstallButton compact={true} />

          {/* Watchlist Quick Button */}
          <button
            id="nav-watchlist-btn"
            onClick={() => setWatchlistOpen(true)}
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-zinc-200 text-xs font-semibold transition-all backdrop-blur-md cursor-pointer active:scale-95"
            title="Open Watchlist"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline">Watchlist</span>
            {watchlist.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-zinc-950 font-black text-[10px]">
                {watchlist.length}
              </span>
            )}
          </button>

          {/* Keyboard Shortcuts Trigger */}
          <button
            id="nav-shortcuts-btn"
            onClick={() => setShortcutsModalOpen(true)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-zinc-400 hover:text-white text-xs font-mono transition-all cursor-pointer"
            title="Keyboard Shortcuts (?)"
          >
            <Keyboard className="w-3.5 h-3.5" />
          </button>

          {/* Direct 4K Mirror Sponsored Link */}
          <a
            href={ADSTERRA_TARGETED_CHANNELS.NAVBAR_VIP_STREAM}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => openAdsterraLink(ADSTERRA_TARGETED_CHANNELS.NAVBAR_VIP_STREAM)}
            className="hidden 2xl:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-amber-500/30 border border-amber-400/40 text-amber-300 text-xs font-bold transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
            title="Fast 4K Movie Stream Mirror"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>4K Mirror</span>
            <ExternalLink className="w-3 h-3 text-amber-300/80" />
          </a>

          {/* AI Cinema Concierge Button */}
          <button
            id="nav-ai-concierge-btn"
            onClick={() => setAiConciergeOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-amber-500/40 text-amber-300 hover:text-white text-xs sm:text-sm font-semibold transition-all backdrop-blur-md shadow-sm shadow-amber-500/10 active:scale-95 cursor-pointer"
            title="Ask AI Cinema Concierge for Recommendations"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="hidden sm:inline">AI Vibe Matcher</span>
          </button>

          {/* Quick Live Search Bar */}
          <div className="relative" ref={searchRef}>
            <div className="flex items-center bg-white/[0.06] border border-white/15 rounded-xl px-3 py-2 text-zinc-300 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400 backdrop-blur-md transition-all w-36 sm:w-56 md:w-64">
              <Search className="w-4 h-4 text-zinc-400 shrink-0 mr-2" />
              <input
                id="nav-quick-search-input"
                type="text"
                value={localSearch}
                onFocus={() => setSearchOpen(true)}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  setSearchOpen(true);
                }}
                placeholder="Search TMDB movies..."
                className="bg-transparent border-none outline-none text-xs sm:text-sm w-full text-white placeholder-zinc-500"
              />
              {localSearch && (
                <button
                  onClick={() => {
                    setLocalSearch('');
                    setSearchResults([]);
                  }}
                  className="text-zinc-400 hover:text-zinc-200 text-xs cursor-pointer ml-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Live Search Popup Overlay */}
            {searchOpen && localSearch.trim() && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#0a0d1f]/95 border border-white/15 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-3 border-b border-white/10 flex items-center justify-between text-xs text-zinc-400 font-medium">
                  <span>TMDB results for "{localSearch}"</span>
                  <button 
                    onClick={() => {
                      setActiveTab('home');
                      setSearchOpen(false);
                    }}
                    className="text-amber-400 hover:underline cursor-pointer"
                  >
                    View all in Home →
                  </button>
                </div>
                
                <div className="max-h-80 overflow-y-auto divide-y divide-white/[0.06]">
                  {isSearching ? (
                    <div className="p-6 text-center text-xs text-zinc-400">Searching TMDB worldwide catalog...</div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((movie, idx) => (
                      <div
                        key={`search-${movie.id || idx}-${idx}`}
                        onClick={() => {
                          openMovieDetails(movie);
                          setSearchOpen(false);
                        }}
                        className="p-3 hover:bg-white/[0.08] cursor-pointer flex items-center gap-3 transition-colors"
                      >
                        <img 
                          src={movie.poster} 
                          alt={movie.title}
                          className="w-11 h-16 object-cover rounded-xl shadow shrink-0 bg-zinc-800 border border-white/10"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80');
                          }}
                        />
                        <div className="overflow-hidden">
                          <div className="text-sm font-semibold text-white truncate">{movie.title}</div>
                          <div className="text-xs text-zinc-400 flex items-center gap-2 mt-0.5">
                            <span>{movie.releaseYear}</span>
                            <span>•</span>
                            <span className="text-amber-400 font-medium">★ {movie.rating.toFixed(1)}</span>
                            {movie.genres?.[0] && (
                              <>
                                <span>•</span>
                                <span className="truncate">{movie.genres[0]}</span>
                              </>
                            )}
                          </div>
                          {movie.publicDomain && (
                            <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-mono border border-emerald-500/30">
                              Free Stream
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-zinc-400">
                      No movies found matching "{localSearch}".
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            id="nav-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#05060f]/95 border-b border-white/10 px-4 pt-3 pb-5 space-y-2 backdrop-blur-2xl animate-in slide-in-from-top-4">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
              activeTab === 'home' ? 'text-amber-400 bg-amber-400/10 border border-amber-400/20' : 'text-zinc-300 hover:bg-white/[0.04]'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Movie Catalog & Discovery</span>
            </span>
          </button>

          <button
            onClick={() => handleNavClick('upcoming')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
              activeTab === 'upcoming' ? 'text-amber-400 bg-amber-400/10 border border-amber-400/20' : 'text-zinc-300 hover:bg-white/[0.04]'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Upcoming Premieres</span>
            </span>
          </button>

          <button
            onClick={() => handleNavClick('roulette')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
              activeTab === 'roulette' ? 'text-amber-400 bg-amber-400/10 border border-amber-400/20' : 'text-zinc-300 hover:bg-white/[0.04]'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <RotateCw className="w-4 h-4 text-amber-400" />
              <span>Cinema Roulette (Spin)</span>
            </span>
            <span className="px-2 py-0.5 text-[10px] bg-amber-500/20 text-amber-300 rounded font-mono border border-amber-500/30">
              SPIN
            </span>
          </button>

          <button
            onClick={() => handleNavClick('public-domain')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
              activeTab === 'public-domain' ? 'text-emerald-300 bg-emerald-500/10 border border-emerald-500/20' : 'text-zinc-300 hover:bg-white/[0.04]'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Tv className="w-4 h-4 text-emerald-400" />
              <span>Watch Free Classics</span>
            </span>
            <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-300 rounded font-mono border border-emerald-500/30">
              100% Free
            </span>
          </button>

          <button
            onClick={() => handleNavClick('collections')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${
              activeTab === 'collections' ? 'text-amber-300 bg-amber-500/10 border border-amber-500/20' : 'text-zinc-300 hover:bg-white/[0.04]'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Clapperboard className="w-4 h-4 text-purple-400" />
              <span>Franchise &amp; Director Hubs</span>
            </span>
            <span className="px-2 py-0.5 text-[10px] bg-purple-500/20 text-purple-300 rounded font-mono border border-purple-500/30">
              HUBS
            </span>
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setAiConciergeOpen(true);
            }}
            className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2.5 text-amber-300 bg-white/[0.04] border border-amber-500/30 hover:bg-amber-500/10 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Vibe Matcher</span>
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setWatchlistOpen(true);
            }}
            className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between text-zinc-200 bg-white/[0.04] hover:bg-white/[0.08] transition-all"
          >
            <span className="flex items-center gap-2.5">
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span>Saved Watchlist</span>
            </span>
            {watchlist.length > 0 && (
              <span className="px-2 py-0.5 text-xs bg-amber-500 text-zinc-950 font-black rounded-full">
                {watchlist.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setShortcutsModalOpen(true);
            }}
            className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2.5 text-zinc-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.06] transition-all"
          >
            <Keyboard className="w-4 h-4 text-zinc-400" />
            <span>Keyboard Shortcuts (?)</span>
          </button>
        </div>
      )}
    </header>
  );
};
