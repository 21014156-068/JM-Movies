import { Movie, Review, User, AdminStats, FilterOptions, PaginatedResponse } from '../src/types';
import { INITIAL_MOVIES, GENRE_LIST } from './data/movies';
import { CURATED_UPCOMING_RELEASES } from './tmdb';
import crypto from 'crypto';

// In-Memory Database Store with initial seed data
class DatabaseStore {
  private movies: Movie[] = this.initMovies();

  private initMovies(): Movie[] {
    const combined = [...INITIAL_MOVIES, ...CURATED_UPCOMING_RELEASES];
    const seen = new Set<string>();
    const uniqueList: Movie[] = [];
    for (const m of combined) {
      const key = m.id || (m.tmdbId ? `tmdb-${m.tmdbId}` : m.title.toLowerCase());
      if (!seen.has(key)) {
        seen.add(key);
        uniqueList.push(m);
      }
    }
    return uniqueList;
  }
  private users: User[] = [
    {
      id: 'usr-admin',
      name: 'Jamal Studio Admin',
      email: 'admin@jamalmovies.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'admin',
      watchlist: ['mov-1', 'mov-4', 'mov-pd-1'],
      favorites: ['mov-1', 'mov-2', 'mov-pd-2'],
      preferences: {
        favoriteGenres: ['Science Fiction', 'Action', 'Drama'],
        autoplayTrailers: true,
        streamQuality: '1080p'
      },
      history: [
        { movieId: 'mov-1', watchedAt: new Date(Date.now() - 86400000 * 2).toISOString(), progressPercent: 100 },
        { movieId: 'mov-pd-1', watchedAt: new Date(Date.now() - 86400000 * 1).toISOString(), progressPercent: 85 }
      ],
      createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'usr-demo',
      name: 'Sarah Cinephile',
      email: 'demo@jamalmovies.com',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      role: 'user',
      watchlist: ['mov-2', 'mov-5', 'mov-pd-3'],
      favorites: ['mov-2', 'mov-11'],
      preferences: {
        favoriteGenres: ['Drama', 'Thriller', 'Horror'],
        autoplayTrailers: false,
        streamQuality: 'auto'
      },
      history: [
        { movieId: 'mov-2', watchedAt: new Date(Date.now() - 86400000 * 3).toISOString(), progressPercent: 100 }
      ],
      createdAt: '2024-02-15T12:00:00.000Z'
    }
  ];

  // Store password hashes separately
  private passwords: Map<string, string> = new Map([
    ['admin@jamalmovies.com', this.hashPassword('admin123')],
    ['demo@jamalmovies.com', this.hashPassword('demo123')]
  ]);

  private reviews: Review[] = [
    {
      id: 'rev-1',
      movieId: 'mov-1',
      movieTitle: 'Inception',
      userId: 'usr-admin',
      userName: 'Jamal Studio Admin',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      rating: 10,
      title: 'A cinematic tour-de-force of original storytelling',
      comment: 'Inception remains the benchmark for modern cerebral blockbusters. Hans Zimmer’s score paired with Wally Pfister’s cinematography produces an unmatched sensory thrill.',
      likes: 42,
      likedBy: ['usr-demo'],
      createdAt: '2024-03-01T14:22:00.000Z',
      status: 'approved'
    },
    {
      id: 'rev-2',
      movieId: 'mov-1',
      movieTitle: 'Inception',
      userId: 'usr-demo',
      userName: 'Sarah Cinephile',
      userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      rating: 9,
      title: 'Still mindblowing on repeat viewings',
      comment: 'The rotating hallway fight sequence and the layered timeline climax in the snow fortress are pure filmmaking gold.',
      likes: 19,
      likedBy: [],
      createdAt: '2024-03-10T18:45:00.000Z',
      status: 'approved'
    },
    {
      id: 'rev-3',
      movieId: 'mov-2',
      movieTitle: 'Interstellar',
      userId: 'usr-demo',
      userName: 'Sarah Cinephile',
      userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      rating: 10,
      title: 'Emotional grandeur at the edge of human knowledge',
      comment: 'The docking scene alone is one of the most intense moments in cinema history. A true modern masterpiece.',
      likes: 35,
      likedBy: ['usr-admin'],
      createdAt: '2024-03-12T09:15:00.000Z',
      status: 'approved'
    },
    {
      id: 'rev-4',
      movieId: 'mov-pd-1',
      movieTitle: 'Night of the Living Dead',
      userId: 'usr-admin',
      userName: 'Jamal Studio Admin',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      rating: 9,
      title: 'Subversive, raw and revolutionary',
      comment: 'Romero transformed horror forever on a shoestring budget. Having this legally available in HD in the public domain cinema collection is fantastic.',
      likes: 28,
      likedBy: ['usr-demo'],
      createdAt: '2024-04-01T20:10:00.000Z',
      status: 'approved'
    }
  ];

