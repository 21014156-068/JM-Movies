import { Movie } from '../types';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'video.movie' | 'article';
  movie?: Movie | null;
  moviesList?: Movie[];
  breadcrumbs?: Array<{ name: string; item: string }>;
}

export function generateKeywordsForMovie(movie: Movie): string[] {
  const keywordsSet = new Set<string>();

  const title = movie.title;
  const year = movie.releaseYear || (movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 2026);
  const director = movie.director;
  const genres = movie.genres || [];
  const castNames = (movie.cast || []).slice(0, 6).map(c => c.name);

  // 1. Core Title & Year
  keywordsSet.add(title.toLowerCase());
  keywordsSet.add(`${title} ${year}`.toLowerCase());
  keywordsSet.add(`${title} movie`.toLowerCase());
  keywordsSet.add(`${title} full movie`.toLowerCase());
  keywordsSet.add(`${title} film`.toLowerCase());

  // 2. High-Intent Streaming & Watch keywords
  keywordsSet.add(`watch ${title}`.toLowerCase());
  keywordsSet.add(`watch ${title} online`.toLowerCase());
  keywordsSet.add(`watch ${title} free`.toLowerCase());
  keywordsSet.add(`stream ${title}`.toLowerCase());
  keywordsSet.add(`${title} streaming release`.toLowerCase());
  keywordsSet.add(`${title} online in hd`.toLowerCase());

  // 3. Media, Trailers & Teasers
  keywordsSet.add(`${title} official trailer`.toLowerCase());
  keywordsSet.add(`${title} trailer hd`.toLowerCase());
  keywordsSet.add(`${title} teaser`.toLowerCase());

  // 4. Release Date & Schedule
  keywordsSet.add(`${title} release date`.toLowerCase());
  keywordsSet.add(`${title} ${year} premiere`.toLowerCase());

  // 5. Cast & Director
  if (director) {
    keywordsSet.add(`${director} ${title}`.toLowerCase());
    keywordsSet.add(`${director} movies`.toLowerCase());
  }

  castNames.forEach(actor => {
    keywordsSet.add(`${actor} ${title}`.toLowerCase());
    keywordsSet.add(`${actor} movies`.toLowerCase());
  });

  // 6. Synopsis & Reviews
  keywordsSet.add(`${title} review`.toLowerCase());
  keywordsSet.add(`${title} rating`.toLowerCase());
  keywordsSet.add(`${title} synopsis`.toLowerCase());

  // 7. Genres
  genres.forEach(g => {
    keywordsSet.add(`${g.toLowerCase()} movies ${year}`);
    keywordsSet.add(`${g.toLowerCase()} film ${title.toLowerCase()}`);
  });

  // 8. Custom tags
  if (movie.keywords && Array.isArray(movie.keywords)) {
    movie.keywords.forEach(kw => keywordsSet.add(kw.toLowerCase()));
  }

  // 9. Free streaming
  if (movie.publicDomain) {
    keywordsSet.add(`watch ${title.toLowerCase()} free public domain`);
    keywordsSet.add(`${title.toLowerCase()} legal open stream`);
  }

  return Array.from(keywordsSet);
}

