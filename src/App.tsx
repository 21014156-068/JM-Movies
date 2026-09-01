import React, { useState, useEffect } from 'react';
import { MovieProvider, useMovies } from './context/MovieContext';
import { Navbar } from './components/Navbar';
import { ExploreView } from './components/ExploreView';
import { PublicDomainView } from './components/PublicDomainView';
import { ComingSoonSection } from './components/ComingSoonSection';
import { CinemaRouletteView } from './components/CinemaRouletteView';
import { MovieBattleView } from './components/MovieBattleView';
import { CineQuizView } from './components/CineQuizView';
import { MovieDetailsView } from './components/MovieDetailsView';
import { TrailerModal } from './components/TrailerModal';
import { PublicDomainPlayer } from './components/PublicDomainPlayer';
import { AIConciergeModal } from './components/AIConciergeModal';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';
import { Movie } from './types';
import { Flame } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab } = useMovies();

  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [upcomingSource, setUpcomingSource] = useState<'tmdb_live' | 'curated_tmdb_cache'>('curated_tmdb_cache');
  const [isLoadingUpcoming, setIsLoadingUpcoming] = useState(false);

  useEffect(() => {
    // Pre-fetch upcoming movies for upcoming releases tab
    const fetchUpcoming = async () => {
      setIsLoadingUpcoming(true);
      try {
        const res = await fetch('/api/movies/upcoming');
        if (res.ok) {
          const upData = await res.json();
          if (Array.isArray(upData)) {
            setUpcomingMovies(upData);
          } else if (upData && Array.isArray(upData.movies)) {
            setUpcomingMovies(upData.movies);
            if (upData.source) setUpcomingSource(upData.source);
          }
        }
      } catch (err) {
        console.error('Error fetching upcoming movies:', err);
      } finally {
        setIsLoadingUpcoming(false);
      }
    };

    fetchUpcoming();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#05060f] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden">
      
      {/* Ambient Glowing Orbs Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-32 w-[550px] h-[550px] bg-amber-500/[0.07] rounded-full blur-[160px]" />
        <div className="absolute top-2/3 left-1/4 w-[500px] h-[500px] bg-purple-600/[0.08] rounded-full blur-[150px]" />
        <div className="absolute -bottom-32 right-1/3 w-[600px] h-[600px] bg-emerald-600/[0.06] rounded-full blur-[170px]" />
      </div>

      {/* Persistent Navigation Header */}
      <Navbar />

      {/* Main View Router */}
      <main className="relative z-10">
        {activeTab === 'movie-detail' && <MovieDetailsView />}

        {activeTab === 'home' && <ExploreView />}

        {activeTab === 'upcoming' && (
          <div className="pt-28 pb-24 w-full px-4 sm:px-8 lg:px-12 xl:px-16 space-y-8">
            <div className="border-b border-white/10 pb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                <Flame className="w-3.5 h-3.5" />
                Theatrical Calendar
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Upcoming 2026 Theatrical & IMAX Premieres
              </h1>
              <p className="text-sm text-zinc-300 mt-1">
                Countdowns, official studio trailers, and release dates for the most anticipated motion pictures.
              </p>
            </div>
            <ComingSoonSection 
              movies={upcomingMovies} 
              source={upcomingSource} 
              isLoading={isLoadingUpcoming} 
            />
          </div>
        )}

        {activeTab === 'public-domain' && <PublicDomainView />}

        {activeTab === 'roulette' && <CinemaRouletteView />}

        {activeTab === 'battle' && <MovieBattleView />}

        {activeTab === 'trivia' && <CineQuizView />}
      </main>

      {/* Global Modals & Overlays */}
      <TrailerModal />
      <PublicDomainPlayer />
      <AIConciergeModal />
      <Toast />

      {/* Global Footer */}
      <Footer />

    </div>
  );
};

export default function App() {
  return (
    <MovieProvider>
      <MainContent />
    </MovieProvider>
  );
}
