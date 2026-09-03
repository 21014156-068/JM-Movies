import React, { useEffect, useState } from 'react';
import { X, Bookmark, Share2, Play, Tv, Trash2, Film, Check, ExternalLink, Plus } from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { Movie } from '../types';

export const WatchlistModal: React.FC = () => {
  const {
    isWatchlistOpen,
    setWatchlistOpen,
    watchlist,
    toggleWatchlist,
    sharedWatchlistIds,
    setSharedWatchlistIds,
    openMovieDetails,
    setTrailerMovie,
    setStreamingMovie,
    showToast,
  } = useMovies();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const activeIds = sharedWatchlistIds || watchlist;
  const isViewingShared = !!sharedWatchlistIds;

  useEffect(() => {
    if (!isWatchlistOpen) return;

    const fetchWatchlistMovies = async () => {
      if (activeIds.length === 0) {
        setMovies([]);
        return;
      }
      setIsLoading(true);
      try {
        const fetched: Movie[] = [];
        // Fetch up to 30 items
        for (const id of activeIds.slice(0, 30)) {
          try {
            const res = await fetch(`/api/movies/${id}`);
            if (res.ok) {
              const data = await res.json();
              if (data.movie) fetched.push(data.movie);
            }
          } catch {
            // continue
          }
        }
        setMovies(fetched);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatchlistMovies();
  }, [isWatchlistOpen, JSON.stringify(activeIds)]);

  if (!isWatchlistOpen) return null;

  const handleShare = () => {
    const idsToShare = isViewingShared ? sharedWatchlistIds : watchlist;
    if (!idsToShare || idsToShare.length === 0) {
      showToast('Add at least one movie to share your watchlist', 'info');
      return;
    }
    const shareUrl = `${window.location.origin}/?watchlist=${idsToShare.join(',')}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      showToast('Watchlist permalink copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handleImportShared = () => {
    if (!sharedWatchlistIds) return;
    sharedWatchlistIds.forEach(id => {
      if (!watchlist.includes(id)) {
        toggleWatchlist(id);
      }
    });
    setSharedWatchlistIds(null);
    showToast(`Saved ${sharedWatchlistIds.length} shared movies to your personal Watchlist!`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#090c1e] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] text-white">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-transparent to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Bookmark className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                {isViewingShared ? 'Shared Movie Watchlist' : 'My Cinema Watchlist'}
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-amber-300 font-mono font-normal">
                  {activeIds.length}
                </span>
              </h2>
              <p className="text-[11px] text-zinc-400">
                {isViewingShared ? 'A curated movie collection shared with you' : 'Your saved cinema queue across sessions'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeIds.length > 0 && (
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-xs font-semibold text-zinc-200 hover:text-white transition-all cursor-pointer"
                title="Share this Watchlist"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-amber-400" />}
                <span>{copied ? 'Copied' : 'Share'}</span>
              </button>
            )}

            <button
              onClick={() => {
                setWatchlistOpen(false);
                if (isViewingShared) setSharedWatchlistIds(null);
              }}
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Shared Watchlist Banner */}
        {isViewingShared && (
          <div className="px-6 py-3 bg-amber-500/15 border-b border-amber-500/30 flex items-center justify-between text-xs">
            <span className="text-amber-200">
              Someone shared these <strong>{sharedWatchlistIds?.length}</strong> movies with you!
            </span>
            <button
              onClick={handleImportShared}
              className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black rounded-lg transition-colors cursor-pointer text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Import to My Watchlist</span>
            </button>
          </div>
        )}

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 divide-y divide-white/[0.06]">
          {isLoading ? (
            <div className="py-16 text-center text-sm text-zinc-400">
              <div className="inline-block w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-2" />
              <p>Loading your cinema collection...</p>
            </div>
          ) : movies.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-3xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-zinc-400">
                <Film className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Your Watchlist is empty</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Click the bookmark icon on any film card or movie page to queue it here for later viewing.
                </p>
              </div>
            </div>
          ) : (
            movies.map(movie => (
              <div
                key={`watchlist-${movie.id}`}
                className="pt-3 first:pt-0 flex items-center justify-between gap-4 group"
              >
                <div
                  onClick={() => {
                    openMovieDetails(movie);
                    setWatchlistOpen(false);
                  }}
                  className="flex items-center gap-3.5 cursor-pointer overflow-hidden flex-1"
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-12 h-16 object-cover rounded-xl shrink-0 bg-zinc-800 border border-white/10 group-hover:border-amber-400/50 transition-colors"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80');
                    }}
                  />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                      {movie.title}
                    </h4>
                    <div className="text-xs text-zinc-400 flex items-center gap-2 mt-0.5">
                      <span>{movie.releaseYear}</span>
                      <span>•</span>
                      <span className="text-amber-400 font-semibold">★ {movie.rating.toFixed(1)}</span>
                      {movie.genres?.[0] && (
                        <>
                          <span>•</span>
                          <span className="text-zinc-500 truncate">{movie.genres[0]}</span>
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

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {movie.publicDomain && movie.streamUrl && (
                    <button
                      onClick={() => {
                        setStreamingMovie(movie);
                        setWatchlistOpen(false);
                      }}
                      className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                      title="Watch Free Stream"
                    >
                      <Tv className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Stream</span>
                    </button>
                  )}

                  {movie.trailerKey && (
                    <button
                      onClick={() => {
                        setTrailerMovie(movie);
                        setWatchlistOpen(false);
                      }}
                      className="p-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-zinc-200 hover:text-white border border-white/15 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                      title="Watch Trailer"
                    >
                      <Play className="w-3.5 h-3.5 text-amber-400" />
                      <span className="hidden sm:inline">Trailer</span>
                    </button>
                  )}

                  <button
                    onClick={() => toggleWatchlist(movie.id, movie.title)}
                    className="p-2 rounded-xl hover:bg-rose-500/20 text-zinc-400 hover:text-rose-300 transition-colors cursor-pointer"
                    title="Remove from Watchlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-white/[0.02] border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
          <span>Press <strong>W</strong> anytime to toggle Watchlist</span>
          <button
            onClick={() => {
              setWatchlistOpen(false);
              if (isViewingShared) setSharedWatchlistIds(null);
            }}
            className="text-amber-400 hover:underline cursor-pointer font-medium"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
