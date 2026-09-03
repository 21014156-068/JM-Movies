import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Grid, 
  List, 
  Star, 
  Tv, 
  Sparkles, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight,
  Play,
  Film,
  History,
  X,
  Trash2,
  Clock
} from 'lucide-react';
import { Movie, PaginatedResponse } from '../types';
import { MovieCard } from './MovieCard';
import { useMovies } from '../context/MovieContext';
import { SEOHead } from './SEOHead';
import { AdSlotBanner } from './AdSlotBanner';
import { RotateCw, Swords, HelpCircle, Zap, ExternalLink, Download, Radio } from 'lucide-react';
import { ADSTERRA_TARGETED_CHANNELS, openAdsterraLink } from '../utils/adsterra';

const SEARCH_HISTORY_STORAGE_KEY = 'jamal_search_history';
const MAX_HISTORY_ITEMS = 5;

export const ExploreView: React.FC = () => {
  const { 
    selectedGenre, 
    setSelectedGenre, 
    openMovieDetails, 
    setTrailerMovie, 
    setStreamingMovie,
    setActiveTab
  } = useMovies();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'releaseDate' | 'title'>('popularity');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load search history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SEARCH_HISTORY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setSearchHistory(parsed.slice(0, MAX_HISTORY_ITEMS));
        }
      }
    } catch (e) {
      console.warn('Failed to load search history:', e);
    }
  }, []);

  // Save term to search history (max 5 terms)
  const addToHistory = (term: string) => {
    const cleanTerm = term.trim();
    if (!cleanTerm || cleanTerm.length < 2) return;

    setSearchHistory(prev => {
      const filtered = prev.filter(t => t.toLowerCase() !== cleanTerm.toLowerCase());
      const updated = [cleanTerm, ...filtered].slice(0, MAX_HISTORY_ITEMS);
      try {
        localStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save search history:', e);
      }
      return updated;
    });
  };

  // Remove individual search term
  const removeFromHistory = (termToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchHistory(prev => {
      const updated = prev.filter(t => t !== termToRemove);
      try {
        localStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to update search history:', e);
      }
      return updated;
    });
  };

  // Clear all search history
  const clearHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem(SEARCH_HISTORY_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear search history:', e);
    }
  };

  // Handle clicking a history term
  const handleSelectHistoryTerm = (term: string) => {
    setSearch(term);
    setPage(1);
    addToHistory(term);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Debounced auto-save of typed search terms
  useEffect(() => {
    if (!search.trim() || search.trim().length < 2) return;
    const timer = setTimeout(() => {
      addToHistory(search.trim());
    }, 1200);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch genres
  useEffect(() => {
    fetch('/api/movies/genres')
      .then(res => res.json())
      .then(data => setGenres(data))
      .catch(console.error);
  }, []);

  // Fetch filtered movies
  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (selectedGenre && selectedGenre !== 'All') params.append('genre', selectedGenre);
      if (category !== 'all') params.append('category', category);
      if (minRating > 0) params.append('minRating', String(minRating));
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      params.append('page', String(page));
      params.append('limit', '60');

      const res = await fetch(`/api/movies?${params.toString()}`);
      if (res.ok) {
        const data: PaginatedResponse<Movie> = await res.json();
        setMovies(data.data);
        setTotalPages(data.totalPages);
        setTotalCount(data.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [search, selectedGenre, category, minRating, sortBy, sortOrder, page]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedGenre('All');
    setCategory('all');
    setMinRating(0);
    setSortBy('popularity');
    setSortOrder('desc');
    setPage(1);
  };

  // Calculate dynamic SEO properties
  const seoTitle = search.trim()
    ? `Search results for "${search.trim()}" — Discover Movies`
    : selectedGenre && selectedGenre !== 'All'
    ? `${selectedGenre} Movies — Watch Trailers & Discover Top Titles`
    : category === 'trending'
    ? 'Trending Movies Worldwide — Popular Blockbusters & Releases'
    : category === 'top-rated'
    ? 'Top Rated Movies of All Time — Critically Acclaimed Cinema'
    : category === 'upcoming'
    ? 'Upcoming Movie Releases — In Theaters & Coming Soon'
    : category === 'public-domain'
    ? 'Free Public Domain Cinema — Stream Legal Classic Masterpieces'
    : 'Discover Movies, Watch HD Trailers & Stream Free Cinema';

  const seoDescription = search.trim()
    ? `Explore search results for "${search.trim()}". Find movies, cast details, release dates, user reviews, ratings, and HD trailers on Jamal Movies.`
    : `Browse over 36,000+ films across ${selectedGenre || 'all'} genres. Watch official trailers, read verified audience reviews, check IMDb/TMDB ratings, and stream free legal classics on Jamal Movies.`;

  return (
    <div className="pt-24 pb-24 w-full px-4 sm:px-8 lg:px-12 xl:px-16 space-y-6">
      <SEOHead 
        title={seoTitle}
        description={seoDescription}
        url={typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/'}
        moviesList={movies}
        breadcrumbs={[
          { name: 'Home', item: '/' },
          ...(selectedGenre && selectedGenre !== 'All' ? [{ name: selectedGenre, item: `/?genre=${selectedGenre}` }] : []),
          ...(category !== 'all' ? [{ name: category.toUpperCase(), item: `/?category=${category}` }] : [])
        ]}
      />

      {/* Interactive Cinema Engagement Hub (Increases User Retention & Ad Monetization) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* 1. Roulette Card */}
        <div 
          onClick={() => {
            setActiveTab('roulette');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent border border-amber-400/30 hover:border-amber-400/60 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] active:scale-98 cursor-pointer group shadow-xl flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-xl group-hover:rotate-45 transition-transform">
                🎰
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider border border-amber-400/30">
                Random Reel
              </span>
            </div>
            <h3 className="text-base font-black text-white group-hover:text-amber-300 transition-colors">
              Cinema Roulette
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Don’t know what to watch? Spin the mood wheel for an instant trailer & film match.
            </p>
          </div>
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
            <span>Spin Movie Wheel</span>
            <RotateCw className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* 2. Battles Card */}
        <div 
          onClick={() => {
            setActiveTab('battle');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="p-5 rounded-3xl bg-gradient-to-br from-rose-500/15 via-purple-500/10 to-transparent border border-rose-400/30 hover:border-rose-400/60 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] active:scale-98 cursor-pointer group shadow-xl flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                ⚔️
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-400/20 text-rose-300 text-[10px] font-mono font-bold uppercase tracking-wider border border-rose-400/30">
                This or That
              </span>
            </div>
            <h3 className="text-base font-black text-white group-hover:text-rose-300 transition-colors">
              Movie Battle Arena
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Vote between rival blockbusters, view live community stats, and unlock streak badges.
            </p>
          </div>
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-rose-400 group-hover:translate-x-1 transition-transform">
            <span>Enter Clash Arena</span>
            <Swords className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* 3. Trivia Card */}
        <div 
          onClick={() => {
            setActiveTab('trivia');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="p-5 rounded-3xl bg-gradient-to-br from-purple-500/15 via-indigo-500/10 to-transparent border border-purple-400/30 hover:border-purple-400/60 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] active:scale-98 cursor-pointer group shadow-xl flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                🧠
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-400/20 text-purple-300 text-[10px] font-mono font-bold uppercase tracking-wider border border-purple-400/30">
                Movie IQ
              </span>
            </div>
            <h3 className="text-base font-black text-white group-hover:text-purple-300 transition-colors">
              CineQuiz Challenge
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Unblur famous posters, identify legendary quotes, and test your cinema expertise.
            </p>
          </div>
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-purple-400 group-hover:translate-x-1 transition-transform">
            <span>Play CineQuiz</span>
            <HelpCircle className="w-3.5 h-3.5" />
          </div>
        </div>

      </div>

      {/* High-Converting 4K Cinema Streaming & Fast Mirror Hub */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-indigo-500/15 border border-amber-500/30 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-zinc-950 font-black shadow-lg shadow-amber-500/30 flex-shrink-0">
            <Zap className="w-5 h-5 fill-zinc-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black text-white">
                Ultra HD 4K Cinema Streaming &amp; Fast Mirror Servers
              </h2>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                🟢 FAST CDN ONLINE
              </span>
            </div>
            <p className="text-xs text-zinc-300 mt-0.5">
              Instant buffer-free streaming across all modern devices with multi-audio &amp; direct 4K download mirrors.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <a
            href={ADSTERRA_TARGETED_CHANNELS.HERO_QUICK_STREAM}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => openAdsterraLink(ADSTERRA_TARGETED_CHANNELS.HERO_QUICK_STREAM)}
            className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-zinc-950" />
            <span>Launch 4K Server 1</span>
            <ExternalLink className="w-3 h-3 text-zinc-950" />
          </a>

          <a
            href={ADSTERRA_TARGETED_CHANNELS.STREAM_SERVER_2}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => openAdsterraLink(ADSTERRA_TARGETED_CHANNELS.STREAM_SERVER_2)}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-purple-600/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 text-amber-300" />
            <span>VIP Mirror 2</span>
            <ExternalLink className="w-3 h-3 text-purple-200" />
          </a>

          <a
            href={ADSTERRA_TARGETED_CHANNELS.FAST_DOWNLOAD_SERVER}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => openAdsterraLink(ADSTERRA_TARGETED_CHANNELS.FAST_DOWNLOAD_SERVER)}
            className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 text-zinc-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Direct DL</span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </a>
        </div>
      </div>

      {/* Main Search & Quick Category Tabs */}
      <div className="space-y-4">
        
        {/* Search & Sort Controls in Frosted Container */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6 md:col-span-7 relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && search.trim()) {
                    addToHistory(search.trim());
                    fetchMovies();
                  }
                }}
                placeholder="Search by title, director, keywords, actor..."
                className="w-full bg-white/[0.06] border border-white/15 rounded-2xl pl-10 pr-10 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 backdrop-blur-md"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch('');
                    setPage(1);
                    if (searchInputRef.current) searchInputRef.current.focus();
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="sm:col-span-3 md:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as any);
                  setPage(1);
                }}
                className="w-full bg-[#0a0d1f] border border-white/15 rounded-2xl px-3.5 py-3 text-sm text-zinc-200 focus:outline-none focus:border-amber-400 cursor-pointer backdrop-blur-md"
              >
                <option value="popularity">Sort: Most Popular</option>
                <option value="rating">Sort: Highest Rated</option>
                <option value="releaseDate">Sort: Release Date</option>
                <option value="title">Sort: Title (A-Z)</option>
              </select>
            </div>

            <div className="sm:col-span-3 md:col-span-2">
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-[#0a0d1f] border border-white/15 rounded-2xl px-3.5 py-3 text-sm text-zinc-200 focus:outline-none focus:border-amber-400 cursor-pointer backdrop-blur-md"
              >
                <option value="all">All Releases</option>
                <option value="upcoming">⏳ Coming Soon</option>
                <option value="trending">🔥 Trending</option>
                <option value="top-rated">★ Top Rated</option>
                <option value="public-domain">🏛️ Public Domain</option>
              </select>
            </div>
          </div>

          {/* Search History Chips (Last 5 searches) */}
          {searchHistory.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1 pb-1 border-t border-white/[0.06]">
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium mr-1 shrink-0">
                <History className="w-3.5 h-3.5 text-amber-400/80" />
                <span>Recent Searches:</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 flex-1">
                {searchHistory.map((term, index) => {
                  const isActive = search.trim().toLowerCase() === term.toLowerCase();
                  return (
                    <div
                      key={`hist-${term}-${index}`}
                      onClick={() => handleSelectHistoryTerm(term)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs transition-all cursor-pointer group backdrop-blur-md ${
                        isActive
                          ? 'bg-amber-500/25 text-amber-300 border border-amber-400/50 shadow-sm font-semibold'
                          : 'bg-white/[0.05] hover:bg-white/[0.12] text-zinc-300 hover:text-white border border-white/10 hover:border-white/20'
                      }`}
                    >
                      <Clock className="w-3 h-3 text-zinc-400 group-hover:text-amber-300 transition-colors" />
                      <span className="max-w-[140px] truncate">{term}</span>
                      <button
                        onClick={(e) => removeFromHistory(term, e)}
                        className="text-zinc-400 hover:text-rose-400 p-0.5 rounded-full hover:bg-white/10 transition-colors ml-0.5"
                        title={`Remove "${term}" from history`}
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={clearHistory}
                className="text-[11px] text-zinc-400 hover:text-rose-400 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer ml-auto shrink-0"
                title="Clear all search history"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>
          )}

          {/* Horizontal Genre Selector Rail */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => {
                  setSelectedGenre(g);
                  setPage(1);
                }}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer backdrop-blur-md ${
                  selectedGenre === g
                    ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/25 scale-105 font-bold'
                    : 'bg-white/[0.06] hover:bg-white/[0.14] text-zinc-200 border border-white/10'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Rating Slider (Desktop or when toggled) */}
          {(showFilters || minRating > 0) && (
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 animate-in fade-in">
              <div className="flex items-center gap-4 flex-1 min-w-[240px]">
                <span className="text-xs font-medium text-zinc-300">Minimum Rating:</span>
                <input
                  type="range"
                  min={0}
                  max={9}
                  step={0.5}
                  value={minRating}
                  onChange={(e) => {
                    setMinRating(Number(e.target.value));
                    setPage(1);
                  }}
                  className="flex-1 accent-amber-400 cursor-pointer"
                />
                <span className="text-xs font-bold text-amber-300 w-14">
                  {minRating > 0 ? `★ ${minRating}+` : 'Any'}
                </span>
              </div>

              <button
                onClick={handleResetFilters}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Movie Results Section */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-300 font-medium">
          <div className="flex items-center gap-3">
            <span>Showing {movies.length} of {totalCount} movies</span>
            <span>•</span>
            <span>Page {page} of {totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs text-zinc-200 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span>{showFilters ? 'Hide Rating' : 'Rating Filter'}</span>
            </button>

            <div className="flex items-center bg-white/[0.06] border border-white/15 rounded-xl p-0.5 backdrop-blur-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-amber-500 text-zinc-950 font-bold shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-amber-500 text-zinc-950 font-bold shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
            <span className="text-xs text-zinc-400">Loading catalog...</span>
          </div>
        ) : movies.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-4 sm:gap-6">
              {movies.map((movie, idx) => (
                <MovieCard key={`explore-grid-${movie.id || idx}-${idx}`} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {movies.map((movie, idx) => (
                <div
                  key={`explore-list-${movie.id || idx}-${idx}`}
                  onClick={() => openMovieDetails(movie)}
                  className="p-4 rounded-3xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all duration-200 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer group shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-16 h-24 object-cover rounded-2xl shadow shrink-0 bg-zinc-800 border border-white/10"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                          {movie.title}
                        </h3>
                        <span className="text-xs text-zinc-400">({movie.releaseYear})</span>
                        {movie.publicDomain && (
                          <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Free Stream
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-300 line-clamp-2 max-w-2xl">
                        {movie.overview}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-zinc-400 pt-1">
                        <span className="text-amber-400 font-semibold flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {movie.rating.toFixed(1)}
                        </span>
                        <span>•</span>
                        <span>{movie.director || 'Studio'}</span>
                        <span>•</span>
                        <span>{movie.genres.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {movie.publicDomain ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setStreamingMovie(movie);
                        }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/25 cursor-pointer"
                      >
                        <Tv className="w-3.5 h-3.5" />
                        <span>Stream</span>
                      </button>
                    ) : movie.trailerKey ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTrailerMovie(movie);
                        }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/25 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-zinc-950 text-zinc-950" />
                        <span>Trailer</span>
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="py-16 text-center bg-white/[0.04] rounded-3xl border border-white/10 backdrop-blur-xl space-y-3 shadow-xl">
            <Film className="w-10 h-10 text-zinc-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No Movies Found</h3>
            <p className="text-xs text-zinc-300 max-w-sm mx-auto">
              We couldn't find any titles matching your current filter criteria.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* High-CTR Engagement & Monetization Banner */}
        <AdSlotBanner placement="leaderboard" className="mt-6" />

        {/* Pagination in Frosted Style */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-6">
            <button
              onClick={() => {
                setPage(prev => Math.max(1, prev - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={page === 1}
              className="p-2 sm:p-2.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.14] text-zinc-200 disabled:opacity-30 border border-white/10 backdrop-blur-md cursor-pointer transition-all"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 h-5" />
            </button>

            {(() => {
              const pages: (number | string)[] = [];
              const maxButtons = 7;
              if (totalPages <= maxButtons) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
              } else {
                pages.push(1);
                const start = Math.max(2, page - 1);
                const end = Math.min(totalPages - 1, page + 1);
                if (start > 2) pages.push('...');
                for (let i = start; i <= end; i++) pages.push(i);
                if (end < totalPages - 1) pages.push('...');
                pages.push(totalPages);
              }
              return pages.map((p, idx) => {
                if (typeof p === 'string') {
                  return (
                    <span key={`ellipsis-${idx}`} className="px-2 text-xs text-zinc-500 font-mono select-none">
                      ...
                    </span>
                  );
                }
                return (
                  <button
                    key={p}
                    onClick={() => {
                      setPage(p);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-2xl text-xs font-bold transition-all backdrop-blur-md cursor-pointer ${
                      page === p 
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 shadow-lg shadow-amber-500/25 font-black scale-105' 
                        : 'bg-white/[0.06] hover:bg-white/[0.14] text-zinc-200 border border-white/10'
                    }`}
                  >
                    {p}
                  </button>
                );
              });
            })()}

            <button
              onClick={() => {
                setPage(prev => Math.min(totalPages, prev + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={page === totalPages}
              className="p-2 sm:p-2.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.14] text-zinc-200 disabled:opacity-30 border border-white/10 backdrop-blur-md cursor-pointer transition-all"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 h-5" />
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
