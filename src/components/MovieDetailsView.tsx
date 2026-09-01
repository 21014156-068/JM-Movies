import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Play, 
  Star, 
  Clock, 
  Calendar, 
  Share2, 
  ThumbsUp, 
  MessageSquare, 
  Tv, 
  Film,
  Sparkles,
  User,
  HelpCircle,
  TrendingUp,
  Tag,
  Zap,
  ExternalLink,
  Bookmark,
  Heart,
  DollarSign,
  Globe,
  Award,
  Download,
  Video,
  CheckCircle2
} from 'lucide-react';
import { Movie, Review } from '../types';
import { useMovies } from '../context/MovieContext';
import { SEOHead } from './SEOHead';
import { generateKeywordsForMovie } from '../utils/seo';
import { AdSlotBanner } from './AdSlotBanner';
import { ADSTERRA_TARGETED_CHANNELS, openAdsterraLink, getRandomAdsterraLink } from '../utils/adsterra';

export const MovieDetailsView: React.FC = () => {
  const { 
    activeMovie, 
    setTrailerMovie, 
    setStreamingMovie,
    showToast,
    openMovieDetails,
    setSearchQuery,
    setActiveTab: setNavTab,
    previousTab,
    closeMovieDetails
  } = useMovies();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [activeTab, setActiveTab] = useState<'about' | 'cast' | 'reviews' | 'similar' | 'trailer'>('about');
  
  // Watchlist & Favorites Local State
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);

  // Review Submission State
  const [reviewerName, setReviewerName] = useState<string>('');
  const [userRating, setUserRating] = useState<number>(9);
  const [reviewTitle, setReviewTitle] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

  // Show inline trailer state
  const [showInlineTrailer, setShowInlineTrailer] = useState<boolean>(false);

  useEffect(() => {
    if (!activeMovie) return;

    // Reset inline player & default tab
    setShowInlineTrailer(false);
    setActiveTab('about');

    // Check localStorage bookmarks
    try {
      const savedWatchlist = JSON.parse(localStorage.getItem('jamal_watchlist') || '[]');
      setIsBookmarked(Array.isArray(savedWatchlist) && savedWatchlist.includes(activeMovie.id));
      
      const savedLikes = JSON.parse(localStorage.getItem('jamal_favorites') || '[]');
      setIsLiked(Array.isArray(savedLikes) && savedLikes.includes(activeMovie.id));
      setLikeCount((activeMovie.voteCount || 42) + (Array.isArray(savedLikes) && savedLikes.includes(activeMovie.id) ? 1 : 0));
    } catch {
      // ignore storage errors
    }

    // Fetch fresh reviews & similar movies for activeMovie
    const fetchDetails = async () => {
      try {
        const res = await fetch(`/api/movies/${activeMovie.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.reviews) setReviews(data.reviews);
          if (data.similar) setSimilarMovies(data.similar);
        }
      } catch (err) {
        console.error('Error fetching movie details:', err);
      }
    };
    fetchDetails();

    // Scroll to top of the page smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeMovie?.id]);

  if (!activeMovie) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-8 pt-32">
        <Film className="w-16 h-16 text-zinc-600 mb-4 animate-pulse" />
        <h2 className="text-2xl font-black text-white">Movie Not Found</h2>
        <p className="text-zinc-400 mt-2 max-w-md text-sm">
          The requested movie could not be loaded or was removed from the catalog.
        </p>
        <button
          onClick={() => closeMovieDetails()}
          className="mt-6 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-sm transition-all hover:scale-105 cursor-pointer shadow-lg shadow-amber-500/20"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const handleToggleBookmark = () => {
    try {
      const savedWatchlist = JSON.parse(localStorage.getItem('jamal_watchlist') || '[]');
      let updated: string[];
      if (isBookmarked) {
        updated = savedWatchlist.filter((id: string) => id !== activeMovie.id);
        setIsBookmarked(false);
        showToast(`Removed "${activeMovie.title}" from Watchlist`, 'info');
      } else {
        updated = [...savedWatchlist, activeMovie.id];
        setIsBookmarked(true);
        showToast(`Added "${activeMovie.title}" to your Watchlist!`, 'success');
      }
      localStorage.setItem('jamal_watchlist', JSON.stringify(updated));
    } catch {
      setIsBookmarked(!isBookmarked);
    }
  };

  const handleToggleLike = () => {
    try {
      const savedLikes = JSON.parse(localStorage.getItem('jamal_favorites') || '[]');
      let updated: string[];
      if (isLiked) {
        updated = savedLikes.filter((id: string) => id !== activeMovie.id);
        setIsLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
        showToast('Removed from Favorites', 'info');
      } else {
        updated = [...savedLikes, activeMovie.id];
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
        showToast('Marked as Favorite Movie! ❤️', 'success');
      }
      localStorage.setItem('jamal_favorites', JSON.stringify(updated));
    } catch {
      setIsLiked(!isLiked);
    }
  };

  const movieSlug = activeMovie?.title 
    ? encodeURIComponent(activeMovie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) 
    : '';
  const movieCanonicalUrl = activeMovie ? `/movie/${activeMovie.id}/${movieSlug}` : '/';

  const handleShare = () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}${movieCanonicalUrl}` : '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast('Movie link copied to clipboard!', 'success');
    } else {
      showToast('Share link: ' + url, 'info');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reviewComment.trim()) {
      showToast('Please write a review comment', 'warning');
      return;
    }

    const name = reviewerName.trim() || 'Cinema Enthusiast';
    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/movies/${activeMovie.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rating: userRating,
          title: reviewTitle.trim() || `${name}'s Review`,
          comment: reviewComment.trim(),
          userName: name
        })
      });

      if (res.ok) {
        const newReview: Review = await res.json();
        setReviews([newReview, ...reviews]);
        setReviewTitle('');
        setReviewComment('');
        showToast('Review submitted successfully!', 'success');
      } else {
        // Fallback local addition
        const localReview: Review = {
          id: `rev-${Date.now()}`,
          movieId: activeMovie.id,
          userId: 'guest',
          userName: name,
          userAvatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
          rating: userRating,
          title: reviewTitle.trim() || `${name}'s Review`,
          comment: reviewComment.trim(),
          likes: 1,
          createdAt: new Date().toISOString()
        };
        setReviews([localReview, ...reviews]);
        setReviewTitle('');
        setReviewComment('');
        showToast('Review posted!', 'success');
      }
    } catch {
      showToast('Error submitting review', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleLikeReview = (reviewId: string) => {
    setReviews(reviews.map(r => r.id === reviewId ? { ...r, likes: (r.likes || 0) + 1 } : r));
    showToast('Marked review as helpful!', 'info');
  };

  const formatCurrency = (amount?: number) => {
    if (!amount || amount <= 0) return 'Undisclosed';
    if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(2)} Billion`;
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)} Million`;
    return `$${amount.toLocaleString()}`;
  };

  const formattedRuntime = activeMovie.runtime 
    ? `${Math.floor(activeMovie.runtime / 60)}h ${activeMovie.runtime % 60}m` 
    : 'Feature Length';

  return (
    <div className="relative min-h-screen pt-20 pb-28 text-zinc-100 overflow-x-hidden">
      
      {/* Comprehensive Dynamic SEO Meta & JSON-LD Injection */}
      <SEOHead 
        title={`${activeMovie.title} (${activeMovie.releaseYear}) — Cast, Trailer, Reviews & Stream`}
        description={`${activeMovie.title} (${activeMovie.releaseYear}): ${activeMovie.overview?.slice(0, 160)}... Watch official 4K trailers, full cast list, crew info, and audience ratings on Jamal Movies.`}
        image={activeMovie.backdrop || activeMovie.poster}
        url={movieCanonicalUrl}
        type="video.movie"
        movie={activeMovie}
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: activeMovie.genres?.[0] || 'Movies', item: `/?genre=${activeMovie.genres?.[0] || 'All'}` },
          { name: activeMovie.title, item: movieCanonicalUrl }
        ]}
      />

      {/* Top Breadcrumbs & Back Navigation Bar */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white/[0.04] backdrop-blur-xl border border-white/10 px-4 py-3 rounded-2xl shadow-lg">
          
          {/* Back Button */}
          <button
            onClick={() => closeMovieDetails()}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 text-white font-bold text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Back to {previousTab === 'upcoming' ? 'Upcoming Premieres' : previousTab === 'public-domain' ? 'Free Movies' : previousTab === 'roulette' ? 'Roulette' : previousTab === 'battle' ? 'Battles' : previousTab === 'trivia' ? 'CineQuiz' : 'Catalog'}</span>
          </button>

          {/* Breadcrumb Path */}
          <div className="hidden md:flex items-center gap-2 text-xs text-zinc-400 font-medium">
            <button onClick={() => setNavTab('home')} className="hover:text-amber-300 transition-colors cursor-pointer">Catalog</button>
            <span>/</span>
            {activeMovie.genres?.[0] && (
              <>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setNavTab('home');
                  }} 
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  {activeMovie.genres[0]}
                </button>
                <span>/</span>
              </>
            )}
            <span className="text-white font-semibold truncate max-w-xs">{activeMovie.title}</span>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Watchlist Toggle */}
            <button
              onClick={handleToggleBookmark}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isBookmarked 
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm shadow-amber-500/20' 
                  : 'bg-white/[0.06] border-white/15 text-zinc-300 hover:text-white hover:bg-white/[0.12]'
              }`}
              title={isBookmarked ? 'In Watchlist' : 'Add to Watchlist'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span className="hidden sm:inline">{isBookmarked ? 'In Watchlist' : 'Watchlist'}</span>
            </button>

            {/* Favorite Like Toggle */}
            <button
              onClick={handleToggleLike}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isLiked 
                  ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-sm shadow-rose-500/20' 
                  : 'bg-white/[0.06] border-white/15 text-zinc-300 hover:text-rose-300 hover:bg-white/[0.12]'
              }`}
              title="Like this movie"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span className="hidden sm:inline">{likeCount}</span>
            </button>

            {/* Share Link */}
            <button
              onClick={handleShare}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.14] border border-white/15 text-zinc-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Share Movie Link"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* High-CTR Sponsored 4K Direct Server */}
            <a
              href={ADSTERRA_TARGETED_CHANNELS.NAVBAR_VIP_STREAM}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => openAdsterraLink(ADSTERRA_TARGETED_CHANNELS.NAVBAR_VIP_STREAM)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-zinc-950" />
              <span className="hidden sm:inline">Server 2 (4K)</span>
              <span className="sm:hidden">4K</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>
      </div>

      {/* HERO SECTION: Cinematic Backdrop & Primary Metadata */}
      <section className="relative w-full overflow-hidden">
        {/* Massive Ambient Backdrop Banner */}
        <div className="relative h-[360px] sm:h-[480px] lg:h-[560px] w-full bg-zinc-950">
          <img
            src={activeMovie.backdrop || activeMovie.poster}
            alt={`${activeMovie.title} Backdrop`}
            className="w-full h-full object-cover object-center scale-105 blur-[1px] opacity-70"
            referrerPolicy="no-referrer"
          />
          {/* Gradients to seamlessly blend backdrop into deep dark background */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#05060f] via-[#05060f]/65 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#05060f]/95 via-[#05060f]/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#05060f] to-transparent" />
        </div>

        {/* Floating Content Over Backdrop */}
        <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 xl:px-16 -mt-64 sm:-mt-80 lg:-mt-96">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            
            {/* Poster Card with 3D Border & Badges */}
            <div className="lg:col-span-4 xl:col-span-3 flex justify-center lg:justify-start">
              <div className="relative w-56 sm:w-64 lg:w-full aspect-[2/3] rounded-3xl overflow-hidden bg-white/[0.04] border-2 border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl group">
                <img
                  src={activeMovie.poster}
                  alt={`${activeMovie.title} Official Poster`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).setAttribute('src', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80');
                  }}
                />
                
                {/* Poster Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xl px-2.5 py-1 rounded-xl border border-white/15 text-xs font-bold text-amber-300 shadow-md">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{activeMovie.rating.toFixed(1)}</span>
                  </div>

                  {activeMovie.publicDomain ? (
                    <div className="flex items-center gap-1 bg-emerald-500/30 backdrop-blur-xl px-2.5 py-1 rounded-xl border border-emerald-500/50 text-xs font-bold text-emerald-300 font-mono shadow-md">
                      <Tv className="w-3 h-3" />
                      <span>FREE STREAM</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 bg-amber-500/30 backdrop-blur-xl px-2.5 py-1 rounded-xl border border-amber-500/50 text-xs font-bold text-amber-300 font-mono shadow-md">
                      <Zap className="w-3 h-3 fill-amber-400" />
                      <span>4K ULTRA HD</span>
                    </div>
                  )}
                </div>

                {/* Poster Bottom Hover Trigger */}
                {activeMovie.trailerKey && (
                  <div 
                    onClick={() => setShowInlineTrailer(true)}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                    <span className="text-xs font-black text-white mt-2 drop-shadow">Play Trailer</span>
                  </div>
                )}
              </div>
            </div>

            {/* Primary Movie Details & Action Header */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-4">
              
              {/* Badges Bar */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                <span className="flex items-center gap-1 text-amber-300 bg-amber-500/15 backdrop-blur-xl px-3 py-1 rounded-xl border border-amber-500/30 shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-black text-sm">{activeMovie.rating.toFixed(1)}</span>
                  <span className="text-zinc-400 text-[11px]">/ 10 ({activeMovie.voteCount || 100} votes)</span>
                </span>

                <span className="text-zinc-200 bg-white/[0.08] backdrop-blur-xl px-3 py-1 rounded-xl border border-white/15 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{activeMovie.releaseDate || activeMovie.releaseYear}</span>
                </span>

                <span className="text-zinc-200 bg-white/[0.08] backdrop-blur-xl px-3 py-1 rounded-xl border border-white/15 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{formattedRuntime}</span>
                </span>

                {activeMovie.certification && (
                  <span className="font-mono text-xs font-bold bg-white/[0.12] backdrop-blur-xl text-amber-300 px-2.5 py-1 rounded-xl border border-white/20">
                    {activeMovie.certification}
                  </span>
                )}

                {activeMovie.popularity && (
                  <span className="text-zinc-300 bg-purple-500/15 backdrop-blur-xl px-3 py-1 rounded-xl border border-purple-500/30 flex items-center gap-1 font-mono text-[11px]">
                    <TrendingUp className="w-3 h-3 text-purple-400" />
                    <span>Popularity #{Math.round(activeMovie.popularity)}</span>
                  </span>
                )}

                {activeMovie.publicDomain && (
                  <span className="font-mono text-xs font-bold bg-emerald-500/20 backdrop-blur-xl text-emerald-300 px-3 py-1 rounded-xl border border-emerald-500/40">
                    Verified Public Domain
                  </span>
                )}
              </div>

              {/* Title & Tagline */}
              <div>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-lg leading-tight">
                  {activeMovie.title}
                </h1>
                {activeMovie.originalTitle && activeMovie.originalTitle !== activeMovie.title && (
                  <div className="text-zinc-400 text-sm mt-1">
                    Original Title: <span className="text-zinc-300 italic font-medium">{activeMovie.originalTitle}</span>
                  </div>
                )}
                {activeMovie.tagline && (
                  <p className="text-amber-300/90 text-base sm:text-lg italic font-serif mt-2 max-w-3xl">
                    "{activeMovie.tagline}"
                  </p>
                )}
              </div>

              {/* Genre Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {activeMovie.genres?.map(genre => (
                  <button
                    key={genre}
                    onClick={() => {
                      setSearchQuery('');
                      setNavTab('home');
                    }}
                    className="px-3.5 py-1 rounded-xl text-xs font-bold bg-white/[0.08] hover:bg-amber-500/20 border border-white/15 hover:border-amber-400/40 text-zinc-200 hover:text-amber-300 backdrop-blur-md transition-all cursor-pointer"
                  >
                    {genre}
                  </button>
                ))}
              </div>

              {/* Primary Call-to-Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                {/* Legal Streaming Action */}
                {activeMovie.publicDomain ? (
                  <button
                    onClick={() => setStreamingMovie(activeMovie)}
                    className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black text-sm shadow-xl shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Tv className="w-5 h-5" />
                    <span>STREAM FULL MOVIE FREE</span>
                  </button>
                ) : activeMovie.trailerKey ? (
                  <button
                    onClick={() => {
                      setShowInlineTrailer(true);
                      window.scrollTo({ top: 350, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-sm shadow-xl shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Play className="w-5 h-5 fill-zinc-950" />
                    <span>PLAY OFFICIAL TRAILER</span>
                  </button>
                ) : null}

                {/* Overlay Trailer Button if trailer exists */}
                {activeMovie.trailerKey && (
                  <button
                    onClick={() => setTrailerMovie(activeMovie)}
                    className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 text-white font-bold text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Video className="w-4 h-4 text-amber-400" />
                    <span>Popup Player</span>
                  </button>
                )}

                {/* High-Converting Adsterra Server 2 4K Stream Mirror */}
                <a
                  href={getRandomAdsterraLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => openAdsterraLink()}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-purple-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>SERVER 2: 4K STREAM</span>
                  <ExternalLink className="w-3.5 h-3.5 text-purple-200" />
                </a>

                {/* Fast Download Mirror */}
                <a
                  href={ADSTERRA_TARGETED_CHANNELS.FAST_DOWNLOAD_SERVER}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => openAdsterraLink(ADSTERRA_TARGETED_CHANNELS.FAST_DOWNLOAD_SERVER)}
                  className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 text-white font-bold text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>HD Download Mirror</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* INLINE TRAILER SHOWCASE (If Active) */}
      {showInlineTrailer && activeMovie.trailerKey && (
        <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 mt-12 animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-[#0a0d1f] border border-amber-500/30 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <h3 className="text-base sm:text-lg font-black text-white">
                  Official HD Trailer — {activeMovie.title}
                </h3>
              </div>
              <button
                onClick={() => setShowInlineTrailer(false)}
                className="px-3 py-1 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] text-xs text-zinc-300 font-bold cursor-pointer"
              >
                Close Video Player ✕
              </button>
            </div>

            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner border border-white/10">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeMovie.trailerKey}?autoplay=1&rel=0&modestbranding=1`}
                title={`${activeMovie.title} Official Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </section>
      )}

      {/* MAIN CONTENT DEEP DIVE: Multi-Tab & Sidebar Grid */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 mt-10">
        
        {/* Navigation Tabs Header */}
        <div className="border-b border-white/10 flex items-center gap-2 sm:gap-6 text-sm font-semibold text-zinc-400 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('about')}
            className={`py-3 px-3 sm:px-4 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'about' 
                ? 'text-amber-300 bg-amber-500/15 border border-amber-500/30' 
                : 'hover:text-white hover:bg-white/[0.06] border border-transparent'
            }`}
          >
            <Film className="w-4 h-4 text-amber-400" />
            <span>Story & Details</span>
          </button>

          <button
            onClick={() => setActiveTab('cast')}
            className={`py-3 px-3 sm:px-4 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'cast' 
                ? 'text-amber-300 bg-amber-500/15 border border-amber-500/30' 
                : 'hover:text-white hover:bg-white/[0.06] border border-transparent'
            }`}
          >
            <User className="w-4 h-4 text-amber-400" />
            <span>Cast & Crew ({activeMovie.cast?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-3 sm:px-4 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'reviews' 
                ? 'text-amber-300 bg-amber-500/15 border border-amber-500/30' 
                : 'hover:text-white hover:bg-white/[0.06] border border-transparent'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span>Audience Reviews ({reviews.length})</span>
          </button>

          {similarMovies.length > 0 && (
            <button
              onClick={() => setActiveTab('similar')}
              className={`py-3 px-3 sm:px-4 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'similar' 
                  ? 'text-amber-300 bg-amber-500/15 border border-amber-500/30' 
                  : 'hover:text-white hover:bg-white/[0.06] border border-transparent'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Recommended Titles ({similarMovies.length})</span>
            </button>
          )}
        </div>

        {/* Tab Body & Sidebar Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
          
          {/* Main Left Content Area */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* TAB 1: STORY & DETAILS */}
            {activeTab === 'about' && (
              <div className="space-y-8">
                
                {/* Synopsis Card */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-2">
                    <Film className="w-4 h-4" />
                    <span>Storyline & Narrative Synopsis</span>
                  </h3>
                  <p className="text-zinc-200 text-base sm:text-lg leading-relaxed font-sans">
                    {activeMovie.overview || 'No synopsis is currently provided for this title.'}
                  </p>
                </div>

                {/* Key Technical & Production Facts Grid */}
                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold">
                    Motion Picture Specifications
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/5 space-y-1">
                      <div className="text-zinc-400">Director</div>
                      <div className="font-bold text-white text-sm truncate">{activeMovie.director || 'Studio Production'}</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/5 space-y-1">
                      <div className="text-zinc-400">Theatrical Premiere</div>
                      <div className="font-bold text-white text-sm">{activeMovie.releaseDate || activeMovie.releaseYear}</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/5 space-y-1">
                      <div className="text-zinc-400">Runtime</div>
                      <div className="font-bold text-white text-sm">{formattedRuntime}</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/5 space-y-1">
                      <div className="text-zinc-400">Age Rating</div>
                      <div className="font-bold text-amber-300 text-sm">{activeMovie.certification || 'Unrated'}</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/5 space-y-1">
                      <div className="text-zinc-400">Production Budget</div>
                      <div className="font-bold text-white text-sm">{formatCurrency(activeMovie.budget)}</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/5 space-y-1">
                      <div className="text-zinc-400">Worldwide Gross</div>
                      <div className="font-bold text-emerald-400 text-sm">{formatCurrency(activeMovie.revenue)}</div>
                    </div>
                  </div>
                </div>

                {/* Public Domain Provenance Card if applicable */}
                {activeMovie.publicDomain && (
                  <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-xl flex items-start gap-4 text-xs">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-black text-emerald-300 text-sm">Verified Legal Public Domain Title</div>
                      <p className="text-zinc-300 mt-1 leading-relaxed">
                        {activeMovie.streamLicense || 'This work is verified in the public domain and legally available for worldwide full-length broadcast and streaming under open cinema provenance.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Cast Highlight Preview */}
                {activeMovie.cast && activeMovie.cast.length > 0 && (
                  <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold">
                        Top Cast & Performers
                      </h3>
                      <button 
                        onClick={() => setActiveTab('cast')}
                        className="text-xs text-amber-400 hover:underline font-bold cursor-pointer"
                      >
                        View all ({activeMovie.cast.length}) →
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {activeMovie.cast.slice(0, 8).map(c => (
                        <div key={c.id} className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex items-center gap-3">
                          <img
                            src={c.profilePath || `https://api.dicebear.com/7.x/bottts/svg?seed=${c.name}`}
                            alt={c.name}
                            className="w-12 h-12 rounded-2xl object-cover bg-zinc-800 ring-1 ring-white/15 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="overflow-hidden">
                            <div className="text-xs font-bold text-white truncate">{c.name}</div>
                            <div className="text-[11px] text-amber-400 truncate">{c.character}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Google Search FAQ & Knowledge Card */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    <span>Frequently Asked Questions & Cinema Knowledge</span>
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/5 space-y-1.5">
                      <div className="font-bold text-white text-sm">When is {activeMovie.title} released?</div>
                      <div className="text-zinc-300 leading-relaxed">
                        {activeMovie.releaseDate ? `${activeMovie.title} officially premiered on ${activeMovie.releaseDate}.` : `Released worldwide in ${activeMovie.releaseYear}.`}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/5 space-y-1.5">
                      <div className="font-bold text-white text-sm">Who directed and stars in {activeMovie.title}?</div>
                      <div className="text-zinc-300 leading-relaxed">
                        Directed by {activeMovie.director || 'esteemed creators'}{activeMovie.cast?.length ? ` with leading performances by ${activeMovie.cast.slice(0, 4).map(c => c.name).join(', ')}` : ''}.
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/5 space-y-1.5">
                      <div className="font-bold text-white text-sm">Where can I watch {activeMovie.title}?</div>
                      <div className="text-zinc-300 leading-relaxed">
                        {activeMovie.publicDomain
                          ? `${activeMovie.title} is available to stream in full-length high quality, 100% legally and for free directly on Jamal Movies.`
                          : `You can stream official 4K trailers, previews, and track release dates directly on Jamal Movies.`}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: CAST & CREW */}
            {activeTab === 'cast' && (
              <div className="space-y-8">
                
                {/* Full Cast List */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold">
                    Full Cast Ensemble ({activeMovie.cast?.length || 0})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                    {activeMovie.cast?.map(c => (
                      <div key={c.id} className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex items-center gap-3">
                        <img
                          src={c.profilePath || `https://api.dicebear.com/7.x/bottts/svg?seed=${c.name}`}
                          alt={c.name}
                          className="w-14 h-14 rounded-2xl object-cover bg-zinc-800 ring-1 ring-white/15 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="overflow-hidden">
                          <div className="text-xs font-bold text-white truncate">{c.name}</div>
                          <div className="text-[11px] text-amber-400 truncate">{c.character}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Production Crew */}
                {activeMovie.crew && activeMovie.crew.length > 0 && (
                  <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold">
                      Key Production & Creative Crew
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      {activeMovie.crew.map(cr => (
                        <div key={cr.id} className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                          <div className="font-bold text-white">{cr.name}</div>
                          <div className="text-zinc-400 text-[11px]">{cr.job} • {cr.department}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB 3: AUDIENCE REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="space-y-8">
                
                {/* Submit New Review Card */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>Write an Audience Review & Rating</span>
                  </h3>

                  <form onSubmit={handleReviewSubmit} className="space-y-3.5">
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="Your Name / Handle (e.g. Cinephile99)"
                      className="w-full bg-white/[0.06] border border-white/15 rounded-2xl px-4 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-amber-400 backdrop-blur-md"
                    />

                    {/* Rating Selector */}
                    <div className="flex items-center gap-3 bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-2">
                      <span className="text-xs text-zinc-300 font-medium">Your Score:</span>
                      <div className="flex items-center gap-1.5 overflow-x-auto">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setUserRating(num)}
                            className={`w-7 h-7 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              userRating >= num 
                                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-black' 
                                : 'bg-white/[0.06] text-zinc-400 hover:bg-white/[0.14]'
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                      <span className="text-xs font-black text-amber-400 ml-auto">{userRating} / 10</span>
                    </div>

                    <input
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="Review Headline (e.g. Visual Masterpiece with great acting)"
                      className="w-full bg-white/[0.06] border border-white/15 rounded-2xl px-4 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-amber-400 backdrop-blur-md"
                    />

                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={4}
                      placeholder="Share your detailed impressions regarding direction, acting, music, cinematography..."
                      className="w-full bg-white/[0.06] border border-white/15 rounded-2xl p-4 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-amber-400 backdrop-blur-md"
                    />

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmittingReview}
                        className="px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-zinc-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        {isSubmittingReview ? 'Posting Review...' : 'Post Public Review'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  <div className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold">
                    Community Reviews ({reviews.length})
                  </div>

                  {reviews.length > 0 ? (
                    reviews.map(r => (
                      <div key={r.id} className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={r.userAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${r.userName}`}
                              alt={r.userName}
                              className="w-10 h-10 rounded-full bg-zinc-800 object-cover border border-white/15"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="text-xs font-bold text-white">{r.userName}</div>
                              <div className="text-[10px] text-zinc-400">
                                {new Date(r.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold backdrop-blur-md">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{r.rating} / 10</span>
                          </div>
                        </div>

                        {r.title && (
                          <div className="text-sm font-bold text-zinc-100">
                            {r.title}
                          </div>
                        )}

                        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                          {r.comment}
                        </p>

                        <div className="flex items-center justify-between pt-2 text-xs text-zinc-400 border-t border-white/10">
                          <button
                            onClick={() => handleLikeReview(r.id)}
                            className="flex items-center gap-1.5 text-xs hover:text-amber-400 transition-colors cursor-pointer"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            <span>Helpful Review ({r.likes || 0})</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center text-xs text-zinc-400 bg-white/[0.03] rounded-3xl border border-white/10 backdrop-blur-xl">
                      No reviews submitted yet. Be the first to share your thoughts on this title!
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 4: SIMILAR MOVIES */}
            {activeTab === 'similar' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {similarMovies.map((m, idx) => (
                  <div
                    key={`detail-sim-${m.id || idx}-${idx}`}
                    onClick={() => openMovieDetails(m)}
                    className="p-3 rounded-3xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-amber-400/40 transition-all cursor-pointer group backdrop-blur-xl shadow-lg hover:scale-102"
                  >
                    <img
                      src={m.poster}
                      alt={m.title}
                      className="w-full aspect-[2/3] object-cover rounded-2xl shadow mb-2.5 group-hover:scale-102 transition-transform border border-white/10"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-xs font-bold text-white truncate group-hover:text-amber-400">
                      {m.title}
                    </div>
                    <div className="text-[11px] text-zinc-400 flex items-center justify-between mt-1">
                      <span>{m.releaseYear}</span>
                      <span className="text-amber-400 font-bold">★ {m.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* In-feed Adsterra Leaderboard Banner */}
            <AdSlotBanner placement="leaderboard" className="mt-8" />

          </div>

          {/* Right Sidebar Area */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Where to Watch & Streaming Hub */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0e122b] to-[#0a0d1f] border border-white/15 backdrop-blur-2xl shadow-2xl space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-2">
                <Zap className="w-4 h-4 fill-amber-400" />
                <span>Streaming & Download Hub</span>
              </h3>

              <div className="space-y-2.5">
                {activeMovie.publicDomain ? (
                  <button
                    onClick={() => setStreamingMovie(activeMovie)}
                    className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black text-xs sm:text-sm flex items-center justify-between shadow-lg transition-all hover:scale-102 active:scale-98 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Tv className="w-4 h-4" />
                      <span>Legal Free Stream</span>
                    </div>
                    <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded-lg font-mono">SERVER 1</span>
                  </button>
                ) : null}

                {/* Sponsored Server 2 4K Stream Link */}
                <a
                  href={ADSTERRA_TARGETED_CHANNELS.NAVBAR_VIP_STREAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => openAdsterraLink(ADSTERRA_TARGETED_CHANNELS.NAVBAR_VIP_STREAM)}
                  className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center justify-between shadow-lg transition-all hover:scale-102 active:scale-98 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                    <span>4K Ultra HD Stream (Server 2)</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-purple-200" />
                </a>

                {/* Fast Download Mirror */}
                <a
                  href={ADSTERRA_TARGETED_CHANNELS.FAST_DOWNLOAD_SERVER}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => openAdsterraLink(ADSTERRA_TARGETED_CHANNELS.FAST_DOWNLOAD_SERVER)}
                  className="w-full p-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-zinc-200 font-bold text-xs sm:text-sm flex items-center justify-between transition-all hover:scale-102 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Download Movie (1080p / 4K)</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                </a>
              </div>
            </div>

            {/* Target Search Keywords & SEO Topic Tags */}
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-xl space-y-3.5">
              <div className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-amber-400" />
                <span>Search Keywords & Discover Tags</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {generateKeywordsForMovie(activeMovie).slice(0, 16).map(k => (
                  <button
                    key={k}
                    onClick={() => {
                      setSearchQuery(k);
                      setNavTab('home');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs bg-white/[0.06] hover:bg-amber-400/20 border border-white/10 hover:border-amber-400/50 text-zinc-300 hover:text-amber-300 backdrop-blur-md transition-all cursor-pointer hover:scale-105 active:scale-95"
                  >
                    #{k}
                  </button>
                ))}
              </div>
            </div>

            {/* Sidebar Ad Placement */}
            <AdSlotBanner placement="sidebar" />

          </div>

        </div>

      </section>

    </div>
  );
};
