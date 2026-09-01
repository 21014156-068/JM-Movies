import React, { useState, useRef, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  Play, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Film, 
  Flame, 
  Eye, 
  Tv, 
  Info,
  Layers,
  ArrowRight,
  Zap,
  ExternalLink
} from 'lucide-react';
import { Movie } from '../types';
import { useMovies } from '../context/MovieContext';
import { ADSTERRA_TARGETED_CHANNELS, openAdsterraLink } from '../utils/adsterra';

interface ComingSoonSectionProps {
  movies: Movie[];
  source?: 'tmdb_live' | 'curated_tmdb_cache';
  isLoading?: boolean;
}

export const ComingSoonSection: React.FC<ComingSoonSectionProps> = ({
  movies = [],
  source = 'curated_tmdb_cache',
  isLoading = false
}) => {
  const { 
    openMovieDetails, 
    setTrailerMovie, 
    setActiveTab,
    showToast
  } = useMovies();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedYearFilter, setSelectedYearFilter] = useState<'2026' | 'all'>('2026');
  const [viewMode, setViewMode] = useState<'carousel' | 'timeline'>('carousel');
  const [spotlightIndex, setSpotlightIndex] = useState(0);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, clientWidth } = scrollContainerRef.current;
    const scrollAmount = clientWidth * 0.75;
    scrollContainerRef.current.scrollTo({
      left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
      behavior: 'smooth'
    });
  };

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Ensure absolutely unique movies list by ID and only future unreleased titles
  const uniqueMovies = useMemo(() => {
    const seen = new Set<string>();
    return (movies || []).filter(m => {
      if (!m) return false;
      // Filter out past released movies
      if (m.releaseDate && m.releaseDate < todayStr) return false;
      const key = m.id || (m.tmdbId ? `tmdb-${m.tmdbId}` : m.title);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [movies, todayStr]);

  // Filter movies: default strictly to 2026 Premieres, or 2027+, or all upcoming
  const filteredMovies = useMemo(() => {
    return uniqueMovies.filter(m => {
      if (selectedYearFilter === '2026') return m.releaseDate?.startsWith('2026') || m.releaseYear === 2026;
      if (selectedYearFilter === '2027+') return (m.releaseYear && m.releaseYear >= 2027) || (m.releaseDate && m.releaseDate >= '2027-01-01');
      return true;
    });
  }, [uniqueMovies, selectedYearFilter]);

  const spotlightMovie = filteredMovies[spotlightIndex] || filteredMovies[0] || uniqueMovies[0];

  const formatReleaseDate = (dateStr?: string) => {
    if (!dateStr) return 'TBA 2026';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const calculateDaysRemaining = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const releaseTime = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])).getTime();
        const now = new Date().getTime();
        const diffDays = Math.ceil((releaseTime - now) / (1000 * 60 * 60 * 24));
        if (diffDays > 1) {
          return `${diffDays} days to premiere`;
        } else if (diffDays === 1) {
          return 'Releases tomorrow!';
        } else if (diffDays === 0) {
          return 'Releases today!';
        }
        return 'Releasing soon';
      }
      return null;
    } catch {
      return null;
    }
  };

  if (!isLoading && (!movies || movies.length === 0)) return null;

  return (
    <section className="relative py-8 w-full px-4 sm:px-8 lg:px-12 xl:px-16 select-none space-y-6">
      
      {/* Background ambient lighting accent */}
      <div className="absolute -top-10 left-1/3 w-96 h-96 bg-amber-500/[0.06] rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header Container with Frosted Glass Badge & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-white/10">
        
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-bold backdrop-blur-xl shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              2026 Theatrical Slate
            </span>

            {source === 'tmdb_live' ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-semibold backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live API Feed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-zinc-300 text-[10px] font-mono font-semibold backdrop-blur-md">
                <Film className="w-2.5 h-2.5 text-amber-400" />
                2026 Blockbuster Premieres
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>2026 Premieres</span>
            <span className="text-sm sm:text-base font-normal text-zinc-400 font-sans">
              Coming Soon to Theaters & IMAX
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
            Track official posters, theatrical release dates, and countdowns for 2026's most anticipated Hollywood tentpole movies.
          </p>
        </div>

        {/* Action Controls & View Switcher */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          
          {/* Year Filter Pill */}
          <div className="flex items-center p-1 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl">
            <button
              onClick={() => setSelectedYearFilter('2026')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedYearFilter === '2026'
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-bold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06]'
              }`}
            >
              2026
            </button>
            <button
              onClick={() => setSelectedYearFilter('2027+')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedYearFilter === '2027+'
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-bold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06]'
              }`}
            >
              2027+
            </button>
            <button
              onClick={() => setSelectedYearFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedYearFilter === 'all'
                  ? 'bg-amber-500 text-zinc-950 shadow-md font-bold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06]'
              }`}
            >
              All Upcoming
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl">
            <button
              onClick={() => setViewMode('carousel')}
              className={`p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'carousel'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Carousel View"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Carousel</span>
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'timeline'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Timeline View"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Timeline</span>
            </button>
          </div>

        </div>

      </div>

      {/* Featured Upcoming Spotlight Card */}
      {spotlightMovie && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0a0d1f]/95 via-[#0e122b]/95 to-[#080a18]/95 border border-white/15 backdrop-blur-2xl shadow-2xl p-6 sm:p-8 group/spotlight">
          
          {/* Backdrop Graphic with cinematic gradient overlay */}
          <div className="absolute inset-0 z-0 opacity-20 group-hover/spotlight:opacity-30 transition-opacity duration-700 pointer-events-none">
            <img
              src={spotlightMovie.backdrop || spotlightMovie.poster}
              alt={spotlightMovie.title}
              className="w-full h-full object-cover object-center scale-105 group-hover/spotlight:scale-100 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#05060f] via-[#05060f]/80 to-transparent" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* Left: Poster Container with Glass Border & Release Tag */}
            <div className="lg:col-span-4 flex justify-center lg:justify-start">
              <div 
                className="relative w-48 sm:w-56 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-white/[0.04] backdrop-blur-md cursor-pointer group/poster shrink-0"
                onClick={() => openMovieDetails(spotlightMovie)}
              >
                <img
                  src={spotlightMovie.poster}
                  alt={spotlightMovie.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/poster:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Release Date Ribbon Overlay on Poster */}
                <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-[#05060f] via-[#05060f]/90 to-transparent backdrop-blur-sm border-t border-white/10 text-center">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-amber-300 font-bold">
                    Official Release Date
                  </div>
                  <div className="text-sm font-black text-white flex items-center justify-center gap-1.5 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{formatReleaseDate(spotlightMovie.releaseDate)}</span>
                  </div>
                </div>

                {/* Top Badge: Anticipated */}
                <div className="absolute top-2.5 left-2.5 bg-amber-500/90 text-zinc-950 px-2 py-0.5 rounded-lg text-[10px] font-black tracking-wider uppercase shadow-md flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-current" />
                  <span>Spotlight</span>
                </div>
              </div>
            </div>

            {/* Right: Info, Synopsis, Countdown & Actions */}
            <div className="lg:col-span-8 space-y-4 text-left">
              
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold backdrop-blur-md">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Theatrical Premiere: {formatReleaseDate(spotlightMovie.releaseDate)}</span>
                </div>

                {calculateDaysRemaining(spotlightMovie.releaseDate) && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.08] border border-white/15 text-zinc-200 text-xs font-mono font-medium backdrop-blur-md">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{calculateDaysRemaining(spotlightMovie.releaseDate)}</span>
                  </div>
                )}

                <div className="px-2.5 py-1 rounded-xl bg-white/[0.06] border border-white/10 text-zinc-400 text-xs font-mono">
                  TMDB #{spotlightMovie.tmdbId}
                </div>
              </div>

              <div className="space-y-1">
                <h3 
                  onClick={() => openMovieDetails(spotlightMovie)}
                  className="text-2xl sm:text-4xl font-black text-white hover:text-amber-400 transition-colors cursor-pointer tracking-tight"
                >
                  {spotlightMovie.title}
                </h3>
                {spotlightMovie.tagline && (
                  <p className="text-sm font-medium text-amber-400/90 italic">
                    "{spotlightMovie.tagline}"
                  </p>
                )}
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed line-clamp-3 max-w-2xl">
                {spotlightMovie.overview}
              </p>

              {/* Cast & Director tags */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-300 pt-1">
                {spotlightMovie.director && (
                  <span className="px-2.5 py-1 rounded-xl bg-white/[0.06] border border-white/10 text-zinc-300">
                    <strong className="text-amber-300 font-medium">Director:</strong> {spotlightMovie.director}
                  </span>
                )}
                {spotlightMovie.genres && spotlightMovie.genres.slice(0, 3).map(g => (
                  <span key={g} className="px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-zinc-400">
                    {g}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {spotlightMovie.trailerKey && (
                  <button
                    onClick={() => setTrailerMovie(spotlightMovie)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                    <span>Watch Official Trailer</span>
                  </button>
                )}

                <button
                  onClick={() => openMovieDetails(spotlightMovie)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-white text-xs sm:text-sm font-semibold backdrop-blur-md transition-colors cursor-pointer"
                >
                  <Info className="w-4 h-4 text-amber-400" />
                  <span>Full Cast & Details</span>
                </button>

                <a
                  href={ADSTERRA_TARGETED_CHANNELS.PREMIERE_EARLY_ACCESS}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => openAdsterraLink(ADSTERRA_TARGETED_CHANNELS.PREMIERE_EARLY_ACCESS)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600/30 to-amber-500/30 hover:from-purple-600/40 hover:to-amber-500/40 border border-amber-400/40 text-amber-300 font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Early Premiere Stream Pass</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>

          </div>

          {/* Quick Spotlight Selector Dots */}
          {uniqueMovies.length > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 mt-6 border-t border-white/10">
              <span className="text-[11px] font-mono text-zinc-400 mr-2">Featured Tentpole:</span>
              {uniqueMovies.slice(0, 6).map((m, idx) => (
                <button
                  key={`spotlight-dot-${m.id || idx}`}
                  onClick={() => setSpotlightIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    spotlightIndex === idx
                      ? 'w-6 bg-amber-400 shadow-sm shadow-amber-400/50'
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  title={m.title}
                />
              ))}
            </div>
          )}

        </div>
      )}

      {/* Main Mode View: Carousel or Timeline Grid */}
      {viewMode === 'carousel' ? (
        <div className="relative group/row">
          
          {/* Navigation Controls */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Upcoming Catalog Releases ({filteredMovies.length} Titles)</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleScroll('left')}
                className="w-8 h-8 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-zinc-300 hover:text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScroll('right')}
                className="w-8 h-8 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-zinc-300 hover:text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Track */}
          <div
            ref={scrollContainerRef}
            className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto scrollbar-none scroll-smooth pb-4 pt-1 px-1 -mx-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredMovies.map((movie, idx) => {
              const daysLeft = calculateDaysRemaining(movie.releaseDate);

              return (
                <div
                  key={`carousel-${movie.id || 'up'}-${idx}`}
                  className="group/card relative flex-shrink-0 w-48 sm:w-56 flex flex-col justify-between rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-amber-500/40 p-3 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 cursor-pointer"
                  onClick={() => openMovieDetails(movie)}
                >
                  {/* Poster Graphic */}
                  <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-black/40 border border-white/10 shadow-lg">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80');
                      }}
                    />

                    {/* Prominent Release Date Badge */}
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
                      <div className="flex items-center gap-1 bg-[#05060f]/90 backdrop-blur-xl px-2 py-1 rounded-lg border border-amber-500/40 text-[10px] font-bold text-amber-300 shadow-md">
                        <Calendar className="w-3 h-3 text-amber-400" />
                        <span>{formatReleaseDate(movie.releaseDate)}</span>
                      </div>

                      <div className="bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-mono text-zinc-300 border border-white/10">
                        {movie.releaseYear}
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-[#05060f]/90 backdrop-blur-xl border border-white/15 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5 z-20">
                      
                      {/* Top Action */}
                      <div className="flex justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => openMovieDetails(movie)}
                          className="p-2 rounded-xl backdrop-blur-xl border border-white/15 bg-white/[0.08] hover:bg-white/[0.2] text-zinc-300 hover:text-white transition-all cursor-pointer"
                          title="View Details"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Center Play Trailer Button */}
                      <div className="flex flex-col items-center justify-center my-auto">
                        {movie.trailerKey && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setTrailerMovie(movie);
                            }}
                            className="w-11 h-11 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 flex items-center justify-center shadow-lg shadow-amber-500/30 hover:scale-110 transition-transform active:scale-95 cursor-pointer"
                            title="Watch Teaser Trailer"
                          >
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          </button>
                        )}
                        <span className="text-[10px] font-semibold text-zinc-200 mt-2 bg-white/[0.1] px-2 py-0.5 rounded backdrop-blur-md">
                          {movie.trailerKey ? 'Play Trailer' : 'Details'}
                        </span>
                      </div>

                      {/* Bottom Overview Preview */}
                      <div>
                        <div className="text-[10px] font-semibold text-amber-300 truncate">
                          {movie.genres?.slice(0, 2).join(' • ')}
                        </div>
                        <p className="text-[10px] text-zinc-300 line-clamp-2 mt-0.5 leading-snug">
                          {movie.overview}
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* Card Bottom Content */}
                  <div className="mt-3 space-y-1">
                    <h4 className="text-sm font-bold text-white group-hover/card:text-amber-400 transition-colors line-clamp-1">
                      {movie.title}
                    </h4>

                    {/* Premiere Countdown Pill */}
                    <div className="flex items-center justify-between text-xs text-zinc-400 font-medium pt-0.5">
                      <span className="text-[11px] text-amber-300 font-mono flex items-center gap-1 font-semibold">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {daysLeft || formatReleaseDate(movie.releaseDate)}
                      </span>
                      <span className="text-[10px] text-zinc-400 truncate max-w-[65px]">
                        {movie.genres?.[0] || 'Cinema'}
                      </span>
                    </div>

                    {movie.director && (
                      <div className="text-[10px] text-zinc-400 truncate">
                        Dir. {movie.director}
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      ) : (
        /* Timeline Grid Mode */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 pt-2">
          {filteredMovies.map((movie, idx) => {
            const daysLeft = calculateDaysRemaining(movie.releaseDate);

            return (
              <div
                key={`timeline-${movie.id || 'up'}-${idx}`}
                onClick={() => openMovieDetails(movie)}
                className="group relative flex gap-4 p-4 rounded-3xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-amber-500/30 backdrop-blur-xl shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Poster Thumbnail */}
                <div className="relative w-20 sm:w-24 aspect-[2/3] rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-md">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  {movie.trailerKey && (
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setTrailerMovie(movie);
                      }}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <div className="w-8 h-8 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center shadow-lg">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0 space-y-1">
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold">
                        {formatReleaseDate(movie.releaseDate)}
                      </span>
                      {daysLeft && (
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {daysLeft}
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                      {movie.title}
                    </h4>

                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {movie.overview}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-[11px] text-zinc-400 font-medium truncate">
                      {movie.director ? `Dir. ${movie.director}` : movie.genres?.slice(0, 2).join(', ')}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openMovieDetails(movie);
                      }}
                      className="p-1.5 rounded-lg border border-white/10 bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 hover:text-white transition-all cursor-pointer"
                      title="Details"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </section>
  );
};
