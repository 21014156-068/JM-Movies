import React from 'react';
import { Play, Star, Tv, Info, Zap } from 'lucide-react';
import { Movie } from '../types';
import { useMovies } from '../context/MovieContext';
import { ADSTERRA_TARGETED_CHANNELS, openAdsterraLink } from '../utils/adsterra';

interface MovieCardProps {
  movie: Movie;
  showRank?: number;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, showRank }) => {
  const { 
    openMovieDetails, 
    setTrailerMovie, 
    setStreamingMovie 
  } = useMovies();

  const movieSlug = movie.title 
    ? encodeURIComponent(movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) 
    : '';
  const movieCanonicalUrl = `/movie/${movie.id}/${movieSlug}`;

  return (
    <article 
      itemScope 
      itemType="https://schema.org/Movie"
      className="group relative flex-shrink-0 w-44 sm:w-52 select-none cursor-pointer"
      onClick={() => openMovieDetails(movie)}
    >
      <meta itemProp="url" content={movieCanonicalUrl} />
      <meta itemProp="datePublished" content={movie.releaseDate || `${movie.releaseYear}-01-01`} />
      <meta itemProp="duration" content={`PT${movie.runtime || 120}M`} />
      {movie.director && <meta itemProp="director" content={movie.director} />}

      {/* Optional Rank Number Display (e.g. for Top 10) */}
      {showRank !== undefined && (
        <div className="absolute -left-3 -bottom-4 text-7xl sm:text-8xl font-black italic tracking-tighter text-zinc-900 stroke-zinc-700 select-none z-10 pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] opacity-90 transition-transform group-hover:scale-110">
          <span className="bg-gradient-to-br from-zinc-100 to-zinc-700 bg-clip-text text-transparent">
            {showRank}
          </span>
        </div>
      )}

      {/* Main Poster Container */}
      <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-white/[0.04] border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.35)] backdrop-blur-md transition-all duration-300 group-hover:scale-[1.03] group-hover:border-white/25 group-hover:shadow-2xl group-hover:shadow-amber-500/10">
        
        <img
          itemProp="image"
          src={movie.poster}
          alt={`${movie.title} (${movie.releaseYear}) Official Movie Poster`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80');
          }}
        />

        {/* Top Badges */}
        <div 
          itemProp="aggregateRating" 
          itemScope 
          itemType="https://schema.org/AggregateRating"
          className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10"
        >
          <meta itemProp="bestRating" content="10" />
          <meta itemProp="ratingValue" content={String(movie.rating)} />
          <meta itemProp="ratingCount" content={String(movie.voteCount || 100)} />
          <div className="flex items-center gap-1 bg-white/[0.15] backdrop-blur-xl px-2 py-0.5 rounded-lg border border-white/15 text-[11px] font-bold text-amber-300 shadow-sm">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>

          {movie.publicDomain ? (
            <div className="flex items-center gap-1 bg-emerald-500/25 backdrop-blur-xl px-2 py-0.5 rounded-lg border border-emerald-500/40 text-[10px] font-bold text-emerald-300 font-mono shadow-sm">
              <Tv className="w-2.5 h-2.5" />
              <span>FREE</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 bg-amber-500/25 backdrop-blur-xl px-2 py-0.5 rounded-lg border border-amber-500/40 text-[10px] font-bold text-amber-300 font-mono shadow-sm">
              <Zap className="w-2.5 h-2.5 fill-amber-400" />
              <span>4K</span>
            </div>
          )}
        </div>

        {/* Hover Overlay with Frosted Glass look */}
        <div className="absolute inset-0 bg-[#05060f]/85 backdrop-blur-xl border border-white/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5 z-20">
          
          {/* Top Quick Info */}
          <div className="flex justify-between items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <a
              href={ADSTERRA_TARGETED_CHANNELS.FAST_DOWNLOAD_SERVER}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => openAdsterraLink(ADSTERRA_TARGETED_CHANNELS.FAST_DOWNLOAD_SERVER)}
              className="px-2 py-1 rounded-lg backdrop-blur-xl border border-amber-400/30 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
              title="Fast 4K Mirror Server"
            >
              <Zap className="w-3 h-3 fill-amber-400" />
              <span>4K Mirror</span>
            </a>

            <button
              onClick={() => openMovieDetails(movie)}
              className="p-2 rounded-xl backdrop-blur-xl border border-white/15 bg-white/[0.08] hover:bg-white/[0.18] text-zinc-300 hover:text-white transition-all cursor-pointer"
              title={`View Details for ${movie.title}`}
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Center Play Button on hover */}
          <div className="flex flex-col items-center justify-center my-auto">
            {movie.publicDomain ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setStreamingMovie(movie);
                }}
                className="w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:scale-110 transition-transform active:scale-95 cursor-pointer"
                title={`Stream Full Movie: ${movie.title}`}
              >
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </button>
            ) : movie.trailerKey ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setTrailerMovie(movie);
                }}
                className="w-12 h-12 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 flex items-center justify-center shadow-lg shadow-amber-500/30 hover:scale-110 transition-transform active:scale-95 cursor-pointer"
                title={`Watch Official Trailer: ${movie.title}`}
              >
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openMovieDetails(movie);
                }}
                className="w-12 h-12 rounded-2xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95 cursor-pointer"
                title={`Details for ${movie.title}`}
              >
                <Info className="w-5 h-5" />
              </button>
            )}
            <span className="text-[11px] font-semibold text-zinc-200 mt-2 bg-white/[0.1] px-2.5 py-0.5 rounded-lg backdrop-blur-md border border-white/10">
              {movie.publicDomain ? 'Stream Free' : movie.trailerKey ? 'Play Trailer' : 'Details'}
            </span>
          </div>

          {/* Bottom overview snippet on hover */}
          <div>
            <div className="text-[11px] font-semibold text-amber-300 truncate">
              {movie.genres?.slice(0, 2).join(' • ')}
            </div>
            <p itemProp="description" className="text-[10px] text-zinc-300 line-clamp-2 mt-0.5 leading-snug">
              {movie.overview}
            </p>
          </div>

        </div>

      </div>

      {/* Card Footer Info */}
      <div className="mt-2.5 space-y-0.5">
        <h3 itemProp="name" className="text-sm font-semibold text-zinc-100 group-hover:text-amber-400 transition-colors truncate">
          <a 
            href={movieCanonicalUrl}
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                e.preventDefault();
                openMovieDetails(movie);
              }
            }}
            className="hover:text-amber-400 block truncate"
          >
            {movie.title}
          </a>
        </h3>
        <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
          <span>{movie.releaseYear}</span>
          <span className="text-zinc-500">•</span>
          <span>{movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'Feature'}</span>
          <span className="text-zinc-500">•</span>
          <span itemProp="genre" className="text-zinc-400 text-[11px] truncate max-w-[70px]">{movie.genres?.[0]}</span>
        </div>
      </div>
    </article>
  );
};