  private activityLogs: AdminStats['recentActivity'] = [
    {
      id: 'act-1',
      type: 'user_register',
      description: 'Sarah Cinephile registered as new member',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
      id: 'act-2',
      type: 'review',
      description: 'New 10/10 review posted for Interstellar',
      timestamp: new Date(Date.now() - 3600000 * 8).toISOString()
    },
    {
      id: 'act-3',
      type: 'watchlist_add',
      description: 'User added Dune: Part Two to watchlist',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'act-4',
      type: 'tmdb_sync',
      description: 'Automated TMDB catalog metadata cache synced',
      timestamp: new Date(Date.now() - 3600000 * 1).toISOString()
    }
  ];

  // Helper for password hashing
  public hashPassword(pwd: string): string {
    return crypto.createHash('sha256').update(pwd + '_jamal_salt').digest('hex');
  }

  // --- Auth & Users ---
  public getUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  public verifyPassword(email: string, plainText: string): boolean {
    const hash = this.passwords.get(email.toLowerCase());
    return hash === this.hashPassword(plainText);
  }

  public registerUser(name: string, email: string, plainText: string): User {
    const existing = this.getUserByEmail(email);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser: User = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name,
      email: email.toLowerCase(),
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      role: 'user',
      watchlist: [],
      favorites: [],
      history: [],
      preferences: {
        favoriteGenres: [],
        autoplayTrailers: true,
        streamQuality: 'auto'
      },
      createdAt: new Date().toISOString()
    };

    this.users.push(newUser);
    this.passwords.set(email.toLowerCase(), this.hashPassword(plainText));

