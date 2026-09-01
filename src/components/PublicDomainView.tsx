import React, { useState, useEffect, useMemo } from 'react';
import { Tv, ShieldCheck, Play, Star, Info, Film, Search, Filter, Grid, List, Sparkles } from 'lucide-react';
import { Movie } from '../types';
import { MovieCard } from './MovieCard';
import { useMovies } from '../context/MovieContext';
import { SEOHead } from './SEOHead';

const PD_GENRES = [
  'All',
  'Horror',
  'Science Fiction',
  'Crime',
  'Comedy',
  'Mystery',
  'Thriller',
  'Drama',
  'Adventure',
  'Animation'
];

export const PublicDomainView: React.FC = () => {
  const { setStreamingMovie, openMovieDetails } = useMovies();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'rating' | 'popularity' | 'yearAsc' | 'yearDesc'>('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetch('/api/movies/public-domain')
      .then(res => res.json())
      .then(data => {
        setMovies(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const filteredMovies = useMemo(() => {
    return movies
      .filter(m => {
        const matchesSearch = !search.trim() || 
          m.title.toLowerCase().includes(search.toLowerCase()) ||
          (m.director && m.director.toLowerCase().includes(search.toLowerCase())) ||
          (m.overview && m.overview.toLowerCase().includes(search.toLowerCase()));

        const matchesGenre = selectedGenre === 'All' || 
          m.genres.some(g => g.toLowerCase() === selectedGenre.toLowerCase());

        return matchesSearch && matchesGenre;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'popularity') return (b.popularity || 0) - (a.popularity || 0);
        if (sortBy === 'yearDesc') return (b.releaseYear || 0) - (a.releaseYear || 0);
        if (sortBy === 'yearAsc') return (a.releaseYear || 0) - (b.releaseYear || 0);
        return 0;
      });
  }, [movies, search, selectedGenre, sortBy]);

  const spotlightMovie = movies[0];

  return (
    <div className="pt-28 pb-24 w-full px-4 sm:px-8 lg:px-12 xl:px-16 space-y-8">
      <SEOHead 
        title="Watch Free Movies Online — 100% Legal Public Domain Cinema Classics"
        description="Stream full-length public domain movies 100% free and legally. Watch classic film noir, vintage horror, silent masterpieces, and landmark cinema on Jamal Movies."
        url="/?view=public-domain"
        moviesList={movies}
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Watch Free Cinema', item: '/?view=public-domain' }
        ]}
      />
      
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-500/15 via-white/[0.04] to-zinc-950/80 border border-emerald-500/30 p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            100% Legal & Free Open-License Cinema ({movies.length} Full Movies)
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Watch Free Cinema
          </h1>
          <p className="text-sm sm:text-base text-zinc-200 leading-relaxed">
            Stream uncut cinematic masterworks, German expressionism, vintage sci-fi, classic screwball comedies, and legendary horror with zero subscriptions or paywalls.
          </p>
        </div>
      </div>

      {/* Featured Spotlight Film */}
      {spotlightMovie && !search.trim() && selectedGenre === 'All' && (
        <div className="relative rounded-3xl overflow-hidden bg-white/[0.04] border border-white/10 backdrop-blur-2xl grid grid-cols-1 lg:grid-cols-12 gap-0 shadow-2xl">
          <div className="lg:col-span-7 relative h-72 lg:h-auto min-h-[340px] bg-zinc-900 overflow-hidden">
            <img
              src={spotlightMovie.backdrop || spotlightMovie.poster}
              alt={spotlightMovie.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05060f] via-[#05060f]/40 to-transparent lg:hidden" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#05060f]/30 to-[#05060f] hidden lg:block" />
          </div>

          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono text-[11px] border border-emerald-500/30 backdrop-blur-md">
                  Featured Archive Classic
                </span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {spotlightMovie.rating}
                </span>
                <span className="text-zinc-400">• {spotlightMovie.releaseYear}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {spotlightMovie.title}
              </h2>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {spotlightMovie.overview}
              </p>

              <div className="text-xs text-zinc-400 space-y-1 pt-2">
                <div><strong className="text-zinc-300">Director:</strong> {spotlightMovie.director}</div>
                <div><strong className="text-zinc-300">Genres:</strong> {spotlightMovie.genres.join(', ')}</div>
                <div className="text-emerald-400 font-mono text-[11px]">
                  ✓ Archive.org Verified Full Stream
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setStreamingMovie(spotlightMovie)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-white text-white" />
                <span>Stream Full Movie Now</span>
              </button>

              <button
                onClick={() => openMovieDetails(spotlightMovie)}
                className="px-4 py-3 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] text-zinc-200 border border-white/15 text-sm font-semibold transition-colors backdrop-blur-md cursor-pointer"
              >
                <Info className="w-4 h-4 inline mr-1.5" />
                Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Search & Filter Toolbar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-7 relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search free full movies, directors, titles..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.06] border border-white/10 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>

          <div className="sm:col-span-5 flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full py-2.5 px-3 rounded-2xl bg-zinc-900 border border-white/10 text-zinc-200 text-xs focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
            >
              <option value="rating">Highest Rated</option>
              <option value="popularity">Most Popular</option>
              <option value="yearDesc">Newest Release Year</option>
              <option value="yearAsc">Classic Pioneer (Oldest)</option>
            </select>

            <div className="flex items-center bg-white/[0.06] border border-white/15 rounded-xl p-0.5 backdrop-blur-md shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-emerald-500 text-white font-bold shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-emerald-500 text-white font-bold shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Genre Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {PD_GENRES.map(genre => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedGenre === genre
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border border-white/10'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Grid / List of All Streamable Masterpieces */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Tv className="w-5 h-5 text-emerald-400" />
            <span>Complete Free Catalog</span>
            <span className="text-xs font-mono text-zinc-400 font-normal">
              (Showing {filteredMovies.length} of {movies.length} full streamable films)
            </span>
          </h2>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Film className="w-8 h-8 text-emerald-400 animate-spin" />
            <span className="text-xs text-zinc-400">Loading free cinema archive...</span>
          </div>
        ) : filteredMovies.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-4 sm:gap-6">
              {filteredMovies.map((movie, idx) => (
                <MovieCard key={`pd-grid-${movie.id || idx}-${idx}`} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMovies.map((movie, idx) => (
                <div
                  key={`pd-list-${movie.id || idx}-${idx}`}
                  onClick={() => openMovieDetails(movie)}
                  className="p-4 rounded-3xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-500/30 transition-all duration-200 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer group shadow-lg"
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
                        <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {movie.title}
                        </h3>
                        <span className="text-xs text-zinc-400">({movie.releaseYear})</span>
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          100% Free Full Movie
                        </span>
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
                        <span>{movie.director || 'Classic Director'}</span>
                        <span>•</span>
                        <span>{movie.genres.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setStreamingMovie(movie);
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/25 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white text-white" />
                      <span>Stream Now</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="py-16 text-center bg-white/[0.04] rounded-3xl border border-white/10 backdrop-blur-xl space-y-3 shadow-xl">
            <Film className="w-10 h-10 text-zinc-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No Free Movies Found</h3>
            <p className="text-xs text-zinc-300 max-w-sm mx-auto">
              No public domain titles matched your search criteria.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedGenre('All');
              }}
              className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

