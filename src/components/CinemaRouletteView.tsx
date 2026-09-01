import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Sparkles, 
  RotateCw, 
  Tv, 
  Star, 
  Clock, 
  Film, 
  Flame, 
  Compass, 
  CheckCircle2, 
  Tag, 
  Share2,
  Zap,
  ExternalLink
} from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { Movie } from '../types';
import { AdSlotBanner } from './AdSlotBanner';
import { openAdsterraLink, getRandomAdsterraLink } from '../utils/adsterra';

interface MoodOption {
  id: string;
  label: string;
  emoji: string;
  description: string;
  color: string;
}

const MOODS: MoodOption[] = [
  { id: 'all', label: 'Surprise Me (Chaos)', emoji: '🎲', description: 'Any acclaimed movie from any era or genre', color: 'from-amber-500 to-orange-600' },
  { id: 'scifi', label: 'Mind-Bending Sci-Fi', emoji: '🚀', description: 'Space odysseys, time travel & futuristic concepts', color: 'from-cyan-500 to-blue-600' },
  { id: 'horror', label: 'Adrenaline & Chills', emoji: '😱', description: 'Psychological thrillers, creatures & suspense', color: 'from-rose-600 to-red-800' },
  { id: 'action', label: 'High-Octane Action', emoji: '💥', description: 'Explosive blockbusters, martial arts & stunts', color: 'from-amber-400 to-yellow-600' },
  { id: 'drama', label: 'Award Masterpiece', emoji: '🎭', description: 'Deep character studies & cinematic classics', color: 'from-purple-500 to-indigo-700' },
  { id: 'fast90', label: 'Quick 90-Min Flick', emoji: '⚡', description: 'Tight pacing under 100 minutes without fluff', color: 'from-emerald-400 to-teal-600' },
  { id: 'classic', label: 'Free Golden Era Stream', emoji: '🏛️', description: '100% legal public domain vintage cinema', color: 'from-amber-300 to-amber-700' },
  { id: '2026', label: '2026 Upcoming Hype', emoji: '🔥', description: 'The hottest future theatrical premieres', color: 'from-rose-500 to-purple-600' },
];

