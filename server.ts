import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { db } from './server/db';
import { generateMovieRecommendations, askCineBotAssistant } from './server/gemini';
import { generateMovieKeywords, generateMovieFAQs } from './server/seoKeywords';
import { 
  getRouletteMovie, 
  getBattleMatchups, 
  voteInBattle, 
  getTriviaQuestions, 
  getDoubleFeaturePairing 
} from './server/engagement';
import { 
  fetchTmdbUpcomingReleases,
  fetchTmdbTrending,
  fetchTmdbNowPlaying,
  fetchTmdbTopRated,
  fetchTmdbPopular,
  fetchTmdbDiscover,
  fetchTmdbSearch,
  fetchTmdbMovieDetails,
  fetchTmdbPerson
} from './server/tmdb';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Token parser middleware
  app.use((req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      if (token.startsWith('token_')) {
        const parts = token.split('_');
        const userId = parts[1];
        if (userId) {
          const user = db.getUserById(userId);
          if (user) {
            (req as any).user = user;
          }
        }
      }
    }
    next();
  });

  // ==========================================
  // AUTHENTICATION ROUTES
  // ==========================================
  app.post('/api/auth/register', (req, res) => {
    try {
      const { name, email, password, avatar, preferences } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email and password are required.' });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters.' });
      }

      const user = db.registerUser(name, email, password);
      if (avatar || preferences) {
        db.updateUserProfile(user.id, { avatar, preferences });
      }

      const token = `token_${user.id}_${Date.now()}`;
      res.status(201).json({ user, token });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Registration failed' });
    }
  });

  app.post('/api/auth/login', (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const user = db.getUserByEmail(email);
      if (!user || !db.verifyPassword(email, password)) {
        return res.status(401).json({ error: 'Invalid email address or password.' });
      }

      const token = `token_${user.id}_${Date.now()}`;
      res.json({ user, token });
    } catch (err: any) {
      res.status(500).json({ error: 'Login server error' });
    }
  });

  app.get('/api/auth/me', (req, res) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.json({ user });
  });

  app.post('/api/auth/logout', (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
  });

  app.put('/api/auth/profile', (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    try {
      const updated = db.updateUserProfile(user.id, req.body);
      res.json({ user: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/auth/change-password', (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current and new password are required' });
      }
      db.changePassword(user.id, currentPassword, newPassword);
      res.json({ success: true, message: 'Password updated successfully' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // ==========================================
  // MULTI-ANGLE TMDB & MOVIE CATALOG ROUTES
  // ==========================================
  
  // 1. Trending Movies Worldwide (Live TMDB with DB Fallback)
  app.get('/api/movies/trending', async (req, res) => {
    const timeWindow = (req.query.timeWindow as 'day' | 'week') || 'day';
    try {
      const liveTrending = await fetchTmdbTrending(timeWindow);
      if (liveTrending && liveTrending.length > 0) {
        db.upsertMovies(liveTrending);
        return res.json(liveTrending);
      }
    } catch (err) {
      console.warn('Live TMDB trending failed, using fallback:', err);
    }
    const trending = db.getTrendingMovies();
    res.json(trending);
  });

  // 2. Now Playing in Theaters (Live TMDB with DB Fallback)
  app.get('/api/movies/now-playing', async (req, res) => {
    try {
      const liveNowPlaying = await fetchTmdbNowPlaying();
      if (liveNowPlaying && liveNowPlaying.length > 0) {
        db.upsertMovies(liveNowPlaying);
        return res.json(liveNowPlaying);
      }
    } catch (err) {
      console.warn('Live TMDB now playing failed, using fallback:', err);
    }
    const fallback = db.getMovies({ category: 'now-playing' }).data;
    res.json(fallback.length > 0 ? fallback : db.getTrendingMovies());
  });

  // 3. Top Rated Movies (Live TMDB with DB Fallback)
  app.get('/api/movies/top-rated', async (req, res) => {
    try {
      const liveTopRated = await fetchTmdbTopRated();
      if (liveTopRated && liveTopRated.length > 0) {
        db.upsertMovies(liveTopRated);
        return res.json(liveTopRated);
      }
    } catch (err) {
      console.warn('Live TMDB top rated failed, using fallback:', err);
    }
    const topRated = db.getTopRatedMovies();
    res.json(topRated);
  });

  // 4. Popular Movies (Live TMDB with DB Fallback)
  app.get('/api/movies/popular', async (req, res) => {
    try {
      const livePopular = await fetchTmdbPopular();
      if (livePopular && livePopular.length > 0) {
        db.upsertMovies(livePopular);
        return res.json(livePopular);
      }
    } catch (err) {
      console.warn('Live TMDB popular failed, using fallback:', err);
    }
    const fallback = db.getMovies({ category: 'popular' }).data;
    res.json(fallback.length > 0 ? fallback : db.getFeaturedMovies());
  });

  // 5. Upcoming Releases (Live TMDB with Curated Fallback)
  app.get('/api/movies/upcoming', async (req, res) => {
    try {
      const tmdbData = await fetchTmdbUpcomingReleases();
      db.upsertMovies(tmdbData.movies);
      res.json(tmdbData);
    } catch (err: any) {
      const fallback = db.getUpcomingMovies();
      res.json({ movies: fallback, source: 'curated_tmdb_cache' });
    }
  });

  // 6. Featured Premiere Spotlight
  app.get('/api/movies/featured', (req, res) => {
    const featured = db.getFeaturedMovies();
    res.json(featured);
  });

  // 7. Public Domain 100% Free Streaming Collection
  app.get('/api/movies/public-domain', (req, res) => {
    const pd = db.getPublicDomainMovies();
    res.json(pd);
  });

  // 8. Multi-angle Discover via TMDB
  app.get('/api/movies/discover', async (req, res) => {
    const { genre, year, minRating, sortBy, certification, page } = req.query;
    try {
      const discoverResult = await fetchTmdbDiscover({
        genre: genre as string,
        year: year as string,
        minRating: minRating ? Number(minRating) : undefined,
        sortBy: sortBy as string,
        certification: certification as string,
        page: page ? Number(page) : 1
      });

      if (discoverResult && discoverResult.movies.length > 0) {
        db.upsertMovies(discoverResult.movies);
        return res.json(discoverResult);
      }
    } catch (err) {
      console.warn('Live TMDB discover failed, falling back to local store:', err);
    }

    // Fallback to local catalog
    const localResult = db.getMovies({
      genre: genre as string,
      year: year as string,
      minRating: minRating ? Number(minRating) : undefined,
      sortBy: sortBy as any,
      certification: certification as string,
      page: page ? Number(page) : 1
    });

    res.json({
      movies: localResult.data,
      totalPages: localResult.totalPages,
      totalResults: localResult.total
    });
  });

  // 9. Live TMDB Search
  app.get('/api/movies/search', async (req, res) => {
    const query = req.query.q as string;
    const page = req.query.page ? Number(req.query.page) : 1;
    if (!query || query.trim() === '') return res.json({ movies: [] });

    try {
      const tmdbSearchResults = await fetchTmdbSearch(query, page);
      if (tmdbSearchResults && tmdbSearchResults.length > 0) {
        db.upsertMovies(tmdbSearchResults);
        return res.json({ movies: tmdbSearchResults });
      }
    } catch (err) {
      console.warn('Live TMDB search error, falling back:', err);
    }

    const localSearch = db.getMovies({ search: query, limit: 30 }).data;
    res.json({ movies: localSearch });
  });

  // 10. TMDB Cast & Crew Person Profile
  app.get('/api/movies/person/:id', async (req, res) => {
    const personId = Number(req.params.id);
    if (!personId || isNaN(personId)) {
      return res.status(400).json({ error: 'Valid person ID is required' });
    }

    try {
      const personData = await fetchTmdbPerson(personId);
      if (personData) {
        return res.json(personData);
      }
    } catch (err) {
      console.warn('Person profile fetch error:', err);
    }

    res.status(404).json({ error: 'Person profile not found' });
  });

  // 11. Genre List
  app.get('/api/movies/genres', (req, res) => {
    const genres = db.getGenres();
    res.json(genres);
  });

  // 12. Main Paginated Catalog Filter Route (Live TMDB Discovery + DB Store)
  app.get('/api/movies', async (req, res) => {
    const {
      search,
      genre,
      year,
      minRating,
      sortBy,
      sortOrder,
      page,
      limit,
      category,
      certification
    } = req.query;

    const pageNum = page ? Math.max(1, Number(page)) : 1;
    const limitNum = limit ? Math.max(1, Number(limit)) : 60;
    const pagesNeeded = Math.ceil(limitNum / 20); // e.g. 60 / 20 = 3 TMDB pages
    const baseTmdbPage = (pageNum - 1) * pagesNeeded + 1;

    // Helper to deduplicate movies by ID or TMDB ID
    const dedupeMovies = (list: any[]): any[] => {
      const seen = new Set<string>();
      return list.filter(item => {
        if (!item) return false;
        const key = String(item.tmdbId || item.id || item.title);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    };

    // 1. Try Live TMDB first for real-time rich catalog
    try {
      if (search && String(search).trim() !== '') {
        const queryText = String(search).trim();
        const searchPromises = Array.from({ length: pagesNeeded }, (_, idx) => 
          fetchTmdbSearch(queryText, baseTmdbPage + idx)
        );
        const searchResults = await Promise.all(searchPromises);
        const combinedSearch = dedupeMovies(searchResults.flat().filter(Boolean));

        if (combinedSearch.length > 0) {
          db.upsertMovies(combinedSearch);
          return res.json({
            data: combinedSearch.slice(0, limitNum),
            total: Math.max(combinedSearch.length, 300),
            page: pageNum,
            limit: limitNum,
            totalPages: 10
          });
        }
      } else if (category === 'trending') {
        const trendingPromises = Array.from({ length: pagesNeeded }, (_, idx) => 
          fetchTmdbTrending('week', baseTmdbPage + idx)
        );
        const trendingResults = await Promise.all(trendingPromises);
        const combinedTrending = dedupeMovies(trendingResults.flat().filter(Boolean));

        if (combinedTrending.length > 0) {
          db.upsertMovies(combinedTrending);
          return res.json({
            data: combinedTrending.slice(0, limitNum),
            total: 300,
            page: pageNum,
            limit: limitNum,
            totalPages: 10
          });
        }
      } else if (category === 'top-rated') {
        const topPromises = Array.from({ length: pagesNeeded }, (_, idx) => 
          fetchTmdbTopRated(baseTmdbPage + idx)
        );
        const topResults = await Promise.all(topPromises);
        const combinedTop = dedupeMovies(topResults.flat().filter(Boolean));

        if (combinedTop.length > 0) {
          db.upsertMovies(combinedTop);
          return res.json({
            data: combinedTop.slice(0, limitNum),
            total: 300,
            page: pageNum,
            limit: limitNum,
            totalPages: 10
          });
        }
      } else if (category === 'popular') {
        const popPromises = Array.from({ length: pagesNeeded }, (_, idx) => 
          fetchTmdbPopular(baseTmdbPage + idx)
        );
        const popResults = await Promise.all(popPromises);
        const combinedPop = dedupeMovies(popResults.flat().filter(Boolean));

        if (combinedPop.length > 0) {
          db.upsertMovies(combinedPop);
          return res.json({
            data: combinedPop.slice(0, limitNum),
            total: 300,
            page: pageNum,
            limit: limitNum,
            totalPages: 10
          });
        }
      } else if (category === 'upcoming') {
        const upcomingData = await fetchTmdbUpcomingReleases();
        if (upcomingData && upcomingData.movies.length > 0) {
          db.upsertMovies(upcomingData.movies);
          const start = (pageNum - 1) * limitNum;
          const paginatedUpcoming = upcomingData.movies.slice(start, start + limitNum);
          return res.json({
            data: paginatedUpcoming,
            total: upcomingData.movies.length,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(upcomingData.movies.length / limitNum) || 1
          });
        }
      } else if (category !== 'public-domain') {
        // Query TMDB Discover across batch pages in parallel for genre / year / rating / sort
        const discoverPromises = Array.from({ length: pagesNeeded }, (_, idx) => 
          fetchTmdbDiscover({
            genre: genre as string,
            year: year as string,
            minRating: minRating ? Number(minRating) : undefined,
            sortBy: sortBy as string,
            certification: certification as string,
            page: baseTmdbPage + idx
          })
        );

        const discoverResults = await Promise.all(discoverPromises);
        const validDiscover = discoverResults.filter(Boolean);
        const allMovies = dedupeMovies(validDiscover.flatMap(d => d?.movies || []));

        if (allMovies.length > 0) {
          db.upsertMovies(allMovies);
          const maxTotalPages = Math.max(1, Math.ceil((validDiscover[0]?.totalPages || 10) / pagesNeeded));
          return res.json({
            data: allMovies.slice(0, limitNum),
            total: validDiscover[0]?.totalResults || allMovies.length,
            page: pageNum,
            limit: limitNum,
            totalPages: maxTotalPages
          });
        }
      }
    } catch (err) {
      console.warn('Live TMDB query in /api/movies failed, falling back to local database store:', err);
    }

    // 2. Fallback to Local Catalog Database
    const result = db.getMovies({
      search: search as string,
      genre: genre as string,
      year: year as string,
      minRating: minRating ? Number(minRating) : undefined,
      sortBy: sortBy as any,
      sortOrder: sortOrder as any,
      page: pageNum,
      limit: limitNum,
      category: category as any,
      certification: certification as string
    });

    res.json(result);
  });

  // 13. Deep Movie Details (with full credits, reviews, trailers, similar)
  app.get('/api/movies/:id', async (req, res) => {
    let movie = db.getMovieById(req.params.id);

    // If movie doesn't have cast or is from TMDB, fetch deep details from TMDB
    if (movie && movie.tmdbId && (!movie.cast || movie.cast.length === 0)) {
      try {
        const enriched = await fetchTmdbMovieDetails(movie.tmdbId);
        if (enriched) {
          db.upsertMovies([enriched]);
          movie = enriched;
        }
      } catch (e) {
        // use existing
      }
    } else if (!movie && !isNaN(Number(req.params.id))) {
      // Try direct TMDB ID fetch
      try {
        const liveMovie = await fetchTmdbMovieDetails(req.params.id);
        if (liveMovie) {
          db.upsertMovies([liveMovie]);
          movie = liveMovie;
        }
      } catch (e) {
        // ignore
      }
    }

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    const reviews = db.getReviewsByMovieId(movie.id);
    const similar = db.getSimilarMovies(movie.id);

    res.json({
      movie,
      reviews,
      similar
    });
  });

  app.get('/api/movies/:id/similar', (req, res) => {
    const similar = db.getSimilarMovies(req.params.id);
    res.json(similar);
  });

  // ==========================================
  // WATCHLIST, FAVORITES & HISTORY
  // ==========================================
  app.get('/api/watchlist', (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const movies = db.getUserWatchlistMovies(user.id);
    res.json({ movies, watchlistIds: user.watchlist });
  });

  app.post('/api/watchlist/:movieId', (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const result = db.toggleWatchlist(user.id, req.params.movieId);
    res.json(result);
  });

  app.get('/api/favorites', (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const movies = db.getUserFavoritesMovies(user.id);
    res.json({ movies, favoritesIds: user.favorites });
  });

  app.post('/api/favorites/:movieId', (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const result = db.toggleFavorite(user.id, req.params.movieId);
    res.json(result);
  });

  app.post('/api/history/:movieId', (req, res) => {
    const user = (req as any).user;
    if (user) {
      db.logWatchHistory(user.id, req.params.movieId, req.body.progressPercent || 100);
    }
    res.json({ success: true });
  });

  // ==========================================
  // REVIEWS & RATINGS
  // ==========================================
  app.get('/api/reviews/:movieId', (req, res) => {
    const reviews = db.getReviewsByMovieId(req.params.movieId);
    res.json(reviews);
  });

  app.post('/api/reviews/:movieId', (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'Please log in to submit a review.' });

    const { rating, title, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ error: 'Rating and review comment are required.' });
    }

    const review = db.addReview({
      movieId: req.params.movieId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      rating: Number(rating),
      title: title || 'User Review',
      comment
    });

    res.status(201).json(review);
  });

  app.post('/api/reviews/:id/like', (req, res) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'Please log in to like reviews.' });

    try {
      const review = db.likeReview(req.params.id, user.id);
      res.json(review);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  });

  // ==========================================
  // AI RECOMMENDATIONS & CINEBOT ASSISTANT
  // ==========================================
  app.post('/api/recommendations/ai', async (req, res) => {
    try {
      const result = await generateMovieRecommendations(req.body);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: 'Recommendation service error', details: err.message });
    }
  });

  app.post('/api/ai/assistant', async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) return res.status(400).json({ error: 'Message is required' });

      const reply = await askCineBotAssistant(message, history);
      res.json({ reply });
    } catch (err: any) {
      res.status(500).json({ error: 'AI Assistant error' });
    }
  });

  // ==========================================
  // AUDIENCE ENGAGEMENT & RETENTION MODULES
  // ==========================================
  
  // 1. Cinema Roulette (Random Film Wheel Picker)
  app.get('/api/engagement/roulette', (req, res) => {
    const { mood, minRating } = req.query;
    const movie = getRouletteMovie(mood as string, minRating ? Number(minRating) : 0);
    if (!movie) {
      return res.status(404).json({ error: 'No movie found matching criteria' });
    }
    res.json({ movie });
  });

  // 2. Movie Battles (This or That Arena Matchups)
  app.get('/api/engagement/battles', (req, res) => {
    const matchups = getBattleMatchups();
    res.json({ matchups });
  });

  app.post('/api/engagement/battles/vote', (req, res) => {
    const { battleId, choice } = req.body;
    if (!battleId || (choice !== 'A' && choice !== 'B')) {
      return res.status(400).json({ error: 'Valid battleId and choice (A or B) are required' });
    }
    const result = voteInBattle(battleId, choice);
    res.json(result);
  });

  // 3. CineQuiz (Interactive Movie Trivia Challenge)
  app.get('/api/engagement/trivia', (req, res) => {
    const count = req.query.count ? Math.min(20, Math.max(1, Number(req.query.count))) : 8;
    const questions = getTriviaQuestions(count);
    res.json({ questions });
  });

  // 4. Double-Feature Binge Pairing
  app.get('/api/engagement/pairings/:id', (req, res) => {
    const pairing = getDoubleFeaturePairing(req.params.id);
    if (!pairing) {
      return res.status(404).json({ error: 'Pairing not found' });
    }
    res.json(pairing);
  });

  // ==========================================
  // SEO & SEARCH ENGINE INDEXING ENDPOINTS
  // ==========================================
  // Google Search Console dynamic verification endpoint support
  app.get('/google:code.html', (req, res) => {
    const code = req.params.code;
    res.type('text/html').send(`google-site-verification: google${code}.html`);
  });

  app.get('/robots.txt', (req, res) => {
    const host = req.get('host') || 'localhost:3000';
    const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;
    const robotsTxt = `User-agent: *
Allow: /
Allow: /movie/
Allow: /sitemap.xml
Allow: /sitemap-main.xml
Allow: /sitemap-movies.xml
Allow: /sitemap-keywords.xml
Allow: /api/movies
Allow: /api/seo/keywords

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-movies.xml
Sitemap: ${baseUrl}/sitemap-keywords.xml
`;
    res.type('text/plain').send(robotsTxt);
  });

  // Google Search Console Site Verification HTML Route
  app.get(['/google5RTlUdLRSGgXvy-pOayANGe1FfpElbiLsOgtvmaxuRs.html', '/google:code.html'], (req, res) => {
    res.type('text/html').send('google-site-verification: google5RTlUdLRSGgXvy-pOayANGe1FfpElbiLsOgtvmaxuRs.html');
  });

  // Master Sitemap Index for Google Search Console
  app.get('/sitemap.xml', (req, res) => {
    const host = req.get('host') || 'localhost:3000';
    const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;
    const today = new Date().toISOString().split('T')[0];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-main.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-movies.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-keywords.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;

    res.type('application/xml').send(xml);
  });

  // Main navigation sitemap
  app.get('/sitemap-main.xml', (req, res) => {
    const host = req.get('host') || 'localhost:3000';
    const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;
    const today = new Date().toISOString().split('T')[0];

    const staticUrls = [
      { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
      { loc: `${baseUrl}/?view=upcoming`, priority: '0.9', changefreq: 'daily' },
      { loc: `${baseUrl}/?view=home`, priority: '0.9', changefreq: 'daily' },
      { loc: `${baseUrl}/?view=explore`, priority: '0.9', changefreq: 'daily' },
      { loc: `${baseUrl}/?view=public-domain`, priority: '0.9', changefreq: 'weekly' },
      { loc: `${baseUrl}/?category=trending`, priority: '0.8', changefreq: 'daily' },
      { loc: `${baseUrl}/?category=top-rated`, priority: '0.8', changefreq: 'weekly' },
      { loc: `${baseUrl}/?category=upcoming`, priority: '0.8', changefreq: 'daily' },
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    res.type('application/xml').send(xml);
  });

  // Comprehensive Movies Sitemap with Google Image extensions & Clean URLs
  app.get('/sitemap-movies.xml', (req, res) => {
    const host = req.get('host') || 'localhost:3000';
    const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;
    const allMovies = db.getAllMovies();
    const today = new Date().toISOString().split('T')[0];

    const movieUrls = allMovies.map(m => {
      const slug = encodeURIComponent(m.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
      return {
        loc: `${baseUrl}/movie/${m.id}/${slug}`,
        lastmod: m.updatedAt ? m.updatedAt.split('T')[0] : today,
        priority: m.rating && m.rating >= 8.0 ? '1.0' : '0.8',
        changefreq: 'weekly',
        image: m.poster || m.backdrop,
        title: `${m.title} (${m.releaseYear || 2026})`
      };
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${movieUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
    ${u.image ? `<image:image>
      <image:loc>${u.image.replace(/&/g, '&amp;')}</image:loc>
      <image:title>${u.title.replace(/&/g, '&amp;')}</image:title>
    </image:image>` : ''}
  </url>`).join('\n')}
</urlset>`;

    res.type('application/xml').send(xml);
  });

  // Keyword Clusters Sitemap for Google Search Rankings
  app.get('/sitemap-keywords.xml', (req, res) => {
    const host = req.get('host') || 'localhost:3000';
    const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;
    const today = new Date().toISOString().split('T')[0];
    const allMovies = db.getAllMovies();

    const uniqueKeywords = new Set<string>();
    allMovies.forEach(m => {
      const kws = generateMovieKeywords(m);
      kws.slice(0, 10).forEach(kw => uniqueKeywords.add(kw));
    });

    const keywordUrls = Array.from(uniqueKeywords).slice(0, 500).map(kw => ({
      loc: `${baseUrl}/?search=${encodeURIComponent(kw)}`,
      priority: '0.7',
      changefreq: 'weekly'
    }));

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${keywordUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    res.type('application/xml').send(xml);
  });

  // API endpoint for Google SEO Keyword Discovery & ranking tags
  app.get('/api/seo/keywords', (req, res) => {
    const allMovies = db.getAllMovies();
    const keywordMap: Record<string, { count: number; sampleMovies: Array<{ id: string; title: string; year: number; poster: string }> }> = {};

    allMovies.forEach(m => {
      const kws = generateMovieKeywords(m);
      kws.forEach(kw => {
        if (!keywordMap[kw]) {
          keywordMap[kw] = { count: 0, sampleMovies: [] };
        }
        keywordMap[kw].count += 1;
        if (keywordMap[kw].sampleMovies.length < 3) {
          keywordMap[kw].sampleMovies.push({
            id: m.id,
            title: m.title,
            year: m.releaseYear || 2026,
            poster: m.poster
          });
        }
      });
    });

    // Sort by popularity / count
    const sortedKeywords = Object.entries(keywordMap)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 120)
      .map(([keyword, data]) => ({
        keyword,
        count: data.count,
        sampleMovies: data.sampleMovies
      }));

    res.json({
      totalKeywords: Object.keys(keywordMap).length,
      topKeywords: sortedKeywords
    });
  });

  // Helper to dynamically inject SSR Meta & Google Structured Data into HTML
  const injectSeoIntoHtml = async (html: string, req: express.Request): Promise<string> => {
    let movieId = (req.query.movie as string) || (req.query.id as string);
    
    // Check if path is /movie/:id or /movie/:id/:slug
    if (!movieId && req.path.startsWith('/movie/')) {
      const parts = req.path.split('/').filter(Boolean);
      if (parts[1]) {
        movieId = parts[1];
      }
    }

    if (!movieId) return html;

    let movie = db.getMovieById(movieId);
    if (!movie && !isNaN(Number(movieId))) {
      try {
        const liveMovie = await fetchTmdbMovieDetails(movieId);
        if (liveMovie) {
          db.upsertMovies([liveMovie]);
          movie = liveMovie;
        }
      } catch {
        // fallback
      }
    }

    if (!movie) return html;

    const host = req.get('host') || 'localhost:3000';
    const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;
    const slug = encodeURIComponent(movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    const pageUrl = `${baseUrl}/movie/${movie.id}/${slug}`;

    const title = `${movie.title} (${movie.releaseYear || 2026}) — Watch Trailer, Cast, Stream & Reviews | Jamal Movies`;
    const description = `${movie.title} (${movie.releaseYear || 2026}) directed by ${movie.director || 'acclaimed filmmakers'}. ${movie.overview?.slice(0, 155)}... Watch official HD trailers, cast details, user reviews, and stream on Jamal Movies.`;
    const keywords = generateMovieKeywords(movie).slice(0, 25).join(', ');
    const image = movie.backdrop || movie.poster;

    const movieKeywords = generateMovieKeywords(movie);
    const movieJsonLd: any = {
      '@context': 'https://schema.org',
      '@type': 'Movie',
      '@id': `${pageUrl}#movie`,
      'url': pageUrl,
      'name': movie.title,
      'alternativeHeadline': movie.originalTitle || movie.title,
      'description': movie.overview,
      'image': [movie.poster, movie.backdrop].filter(Boolean),
      'dateCreated': movie.releaseDate || `${movie.releaseYear}-01-01`,
      'datePublished': movie.releaseDate || `${movie.releaseYear}-01-01`,
      'genre': movie.genres,
      'duration': `PT${movie.runtime || 120}M`,
      'contentRating': movie.certification || 'PG-13',
      'inLanguage': 'en',
      'keywords': keywords,
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': movie.rating,
        'bestRating': '10',
        'worstRating': '1',
        'ratingCount': movie.voteCount && movie.voteCount > 0 ? movie.voteCount : 150
      }
    };

    if (movie.director) {
      movieJsonLd.director = { '@type': 'Person', 'name': movie.director };
    }
    if (movie.cast && movie.cast.length > 0) {
      movieJsonLd.actor = movie.cast.slice(0, 8).map(c => ({ '@type': 'Person', 'name': c.name, image: c.profilePath }));
    }
    if (movie.trailerKey) {
      movieJsonLd.trailer = {
        '@type': 'VideoObject',
        'name': `${movie.title} Official HD Trailer`,
        'description': `Official HD trailer for ${movie.title} (${movie.releaseYear}). Watch on Jamal Movies.`,
        'thumbnailUrl': `https://img.youtube.com/vi/${movie.trailerKey}/hqdefault.jpg`,
        'embedUrl': `https://www.youtube.com/embed/${movie.trailerKey}`,
        'uploadDate': movie.releaseDate || '2026-01-01'
      };
    }
    if (movie.publicDomain && movie.streamUrl) {
      movieJsonLd.video = {
        '@type': 'VideoObject',
        'name': `${movie.title} Full Free Legal Stream`,
        'description': `Watch full legal public domain film ${movie.title} on Jamal Movies.`,
        'thumbnailUrl': movie.poster || movie.backdrop,
        'contentUrl': movie.streamUrl,
        'uploadDate': movie.releaseDate || '2026-01-01'
      };
    }

    const faqs = generateMovieFAQs(movie, baseUrl);
    const faqJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(f => ({
        '@type': 'Question',
        'name': f.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': f.answer
        }
      }))
    };

    const breadcrumbJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': baseUrl },
        { '@type': 'ListItem', 'position': 2, 'name': movie.genres?.[0] || 'Movies', 'item': `${baseUrl}/?genre=${movie.genres?.[0] || 'all'}` },
        { '@type': 'ListItem', 'position': 3, 'name': movie.title, 'item': pageUrl }
      ]
    };

    const scriptTags = `<title>${title}</title>
    <meta name="title" content="${title}" />
    <meta name="description" content="${description}" />
    <meta name="keywords" content="${keywords}" />
    <link rel="canonical" href="${pageUrl}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:url" content="${pageUrl}" />
    <meta property="og:type" content="video.movie" />
    <meta property="twitter:title" content="${title}" />
    <meta property="twitter:description" content="${description}" />
    <meta property="twitter:image" content="${image}" />
    <script type="application/ld+json">
      ${JSON.stringify({ '@context': 'https://schema.org', '@graph': [movieJsonLd, faqJsonLd, breadcrumbJsonLd] })}
    </script>`;

    // Replace default title and inject tags before </head>
    return html.replace(/<title>.*?<\/title>/, '').replace('</head>', `${scriptTags}\n  </head>`);
  };

  // ==========================================
  // VITE & STATIC SERVING
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });

    app.use(async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api') || url.startsWith('/robots.txt') || url.startsWith('/sitemap') || url.startsWith('/google')) {
        return next();
      }

      // Check if direct movie or query is requested to inject SEO tags
      if (req.query.movie || req.query.id || req.path.startsWith('/movie/')) {
        try {
          const indexHtml = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
          const template = await vite.transformIndexHtml(url, indexHtml);
          const injectedHtml = await injectSeoIntoHtml(template, req);
          return res.status(200).set({ 'Content-Type': 'text/html' }).end(injectedHtml);
        } catch (e) {
          return next(e);
        }
      }

      next();
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', async (req, res) => {
      try {
        const indexHtml = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');
        const injectedHtml = await injectSeoIntoHtml(indexHtml, req);
        res.send(injectedHtml);
      } catch (err) {
        res.sendFile(path.join(distPath, 'index.html'));
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎬 Jamal Cinema Studio Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});