export function updatePageSEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  movie,
  moviesList,
  breadcrumbs
}: SEOProps) {
  if (typeof document === 'undefined') return;

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://jamalmovies.com';
  const fullUrl = url ? (url.startsWith('http') ? url : `${baseUrl}${url}`) : (typeof window !== 'undefined' ? window.location.href : baseUrl);

  // 1. Document Title
  const finalTitle = title 
    ? (title.includes('Jamal Movies') ? title : `${title} | Jamal Movies`)
    : (movie 
      ? `${movie.title} (${movie.releaseYear}) — Watch Trailer, Cast, Synopsis & Stream | Jamal Movies`
      : 'Jamal Movies — Watch Free Cinema, Trailers & Discover Movies Online');
  document.title = finalTitle;

  // 2. Meta Helper
  const setMeta = (selector: string, attr: string, value: string) => {
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      const [key, val] = selector.replace('meta[', '').replace(']', '').split('=');
      if (key && val) {
        el.setAttribute(key, val.replace(/['"]/g, ''));
        document.head.appendChild(el);
      }
    }
    el.setAttribute(attr, value);
  };

  // Primary Meta
  const finalDesc = description || (movie 
    ? `${movie.title} (${movie.releaseYear}) directed by ${movie.director || 'acclaimed filmmakers'}. ${movie.overview?.slice(0, 160)}... Watch official trailers, ratings, keywords, and reviews on Jamal Movies.`
    : 'Discover popular movies, trending blockbusters, official HD trailers, cast details, ratings, reviews, and stream verified public-domain films legal and free on Jamal Movies.'
  );

  setMeta('meta[name="description"]', 'content', finalDesc);
  setMeta('meta[name="title"]', 'content', finalTitle);

  // Keywords
  const finalKeywords = keywords && keywords.length > 0
    ? keywords
    : (movie ? generateKeywordsForMovie(movie) : [
        'movies', 'watch movies', 'trailers', 'cinema discovery', 'tmdb movies', 'stream free movies', 'public domain cinema', 'movie ratings 2026', 'upcoming films'
      ]);
  setMeta('meta[name="keywords"]', 'content', finalKeywords.join(', '));

  // Canonical
  let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', fullUrl);

  // Open Graph
  const finalImage = image || movie?.backdrop || movie?.poster || 'https://image.tmdb.org/t/p/w1280/8YFL5QQVPy3AgrEQxNYVSgiPEbe.jpg';
  setMeta('meta[property="og:title"]', 'content', finalTitle);
  setMeta('meta[property="og:description"]', 'content', finalDesc);
  setMeta('meta[property="og:image"]', 'content', finalImage);
  setMeta('meta[property="og:url"]', 'content', fullUrl);
  setMeta('meta[property="og:type"]', 'content', type);

  // Twitter
  setMeta('meta[property="twitter:title"]', 'content', finalTitle);
  setMeta('meta[property="twitter:description"]', 'content', finalDesc);
  setMeta('meta[property="twitter:image"]', 'content', finalImage);

  // 3. Schema.org JSON-LD structured data injection
  let script = document.getElementById('dynamic-seo-jsonld') as HTMLScriptElement;
  if (!script) {
    script = document.createElement('script');
    script.id = 'dynamic-seo-jsonld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  const jsonLdGraph: any[] = [];

  // Movie Schema (Schema.org/Movie)
  if (movie) {
    const movieKeywords = generateKeywordsForMovie(movie);
    const movieSchema: any = {
      '@context': 'https://schema.org',
      '@type': 'Movie',
      '@id': `${baseUrl}/movie/${movie.id}#movie`,
      'url': `${baseUrl}/?movie=${movie.id}`,
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
      'keywords': movieKeywords.slice(0, 15).join(', '),
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': movie.rating,
        'bestRating': '10',
        'worstRating': '1',
        'ratingCount': movie.voteCount && movie.voteCount > 0 ? movie.voteCount : 150
      }
    };

    if (movie.director) {
      movieSchema.director = {
        '@type': 'Person',
        'name': movie.director
      };
    }

    if (movie.cast && movie.cast.length > 0) {
      movieSchema.actor = movie.cast.slice(0, 10).map(c => ({
        '@type': 'Person',
        'name': c.name,
        ...(c.profilePath ? { 'image': c.profilePath } : {})
      }));
    }

    if (movie.trailerKey) {
      movieSchema.trailer = {
        '@type': 'VideoObject',
        'name': `${movie.title} Official HD Trailer`,
        'description': `Official HD trailer for ${movie.title} (${movie.releaseYear}). Watch on Jamal Movies.`,
        'thumbnailUrl': `https://img.youtube.com/vi/${movie.trailerKey}/hqdefault.jpg`,
        'embedUrl': `https://www.youtube.com/embed/${movie.trailerKey}`,
        'uploadDate': movie.releaseDate || '2026-01-01'
      };
    }

    if (movie.publicDomain && movie.streamUrl) {
      movieSchema.video = {
        '@type': 'VideoObject',
        'name': `${movie.title} Full Free Legal Stream`,
        'description': `Watch full legal public domain film ${movie.title} on Jamal Movies.`,
        'thumbnailUrl': movie.poster || movie.backdrop,
        'contentUrl': movie.streamUrl,
        'uploadDate': movie.releaseDate || '2026-01-01'
      };
    }

    jsonLdGraph.push(movieSchema);

    // FAQ Schema for Movie
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': `What is the release date of ${movie.title}?`,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': movie.releaseDate 
              ? `${movie.title} is released on ${movie.releaseDate}. Track countdowns and trailers on Jamal Movies.`
              : `${movie.title} was released in ${movie.releaseYear}.`
          }
        },
        {
          '@type': 'Question',
          'name': `Who directed and stars in ${movie.title}?`,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': `${movie.title} is directed by ${movie.director || 'notable creators'}${movie.cast?.length ? ` and stars ${movie.cast.slice(0, 4).map(c => c.name).join(', ')}` : ''}.`
          }
        },
        {
          '@type': 'Question',
          'name': `Where can I watch ${movie.title} or see its trailer?`,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': movie.publicDomain 
              ? `${movie.title} is available to stream 100% free and legally on Jamal Movies.`
              : `Watch the official HD trailer, cast interviews, and ratings for ${movie.title} on Jamal Movies.`
          }
        }
      ]
    };
    jsonLdGraph.push(faqSchema);
  }

  // ItemList Schema for rich carousel / list snippets
  if (moviesList && moviesList.length > 0) {
    const itemListSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': title || 'Popular & Trending Movies',
      'description': finalDesc,
      'numberOfItems': moviesList.length,
      'itemListElement': moviesList.slice(0, 30).map((m, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'item': {
          '@type': 'Movie',
          'name': m.title,
          'image': m.poster,
          'url': `${baseUrl}/?movie=${m.id}`,
          'datePublished': m.releaseDate || `${m.releaseYear}-01-01`,
          'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': m.rating,
            'bestRating': '10',
            'ratingCount': m.voteCount || 50
          }
        }
      }))
    };
    jsonLdGraph.push(itemListSchema);
  }

  // Breadcrumbs Schema
  if (breadcrumbs && breadcrumbs.length > 0) {
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((bc, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': bc.name,
        'item': bc.item.startsWith('http') ? bc.item : `${baseUrl}${bc.item}`
      }))
    };
    jsonLdGraph.push(breadcrumbSchema);
  }

  if (jsonLdGraph.length > 0) {
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': jsonLdGraph
    }, null, 2);
  }
}