export const CinemaRouletteView: React.FC = () => {
  const { openMovieDetails, setTrailerMovie, setStreamingMovie, showToast } = useMovies();

  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(7);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [spinCount, setSpinCount] = useState<number>(0);
  const [recentSpins, setRecentSpins] = useState<Movie[]>([]);
  const [tickerMovies, setTickerMovies] = useState<string[]>([]);

  // Spin the wheel
  const handleSpin = async () => {
    if (isSpinning) return;
    setIsSpinning(true);

    try {
      const queryParams = new URLSearchParams();
      if (selectedMood !== 'all') queryParams.append('mood', selectedMood);
      if (minRating > 0) queryParams.append('minRating', String(minRating));

      // Fetch target movie from backend
      const res = await fetch(`/api/engagement/roulette?${queryParams.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch roulette movie');
      const data = await res.json();
      const movie: Movie = data.movie;

      // Simulated dramatic roulette slot animation ticks
      const tickerSampleTitles = [
        'Dune: Part Two', 'Interstellar', 'Oppenheimer', 'Nosferatu',
        'Metropolis', 'Inception', 'The Dark Knight', 'Blade Runner 2049',
        'Night of the Living Dead', 'Spider-Man: Beyond the Spider-Verse', movie.title
      ];
      setTickerMovies(tickerSampleTitles);

      // Play tick animations for 1.8 seconds
      setTimeout(() => {
        setSelectedMovie(movie);
        setIsSpinning(false);
        setSpinCount(prev => prev + 1);
        setRecentSpins(prev => [movie, ...prev.filter(m => m.id !== movie.id)].slice(0, 6));
      }, 1600);

    } catch (err) {
      console.error(err);
      setIsSpinning(false);
      showToast('Spin failed, please try again!', 'error');
    }
  };

  // Initial spin on mount
  useEffect(() => {
    handleSpin();
  }, []);

  const handleShare = () => {
    if (!selectedMovie) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/?movie=${selectedMovie.id}`);
      showToast('Movie link copied to clipboard!', 'success');
    }
  };

  return (
    <div className="pt-28 pb-24 w-full px-4 sm:px-8 lg:px-12 xl:px-16 space-y-10">
      
      {/* Header Banner */}
      <div className="border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Random Movie Wheel
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Cinema Roulette: Instant Film Matcher
          </h1>
          <p className="text-sm text-zinc-300 mt-1 max-w-2xl">
            Choose your mood, lock in your standards, and spin the reel to discover your next cinematic watch with full HD trailers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-zinc-300 flex items-center gap-2">
            <span className="font-mono text-amber-400 font-bold">{spinCount}</span> spins this session
          </div>
        </div>
      </div>

      {/* Main Roulette Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Mood & Filter Controls (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-2xl space-y-5 shadow-2xl">
            <h3 className="text-sm font-mono uppercase tracking-wider text-zinc-300 font-bold flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              1. Select Your Vibe
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              {MOODS.map(m => {
                const isSelected = selectedMood === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMood(m.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 border-amber-400/50 shadow-md shadow-amber-500/10 text-white'
                        : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/5 text-zinc-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl group-hover:scale-110 transition-transform">{m.emoji}</span>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                          {m.label}
                        </div>
                        <div className="text-[10px] text-zinc-400 leading-tight mt-0.5">
                          {m.description}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Minimum Rating Slider */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300 font-semibold">Min Score:</span>
                <span className="font-mono font-bold text-amber-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {minRating > 0 ? `${minRating}+ / 10` : 'Any Rating'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="8.5"
                step="0.5"
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                <span>Any Quality</span>
                <span>7.0+ Recommended</span>
                <span>8.0+ Elite</span>
              </div>
            </div>

            {/* Giant Spin Trigger Button */}
            <button
              onClick={handleSpin}
              disabled={isSpinning}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-zinc-950 font-black text-base shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'SPINNING REEL...' : 'SPIN ROULETTE'}</span>
            </button>
          </div>

          {/* Adsterra Ready Medium Rectangle */}
          <AdSlotBanner placement="medium-rectangle" />
        </div>

        {/* Right Column: Resulting Movie Showcase (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Card View */}
          <div className="relative rounded-3xl bg-[#0a0d1f]/95 border border-white/15 overflow-hidden backdrop-blur-2xl shadow-2xl transition-all">
            
            {/* Spinning Animation Overlay */}
            {isSpinning ? (
              <div className="h-[480px] flex flex-col items-center justify-center p-8 space-y-6 text-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-amber-400/20 border-t-amber-400 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-3xl">
                    🎰
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-mono text-amber-400 uppercase tracking-widest animate-pulse font-bold">
                    Scanning Catalog Universe...
                  </div>
                  <h3 className="text-2xl font-black text-white">
                    Matching Cinema Masterpieces
                  </h3>
                  <p className="text-xs text-zinc-400 max-w-sm">
                    Filtering high-definition trailers, audience ratings, and directorial masterpieces...
                  </p>
                </div>
              </div>
            ) : selectedMovie ? (
              <div>
                {/* Backdrop Hero Header */}
                <div className="relative h-72 sm:h-96 w-full bg-zinc-900 overflow-hidden">
                  <img
                    src={selectedMovie.backdrop || selectedMovie.poster}
                    alt={selectedMovie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d1f] via-[#0a0d1f]/60 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-xl bg-amber-500/30 backdrop-blur-xl border border-amber-400/40 text-amber-300 text-xs font-mono font-black uppercase">
                      🎉 Roulette Match
                    </span>
                    <button
                      onClick={handleShare}
                      className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white transition-all cursor-pointer"
                      title="Share movie"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Movie Info on Backdrop */}
                  <div className="absolute bottom-6 left-6 right-6 space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="flex items-center gap-1 text-amber-300 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-xl border border-amber-400/30 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {selectedMovie.rating?.toFixed(1) || '8.0'} / 10
                      </span>
                      <span className="px-2.5 py-1 rounded-xl bg-black/50 backdrop-blur-md text-zinc-300 border border-white/10 font-semibold">
                        {selectedMovie.releaseYear}
                      </span>
                      {selectedMovie.runtime > 0 && (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/50 backdrop-blur-md text-zinc-300 border border-white/10">
                          <Clock className="w-3 h-3" />
                          {selectedMovie.runtime}m
                        </span>
                      )}
                      {selectedMovie.genres?.map(g => (
                        <span key={g} className="px-2.5 py-1 rounded-xl bg-white/10 backdrop-blur-md text-zinc-200 border border-white/10">
                          {g}
                        </span>
                      ))}
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                      {selectedMovie.title}
                    </h2>
                  </div>
                </div>

                {/* Body Details & Immediate CTA Triggers */}
                <div className="p-6 sm:p-8 space-y-6">
                  
                  {/* Action Buttons Bar */}
                  <div className="flex flex-wrap items-center gap-3">
                    {selectedMovie.trailerKey && (
                      <button
                        onClick={() => setTrailerMovie(selectedMovie)}
                        className="flex-1 sm:flex-initial px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-sm shadow-xl shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-zinc-950" />
                        <span>Watch Official HD Trailer</span>
                      </button>
                    )}

                    {selectedMovie.publicDomain && (
                      <button
                        onClick={() => setStreamingMovie(selectedMovie)}
                        className="flex-1 sm:flex-initial px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-zinc-950 font-black text-sm shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Tv className="w-4 h-4" />
                        <span>Stream Full Film Free</span>
                      </button>
                    )}

                    {/* Adsterra 4K Server Mirror */}
                    <a
                      href={getRandomAdsterraLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => openAdsterraLink()}
                      className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
                    >
                      <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                      <span>Server 2: 4K Stream</span>
                      <ExternalLink className="w-3.5 h-3.5 text-purple-200" />
                    </a>

                    <button
                      onClick={() => openMovieDetails(selectedMovie)}
                      className="px-5 py-3.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-white font-bold text-sm transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
                    >
                      <Film className="w-4 h-4" />
                      <span>Full Synopsis & Cast</span>
                    </button>

                    <button
                      onClick={handleSpin}
                      className="px-5 py-3.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold text-sm transition-all hover:scale-105 cursor-pointer flex items-center gap-2"
                    >
                      <RotateCw className="w-4 h-4" />
                      <span>Spin Another</span>
                    </button>
                  </div>

                  {/* Overview */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
                      Narrative Synopsis
                    </h4>
                    <p className="text-sm sm:text-base text-zinc-200 leading-relaxed">
                      {selectedMovie.overview}
                    </p>
                  </div>

                  {/* Director & Cast Tags */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs">
                    <div>
                      <div className="text-zinc-400">Director</div>
                      <div className="font-bold text-white mt-0.5">{selectedMovie.director || 'Studio Production'}</div>
                    </div>
                    <div>
                      <div className="text-zinc-400">Starring</div>
                      <div className="font-bold text-white mt-0.5">
                        {selectedMovie.cast?.slice(0, 3).map(c => c.name).join(', ') || 'Featured Ensemble'}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ) : null}

          </div>

          {/* Recent Roulette Matches Bar */}
          {recentSpins.length > 1 && (
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Previous Roulette Results
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {recentSpins.map(m => (
                  <button
                    key={`hist-${m.id}`}
                    onClick={() => openMovieDetails(m)}
                    className="p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all text-left group cursor-pointer"
                  >
                    <div className="aspect-[2/3] rounded-xl overflow-hidden mb-2 bg-zinc-900">
                      <img src={m.poster} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="text-xs font-bold text-white truncate">{m.title}</div>
                    <div className="text-[10px] text-amber-400 font-mono">★ {m.rating?.toFixed(1)}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Monetization Leaderboard Ad Placement */}
          <AdSlotBanner placement="leaderboard" />

        </div>

      </div>

    </div>
  );
};
