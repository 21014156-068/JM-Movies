export interface Movie {
  id: string;
  tmdbId: number;
  title: string;
  originalTitle?: string;
  tagline?: string;
  overview: string;
  poster: string;
  backdrop: string;
  releaseDate: string;
  releaseYear: number;
  runtime: number; // in minutes
  genres: string[];
  rating: number; // 0 - 10
  voteCount: number;
  popularity: number;
  certification?: string; // PG-13, R, PG, G, NC-17
  trailerKey?: string; // YouTube video ID
  trailerUrl?: string;
  cast: CastMember[];
  crew: CrewMember[];
  featured?: boolean;
  trending?: boolean;
  topRated?: boolean;
  upcoming?: boolean;
  nowPlaying?: boolean;
  popular?: boolean;
  publicDomain?: boolean;
  streamUrl?: string; // Legal streaming URL for public domain films
  streamLicense?: string;
  keywords?: string[];
  director?: string;
  budget?: number;
  revenue?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CastMember {
  id: string | number;
  name: string;
  character: string;
  profilePath?: string;
}

export interface CrewMember {
  id: string | number;
  name: string;
  job: string;
  department: string;
}

export interface Review {
  id: string;
  movieId: string;
  movieTitle?: string;
  moviePoster?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1 to 10
  title: string;
  comment: string;
  likes: number;
  likedBy?: string[];
  createdAt: string;
  updatedAt?: string;
  status?: 'approved' | 'pending' | 'flagged';
}

export interface UserPreferences {
  favoriteGenres: string[];
  autoplayTrailers: boolean;
  streamQuality: 'auto' | '4K' | '1080p' | '720p';
  theme?: 'midnight' | 'oled' | 'amber';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  bio?: string;
  preferences?: UserPreferences;
  watchlist: string[]; // movie IDs
  favorites: string[]; // movie IDs
  history: {
    movieId: string;
    watchedAt: string;
    progressPercent: number;
  }[];
  createdAt: string;
}

export interface UserAuthResponse {
  user: User;
  token: string;
}

export interface FilterOptions {
  search?: string;
  genre?: string;
  year?: number | string;
  minRating?: number;
  sortBy?: 'popularity' | 'rating' | 'releaseDate' | 'title' | 'revenue';
  sortOrder?: 'asc' | 'desc';
  certification?: string;
  page?: number;
  limit?: number;
  category?: 'all' | 'movies' | 'now-playing' | 'trending' | 'top-rated' | 'upcoming' | 'popular' | 'public-domain';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminStats {
  totalUsers: number;
  totalMovies: number;
  totalReviews: number;
  totalWatchlistEntries: number;
  totalPublicDomainStreams: number;
  genreDistribution: { genre: string; count: number }[];
  mostPopularMovies: { id: string; title: string; rating: number; views: number; poster: string }[];
  recentActivity: {
    id: string;
    type: 'review' | 'user_register' | 'watchlist_add' | 'movie_added' | 'tmdb_sync';
    description: string;
    timestamp: string;
  }[];
  ratingDistribution: { rating: number; count: number }[];
}

export interface AiRecommendationRequest {
  prompt?: string;
  mood?: string;
  preferredGenres?: string[];
  favoriteMovieTitles?: string[];
  targetYearRange?: string;
  userHistoryIds?: string[];
}

export interface AiRecommendationResult {
  rationale: string;
  recommendedMovies: Movie[];
  suggestedTags: string[];
  curatedTheme: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error' | 'warning';
  message: string;
}
