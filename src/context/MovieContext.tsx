import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Movie, ToastMessage } from '../types';

export type TabType = 'home' | 'upcoming' | 'public-domain' | 'collections' | 'roulette' | 'battle' | 'trivia' | 'movie-detail';

interface MovieContextType {
  activeMovie: Movie | null;
  setActiveMovie: (movie: Movie | null) => void;
  openMovieDetails: (movieId: string | Movie) => Promise<void>;
  closeMovieDetails: (targetTab?: TabType) => void;
  previousTab: TabType;
  
  trailerMovie: Movie | null;
  setTrailerMovie: (movie: Movie | null) => void;
  
  streamingMovie: Movie | null;
  setStreamingMovie: (movie: Movie | null) => void;

  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;

  isAiConciergeOpen: boolean;
  setAiConciergeOpen: (open: boolean) => void;

  watchlist: string[];
  isInWatchlist: (id: string) => boolean;
  toggleWatchlist: (movieId: string, movieTitle?: string) => void;
  isWatchlistOpen: boolean;
  setWatchlistOpen: (open: boolean) => void;
  sharedWatchlistIds: string[] | null;
  setSharedWatchlistIds: (ids: string[] | null) => void;

  isShortcutsOpen: boolean;
  setShortcutsOpen: (open: boolean) => void;

  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);
  const [trailerMovie, setTrailerMovie] = useState<Movie | null>(null);
  const [streamingMovie, setStreamingMovie] = useState<Movie | null>(null);

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [previousTab, setPreviousTab] = useState<TabType>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [isAiConciergeOpen, setAiConciergeOpen] = useState<boolean>(false);

  // Watchlist & Shortcuts State
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('jamal_watchlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isWatchlistOpen, setWatchlistOpen] = useState(false);
  const [sharedWatchlistIds, setSharedWatchlistIds] = useState<string[] | null>(null);
  const [isShortcutsOpen, setShortcutsOpen] = useState(false);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync watchlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('jamal_watchlist', JSON.stringify(watchlist));
    } catch {
      // ignore
    }
  }, [watchlist]);

  const isInWatchlist = (id: string) => watchlist.includes(id);

  const toggleWatchlist = (movieId: string, movieTitle?: string) => {
    setWatchlist(prev => {
      const exists = prev.includes(movieId);
      if (exists) {
        showToast(`Removed "${movieTitle || 'Movie'}" from your Watchlist`, 'info');
        return prev.filter(id => id !== movieId);
      } else {
        showToast(`Added "${movieTitle || 'Movie'}" to your Watchlist!`, 'success');
        return [movieId, ...prev];
      }
    });
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // Close open modals on Escape
      if (e.key === 'Escape') {
        if (isShortcutsOpen) {
          setShortcutsOpen(false);
          return;
        }
        if (isWatchlistOpen) {
          setWatchlistOpen(false);
          return;
        }
        if (isAiConciergeOpen) {
          setAiConciergeOpen(false);
          return;
        }
        if (trailerMovie) {
          setTrailerMovie(null);
          return;
        }
        if (streamingMovie) {
          setStreamingMovie(null);
          return;
        }
      }

      if (isInput) return;

      // "/" opens and focuses quick search
      if (e.key === '/') {
        e.preventDefault();
        const searchInput = document.getElementById('nav-quick-search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }

      // "?" opens shortcuts guide
      if (e.key === '?') {
        e.preventDefault();
        setShortcutsOpen(prev => !prev);
      }

      // "w" toggles watchlist
      if (e.key === 'w' || e.key === 'W') {
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          setWatchlistOpen(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isShortcutsOpen, isWatchlistOpen, isAiConciergeOpen, trailerMovie, streamingMovie]);

  // Check URL path or search parameters on initial mount or popstate (e.g. /movie/123/title or ?movie=...)
  useEffect(() => {
    const handleUrlState = async () => {
      try {
        let movieId: string | null = null;
        
        // 1. Check path-based URL (/movie/:id or /movie/:id/:slug)
        const path = window.location.pathname;
        if (path.startsWith('/movie/')) {
          const segments = path.split('/').filter(Boolean);
          if (segments[1]) {
            movieId = segments[1];
          }
        } else if (path.startsWith('/genre/')) {
          const segments = path.split('/').filter(Boolean);
          if (segments[1]) {
            const g = decodeURIComponent(segments[1]);
            setSelectedGenre(g.charAt(0).toUpperCase() + g.slice(1));
            setActiveTab('home');
          }
        } else if (path.startsWith('/year/')) {
          const segments = path.split('/').filter(Boolean);
          if (segments[1]) {
            setSearchQuery(segments[1]);
            setActiveTab('home');
          }
        } else if (path === '/upcoming') {
          setActiveTab('upcoming');
        } else if (path === '/public-domain') {
          setActiveTab('public-domain');
        } else if (path === '/roulette') {
          setActiveTab('roulette');
        } else if (path === '/battle') {
          setActiveTab('battle');
        } else if (path === '/trivia') {
          setActiveTab('trivia');
        }

        // 2. Check query param fallback (?movie=..., ?genre=..., ?search=...)
        const params = new URLSearchParams(window.location.search);
        if (!movieId) {
          movieId = params.get('movie') || params.get('id');
        }
        const gParam = params.get('genre');
        if (gParam) {
          setSelectedGenre(gParam);
        }
        const sParam = params.get('search') || params.get('q');
        if (sParam) {
          setSearchQuery(sParam);
        }

        const wlParam = params.get('watchlist');
        if (wlParam) {
          const ids = wlParam.split(',').map(s => s.trim()).filter(Boolean);
          if (ids.length > 0) {
            setSharedWatchlistIds(ids);
            setWatchlistOpen(true);
          }
        }

        if (movieId) {
          const res = await fetch(`/api/movies/${movieId}`);
          if (res.ok) {
            const data = await res.json();
            if (data.movie) {
              setActiveMovie(data.movie);
              setActiveTab('movie-detail');
            }
          }
        }
      } catch (err) {
        console.error('Error parsing URL state:', err);
      }
    };

    handleUrlState();

    const onPopState = (e: PopStateEvent) => {
      if (e.state && e.state.movieId) {
        openMovieDetails(e.state.movieId);
      } else {
        const path = window.location.pathname;
        let movieId: string | null = null;
        if (path.startsWith('/movie/')) {
          const segments = path.split('/').filter(Boolean);
          movieId = segments[1] || null;
        }
        if (!movieId) {
          const params = new URLSearchParams(window.location.search);
          movieId = params.get('movie');
        }

        if (movieId) {
          openMovieDetails(movieId);
        } else {
          setActiveTab(prev => (prev === 'movie-detail' ? 'home' : prev));
          setActiveMovie(null);
        }
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const showToast = (message: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const openMovieDetails = async (item: string | Movie) => {
    if (activeTab !== 'movie-detail') {
      setPreviousTab(activeTab);
    }
    setActiveTab('movie-detail');

    const movieId = typeof item === 'string' ? item : item.id;
    const title = typeof item === 'string' ? '' : item.title;
    const slug = title ? encodeURIComponent(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) : '';
    
    // Update browser URL to clean permalink for deep linking, sharing and Google Indexing
    try {
      const newUrl = slug ? `/movie/${encodeURIComponent(movieId)}/${slug}` : `/movie/${encodeURIComponent(movieId)}`;
      window.history.pushState({ movieId, tab: 'movie-detail' }, '', newUrl);

      // Trigger IndexNow crawler notification in background
      fetch('/api/seo/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: [`${window.location.origin}${newUrl}`] })
      }).catch(() => {});
    } catch {
      // ignore
    }

    if (typeof item === 'string') {
      try {
        const res = await fetch(`/api/movies/${item}`);
        if (res.ok) {
          const data = await res.json();
          setActiveMovie(data.movie);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      setActiveMovie(item);
      // Fetch full details in background (cast, crew, budget, reviews)
      try {
        const res = await fetch(`/api/movies/${item.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.movie) {
            setActiveMovie(data.movie);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeMovieDetails = (targetTab?: TabType) => {
    const returnTab = targetTab || (previousTab === 'movie-detail' ? 'home' : previousTab);
    setActiveTab(returnTab);
    
    // Clean URL
    try {
      window.history.pushState(null, '', '/');
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <MovieContext.Provider
      value={{
        activeMovie,
        setActiveMovie,
        openMovieDetails,
        closeMovieDetails,
        previousTab,
        trailerMovie,
        setTrailerMovie,
        streamingMovie,
        setStreamingMovie,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedGenre,
        setSelectedGenre,
        isAiConciergeOpen,
        setAiConciergeOpen,
        watchlist,
        isInWatchlist,
        toggleWatchlist,
        isWatchlistOpen,
        setWatchlistOpen,
        sharedWatchlistIds,
        setSharedWatchlistIds,
        isShortcutsOpen,
        setShortcutsOpen,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
};