    this.logActivity('user_register', `New user registered: ${name} (${email})`);
    return newUser;
  }

  public updateUserRole(userId: string, role: 'admin' | 'user'): User {
    const user = this.getUserById(userId);
    if (!user) throw new Error('User not found');
    user.role = role;
    return user;
  }

  public changePassword(userId: string, currentPass: string, newPass: string): boolean {
    const user = this.getUserById(userId);
    if (!user) throw new Error('User account not found');

    const email = user.email.toLowerCase();
    const storedHash = this.passwords.get(email);
    if (!storedHash || storedHash !== this.hashPassword(currentPass)) {
      throw new Error('Current password is incorrect');
    }

    if (!newPass || newPass.length < 6) {
      throw new Error('New password must be at least 6 characters');
    }

    this.passwords.set(email, this.hashPassword(newPass));
    return true;
  }

  public updateUserProfile(userId: string, updates: Partial<User>): User {
    const user = this.getUserById(userId);
    if (!user) throw new Error('User not found');
    if (updates.name && updates.name.trim()) user.name = updates.name.trim();
    if (updates.avatar) user.avatar = updates.avatar;
    if (updates.bio !== undefined) user.bio = updates.bio;
    if (updates.preferences) {
      user.preferences = {
        favoriteGenres: updates.preferences.favoriteGenres || user.preferences?.favoriteGenres || ['Action', 'Science Fiction'],
        autoplayTrailers: updates.preferences.autoplayTrailers !== undefined ? updates.preferences.autoplayTrailers : (user.preferences?.autoplayTrailers ?? true),
        streamQuality: updates.preferences.streamQuality || user.preferences?.streamQuality || '1080p',
        theme: updates.preferences.theme || user.preferences?.theme || 'midnight'
      };
    }
    return user;
  }

  public getAllUsers(): User[] {
    return [...this.users];
  }

  // --- Movies ---
  public getMovies(filters: FilterOptions = {}): PaginatedResponse<Movie> {
    let result = [...this.movies];

    if (filters.category) {
      if (filters.category === 'trending') {
        result = result.filter(m => m.trending || m.popularity > 85);
      } else if (filters.category === 'top-rated') {
        result = result.filter(m => m.topRated || m.rating >= 8.3);
      } else if (filters.category === 'upcoming') {
        const todayStr = new Date().toISOString().split('T')[0];
        result = result.filter(m => (m.upcoming || (m.releaseDate && m.releaseDate >= todayStr)) && (!m.releaseDate || m.releaseDate >= todayStr));
      } else if (filters.category === 'now-playing') {
        result = result.filter(m => m.nowPlaying || (m.releaseYear >= 2024 && !m.upcoming));
      } else if (filters.category === 'popular') {
        result = result.filter(m => m.popular || m.popularity >= 75);
      } else if (filters.category === 'public-domain') {
        result = result.filter(m => m.publicDomain);
      } else if (filters.category === 'movies') {
        result = result.filter(m => !m.publicDomain);
      }
    }

    if (filters.certification && filters.certification !== 'All' && filters.certification !== '') {
      result = result.filter(m => m.certification === filters.certification);
    }

    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(m => 
        m.title.toLowerCase().includes(q) ||
        m.overview.toLowerCase().includes(q) ||
        (m.director && m.director.toLowerCase().includes(q)) ||
        m.cast.some(c => c.name.toLowerCase().includes(q)) ||
        (m.keywords && m.keywords.some(k => k.toLowerCase().includes(q)))
      );
    }

    if (filters.genre && filters.genre !== 'All' && filters.genre !== '') {
      result = result.filter(m => m.genres.includes(filters.genre!));
    }

    if (filters.year) {
      const yr = Number(filters.year);
      if (!isNaN(yr)) {
        result = result.filter(m => m.releaseYear === yr);
      }
    }

    if (filters.minRating && filters.minRating > 0) {
      result = result.filter(m => m.rating >= filters.minRating!);
    }

    // Sort
    const sortBy = filters.sortBy || 'popularity';
    const sortOrder = filters.sortOrder || 'desc';
    const multiplier = sortOrder === 'asc' ? 1 : -1;

    result.sort((a, b) => {
      if (sortBy === 'rating') {
        return (a.rating - b.rating) * multiplier;
      }
      if (sortBy === 'releaseDate') {
        return (new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()) * multiplier;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title) * multiplier;
      }
      // default popularity
      return (a.popularity - b.popularity) * multiplier;
    });

    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Number(filters.limit) || 20);
    const total = result.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginatedData = result.slice((page - 1) * limit, page * limit);

    return {
      data: paginatedData,
      total,
      page,
      limit,
      totalPages
    };
  }

  public getAllMovies(): Movie[] {
    return [...this.movies];
  }

  public getMovieById(id: string): Movie | undefined {
    if (!id) return undefined;
    const cleanId = String(id).replace(/^tmdb-/, '');
    return this.movies.find(m => 
      m.id === id || 
      m.id === cleanId || 
      m.id === `tmdb-${cleanId}` || 
      String(m.tmdbId) === id || 
      String(m.tmdbId) === cleanId
    );
  }

  public getFeaturedMovies(): Movie[] {
    return this.movies.filter(m => m.featured);
  }

  public getTrendingMovies(): Movie[] {
    return this.movies.filter(m => m.trending || m.popularity > 88);
  }

  public getTopRatedMovies(): Movie[] {
    return [...this.movies].sort((a, b) => b.rating - a.rating).slice(0, 10);
  }

  public getPublicDomainMovies(): Movie[] {
    return this.movies.filter(m => m.publicDomain);
  }

  public getUpcomingMovies(): Movie[] {
    const todayStr = new Date().toISOString().split('T')[0];
    return this.movies
      .filter(m => (m.upcoming || (m.releaseDate && m.releaseDate >= todayStr)) && (!m.releaseDate || m.releaseDate >= todayStr))
      .sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
  }

  public upsertMovies(newMovies: Movie[]): void {
    newMovies.forEach(nm => {
      const idx = this.movies.findIndex(m => 
        (nm.id && m.id === nm.id) || 
        (nm.tmdbId && m.tmdbId && m.tmdbId === nm.tmdbId) ||
        (m.title.toLowerCase() === nm.title.toLowerCase())
      );
      if (idx > -1) {
        this.movies[idx] = { ...this.movies[idx], ...nm, id: this.movies[idx].id };
      } else {
        this.movies.push(nm);
      }
    });
  }

  public getSimilarMovies(movieId: string): Movie[] {
    const current = this.getMovieById(movieId);
    if (!current) return this.movies.slice(0, 6);

    return this.movies
      .filter(m => m.id !== current.id)
      .map(m => {
        // compute genre overlap score
        const genreOverlap = m.genres.filter(g => current.genres.includes(g)).length;
        const sameDirector = m.director && current.director && m.director === current.director ? 2 : 0;
        return { movie: m, score: genreOverlap + sameDirector };
      })
      .sort((a, b) => b.score - a.score)
      .map(item => item.movie)
      .slice(0, 6);
  }

  public addMovie(movieData: Omit<Movie, 'id'>): Movie {
    const newMovie: Movie = {
      ...movieData,
      id: `mov-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.movies.unshift(newMovie);
    this.logActivity('movie_added', `Admin added new movie title: "${newMovie.title}"`);
    return newMovie;
  }

  public updateMovie(id: string, updates: Partial<Movie>): Movie {
    const index = this.movies.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Movie not found');

    const updated = {
      ...this.movies[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.movies[index] = updated;
    return updated;
  }

  public deleteMovie(id: string): boolean {
    const initialLen = this.movies.length;
    this.movies = this.movies.filter(m => m.id !== id);
    return this.movies.length < initialLen;
  }

  public getGenres(): string[] {
    return GENRE_LIST;
  }

  // --- Watchlist & Favorites ---
  public toggleWatchlist(userId: string, movieId: string): { inWatchlist: boolean; watchlist: string[] } {
    const user = this.getUserById(userId);
    if (!user) throw new Error('User not found');

    const index = user.watchlist.indexOf(movieId);
    let inWatchlist = false;

    if (index > -1) {
      user.watchlist.splice(index, 1);
      inWatchlist = false;
    } else {
      user.watchlist.push(movieId);
      inWatchlist = true;
      const movie = this.getMovieById(movieId);
      this.logActivity('watchlist_add', `${user.name} added "${movie?.title || movieId}" to watchlist`);
    }

    return { inWatchlist, watchlist: user.watchlist };
  }

  public toggleFavorite(userId: string, movieId: string): { isFavorite: boolean; favorites: string[] } {
    const user = this.getUserById(userId);
    if (!user) throw new Error('User not found');

    const index = user.favorites.indexOf(movieId);
    let isFavorite = false;

    if (index > -1) {
      user.favorites.splice(index, 1);
      isFavorite = false;
    } else {
      user.favorites.push(movieId);
      isFavorite = true;
    }

    return { isFavorite, favorites: user.favorites };
  }

  public getUserWatchlistMovies(userId: string): Movie[] {
    const user = this.getUserById(userId);
    if (!user) return [];
    return user.watchlist.map(id => this.getMovieById(id)).filter(Boolean) as Movie[];
  }

  public getUserFavoritesMovies(userId: string): Movie[] {
    const user = this.getUserById(userId);
    if (!user) return [];
    return user.favorites.map(id => this.getMovieById(id)).filter(Boolean) as Movie[];
  }

  public logWatchHistory(userId: string, movieId: string, progressPercent = 100): void {
    const user = this.getUserById(userId);
    if (!user) return;

    user.history = user.history.filter(h => h.movieId !== movieId);
    user.history.unshift({
      movieId,
      watchedAt: new Date().toISOString(),
      progressPercent
    });
  }

  // --- Reviews & Ratings ---
  public getReviewsByMovieId(movieId: string): Review[] {
    return this.reviews.filter(r => r.movieId === movieId);
  }

  public getAllReviews(): Review[] {
    return [...this.reviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public addReview(reviewData: Omit<Review, 'id' | 'likes' | 'createdAt'>): Review {
    const movie = this.getMovieById(reviewData.movieId);
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      movieTitle: movie?.title || reviewData.movieTitle,
      moviePoster: movie?.poster,
      likes: 0,
      likedBy: [],
      createdAt: new Date().toISOString(),
      status: 'approved'
    };

    this.reviews.unshift(newReview);
    this.logActivity('review', `${newReview.userName} reviewed "${newReview.movieTitle}" (${newReview.rating}/10)`);

    // Recalculate movie average rating dynamically
    if (movie) {
      const movieRevs = this.getReviewsByMovieId(movie.id);
      const totalScore = movieRevs.reduce((acc, curr) => acc + curr.rating, 0);
      const avg = Number((totalScore / movieRevs.length).toFixed(1));
      // Blend TMDB initial rating with user community reviews
      movie.rating = Number(((movie.rating * 0.7) + (avg * 0.3)).toFixed(1));
    }

    return newReview;
  }

  public likeReview(reviewId: string, userId: string): Review {
    const review = this.reviews.find(r => r.id === reviewId);
    if (!review) throw new Error('Review not found');

    review.likedBy = review.likedBy || [];
    const idx = review.likedBy.indexOf(userId);

    if (idx > -1) {
      review.likedBy.splice(idx, 1);
      review.likes = Math.max(0, review.likes - 1);
    } else {
      review.likedBy.push(userId);
      review.likes += 1;
    }

    return review;
  }

  public deleteReview(reviewId: string): boolean {
    const len = this.reviews.length;
    this.reviews = this.reviews.filter(r => r.id !== reviewId);
    return this.reviews.length < len;
  }

  // --- Admin Stats ---
  public getAdminStats(): AdminStats {
    const totalUsers = this.users.length;
    const totalMovies = this.movies.length;
    const totalReviews = this.reviews.length;
    const totalWatchlistEntries = this.users.reduce((acc, u) => acc + u.watchlist.length, 0);
    const totalPublicDomainStreams = this.movies.filter(m => m.publicDomain).length;

    // Genre distribution
    const genreMap = new Map<string, number>();
    this.movies.forEach(m => {
      m.genres.forEach(g => {
        genreMap.set(g, (genreMap.get(g) || 0) + 1);
      });
    });

    const genreDistribution = Array.from(genreMap.entries()).map(([genre, count]) => ({
      genre,
      count
    })).sort((a, b) => b.count - a.count);

    // Rating distribution
    const ratingBins = [
      { rating: 10, count: 0 },
      { rating: 9, count: 0 },
      { rating: 8, count: 0 },
      { rating: 7, count: 0 },
      { rating: 6, count: 0 },
      { rating: 5, count: 0 }
    ];
    this.reviews.forEach(r => {
      const rounded = Math.min(10, Math.max(5, Math.round(r.rating)));
      const bin = ratingBins.find(b => b.rating === rounded);
      if (bin) bin.count += 1;
    });

    const mostPopularMovies = [...this.movies]
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 5)
      .map(m => ({
        id: m.id,
        title: m.title,
        rating: m.rating,
        views: Math.round(m.popularity * 1420),
        poster: m.poster
      }));

    return {
      totalUsers,
      totalMovies,
      totalReviews,
      totalWatchlistEntries,
      totalPublicDomainStreams,
      genreDistribution,
      mostPopularMovies,
      recentActivity: this.activityLogs.slice(0, 10),
      ratingDistribution: ratingBins
    };
  }

  public logActivity(type: AdminStats['recentActivity'][0]['type'], description: string): void {
    this.activityLogs.unshift({
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      description,
      timestamp: new Date().toISOString()
    });
    if (this.activityLogs.length > 50) {
      this.activityLogs = this.activityLogs.slice(0, 50);
    }
  }

  // Simulate TMDB Catalog Synchronizer Job
  public simulateTmdbSync(): { syncedCount: number; timestamp: string; message: string } {
    const timestamp = new Date().toISOString();
    // Simulate updating popularity metrics & rating adjustments
    this.movies.forEach(m => {
      // slight realistic drift
      const delta = (Math.random() - 0.5) * 0.4;
      m.popularity = Number(Math.max(40, m.popularity + delta).toFixed(1));
    });

    this.logActivity('tmdb_sync', `TMDB Catalog Cron Job successfully synchronized ${this.movies.length} movie records.`);
    return {
      syncedCount: this.movies.length,
      timestamp,
      message: `Successfully synchronized ${this.movies.length} movie metadata records with TMDB API cache.`
    };
  }
}

export const db = new DatabaseStore();
