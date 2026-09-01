import React, { useState, useEffect } from 'react';
import { 
  Swords, 
  Play, 
  Film, 
  Star, 
  Flame, 
  ChevronRight, 
  RotateCw, 
  Trophy, 
  Sparkles, 
  Check, 
  TrendingUp, 
  Share2,
  Zap,
  ExternalLink
} from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { Movie } from '../types';
import { AdSlotBanner } from './AdSlotBanner';
import { ADSTERRA_TARGETED_CHANNELS, openAdsterraLink } from '../utils/adsterra';

interface BattleMatchup {
  id: string;
  category: string;
  title: string;
  movieA: Movie;
  movieB: Movie;
  votesA: number;
  votesB: number;
}

export const MovieBattleView: React.FC = () => {
  const { openMovieDetails, setTrailerMovie, showToast } = useMovies();

  const [matchups, setMatchups] = useState<BattleMatchup[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userVoted, setUserVoted] = useState<'A' | 'B' | null>(null);
  const [voteStats, setVoteStats] = useState<{ percentA: number; percentB: number; totalVotes: number } | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [totalVotedCount, setTotalVotedCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load battles from server
  const fetchBattles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/engagement/battles');
      if (res.ok) {
        const data = await res.json();
        setMatchups(data.matchups || []);
      }
    } catch (err) {
      console.error('Failed to load battles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBattles();
  }, []);

  const currentBattle = matchups[currentIndex];

  const handleVote = async (choice: 'A' | 'B') => {
    if (!currentBattle || userVoted) return;

    setUserVoted(choice);
    setStreak(prev => prev + 1);
    setTotalVotedCount(prev => prev + 1);

    try {
      const res = await fetch('/api/engagement/battles/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          battleId: currentBattle.id,
          choice
        })
      });

      if (res.ok) {
        const data = await res.json();
        setVoteStats({
          percentA: data.percentA,
          percentB: data.percentB,
          totalVotes: data.totalVotes
        });
      } else {
        // Fallback local calc
        const newVA = choice === 'A' ? currentBattle.votesA + 1 : currentBattle.votesA;
        const newVB = choice === 'B' ? currentBattle.votesB + 1 : currentBattle.votesB;
        const total = newVA + newVB;
        setVoteStats({
          percentA: Math.round((newVA / total) * 100),
          percentB: Math.round((newVB / total) * 100),
          totalVotes: total
        });
      }
    } catch (err) {
      console.error('Vote error:', err);
    }
  };

  const handleNext = () => {
    setUserVoted(null);
    setVoteStats(null);
    if (currentIndex < matchups.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Loop back or refresh
      setCurrentIndex(0);
      fetchBattles();
    }
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <div className="pt-28 pb-24 w-full px-4 sm:px-8 lg:px-12 xl:px-16 space-y-10">
      
      {/* Header Banner */}
      <div className="border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Swords className="w-3.5 h-3.5" />
            Cinema Arena
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Movie Battles: Head-to-Head Clash
          </h1>
          <p className="text-sm text-zinc-300 mt-1 max-w-2xl">
            Which movie would you rather watch right now? Cast your vote, see real-time audience percentages, and unlock trailers!
          </p>
        </div>

        {/* User Engagement Streak Badges */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center gap-2 text-amber-300">
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold font-mono">{streak} Vote Streak</span>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-zinc-300 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-purple-400" />
            <span>{totalVotedCount} Total Votes</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="h-96 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-amber-400/20 border-t-amber-400 rounded-full animate-spin" />
        </div>
      ) : currentBattle ? (
        <div className="space-y-8">
          
          {/* Matchup Title Banner */}
          <div className="text-center space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs font-mono text-amber-300 uppercase tracking-widest">
              {currentBattle.category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {currentBattle.title}
            </h2>
          </div>

          {/* Dual Contenders Arena */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch relative">
            
            {/* VS Circle Center Badge */}
            <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-[#05060f] border-2 border-amber-400/60 shadow-[0_0_25px_rgba(245,158,11,0.4)] items-center justify-center">
              <span className="font-black font-sans text-base text-amber-400 italic">VS</span>
            </div>

            {/* CONTENDER A */}
            <div 
              className={`relative rounded-3xl bg-[#0a0d1f]/95 border overflow-hidden backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between shadow-2xl group ${
                userVoted === 'A'
                  ? 'border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.25)] ring-2 ring-amber-400/40'
                  : 'border-white/15 hover:border-white/30'
              }`}
            >
              <div>
                {/* Backdrop / Poster Banner */}
                <div className="relative h-64 sm:h-80 w-full bg-zinc-900 overflow-hidden">
                  <img
                    src={currentBattle.movieA.backdrop || currentBattle.movieA.poster}
                    alt={currentBattle.movieA.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d1f] via-[#0a0d1f]/40 to-transparent" />

                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 text-xs text-amber-400 font-bold font-mono">
                      ★ {currentBattle.movieA.rating?.toFixed(1) || '8.2'}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-6 right-6">
                    <div className="text-xs text-zinc-300 font-semibold mb-1">
                      {currentBattle.movieA.releaseYear} • {currentBattle.movieA.genres?.slice(0, 2).join(', ')}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {currentBattle.movieA.title}
                    </h3>
                  </div>
                </div>

                {/* Synopsis */}
                <div className="p-6 space-y-4">
                  <p className="text-xs sm:text-sm text-zinc-300 line-clamp-3 leading-relaxed">
                    {currentBattle.movieA.overview}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                    <span>Directed by {currentBattle.movieA.director || 'Acclaimed Studio'}</span>
                  </div>
                </div>
              </div>

              {/* Vote & Action Footer */}
              <div className="p-6 pt-0 space-y-3">
                {userVoted ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono font-bold">
                      <span className="text-white">Audience Vote</span>
                      <span className="text-amber-400 text-sm font-black">{voteStats?.percentA}%</span>
                    </div>
                    <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-700 rounded-full"
                        style={{ width: `${voteStats?.percentA || 50}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleVote('A')}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-sm sm:text-base shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>VOTE FOR THIS MOVIE</span>
                  </button>
                )}

                {/* Sub-actions for Movie A */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  {currentBattle.movieA.trailerKey && (
                    <button
                      onClick={() => setTrailerMovie(currentBattle.movieA)}
                      className="flex-1 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>Trailer</span>
                    </button>
                  )}
                  <button
                    onClick={() => openMovieDetails(currentBattle.movieA)}
                    className="flex-1 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            </div>

            {/* CONTENDER B */}
            <div 
              className={`relative rounded-3xl bg-[#0a0d1f]/95 border overflow-hidden backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between shadow-2xl group ${
                userVoted === 'B'
                  ? 'border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.25)] ring-2 ring-purple-400/40'
                  : 'border-white/15 hover:border-white/30'
              }`}
            >
              <div>
                {/* Backdrop / Poster Banner */}
                <div className="relative h-64 sm:h-80 w-full bg-zinc-900 overflow-hidden">
                  <img
                    src={currentBattle.movieB.backdrop || currentBattle.movieB.poster}
                    alt={currentBattle.movieB.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d1f] via-[#0a0d1f]/40 to-transparent" />

                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 text-xs text-purple-400 font-bold font-mono">
                      ★ {currentBattle.movieB.rating?.toFixed(1) || '8.1'}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-6 right-6">
                    <div className="text-xs text-zinc-300 font-semibold mb-1">
                      {currentBattle.movieB.releaseYear} • {currentBattle.movieB.genres?.slice(0, 2).join(', ')}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {currentBattle.movieB.title}
                    </h3>
                  </div>
                </div>

                {/* Synopsis */}
                <div className="p-6 space-y-4">
                  <p className="text-xs sm:text-sm text-zinc-300 line-clamp-3 leading-relaxed">
                    {currentBattle.movieB.overview}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                    <span>Directed by {currentBattle.movieB.director || 'Acclaimed Studio'}</span>
                  </div>
                </div>
              </div>

              {/* Vote & Action Footer */}
              <div className="p-6 pt-0 space-y-3">
                {userVoted ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono font-bold">
                      <span className="text-white">Audience Vote</span>
                      <span className="text-purple-400 text-sm font-black">{voteStats?.percentB}%</span>
                    </div>
                    <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-700 rounded-full"
                        style={{ width: `${voteStats?.percentB || 50}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleVote('B')}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm sm:text-base shadow-lg shadow-purple-600/25 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>VOTE FOR THIS MOVIE</span>
                  </button>
                )}

                {/* Sub-actions for Movie B */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  {currentBattle.movieB.trailerKey && (
                    <button
                      onClick={() => setTrailerMovie(currentBattle.movieB)}
                      className="flex-1 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
                      <span>Trailer</span>
                    </button>
                  )}
                  <button
                    onClick={() => openMovieDetails(currentBattle.movieB)}
                    className="flex-1 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Next Matchup Controller & Sponsored Mirror Trigger */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={handleNext}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 text-white font-black text-sm transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{userVoted ? 'CONTINUE TO NEXT BATTLE' : 'SKIP TO NEXT MATCHUP'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {userVoted && (
              <a
                href={ADSTERRA_TARGETED_CHANNELS.CLASH_VOTE_BONUS}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => openAdsterraLink(ADSTERRA_TARGETED_CHANNELS.CLASH_VOTE_BONUS)}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer animate-in zoom-in-95"
              >
                <Zap className="w-4 h-4 fill-zinc-950" />
                <span>⚡ Stream Clash Winner in 4K</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* In-feed Ad Banner Slot */}
          <AdSlotBanner placement="leaderboard" />

        </div>
      ) : null}

    </div>
  );
};
