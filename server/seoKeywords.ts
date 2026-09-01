import { Movie } from '../src/types';

/**
 * Generates an exhaustive list of Google search target keywords for a movie,
 * covering high-intent long-tail keywords, cast, crew, genre combinations, and search queries.
 */
export function generateMovieKeywords(movie: Movie): string[] {
  const keywordsSet = new Set<string>();

  const title = movie.title;
  const year = movie.releaseYear || (movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 2026);
  const director = movie.director;
  const genres = movie.genres || [];
  const castNames = (movie.cast || []).slice(0, 5).map(c => c.name);

  // 1. Core Title & Year combinations
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
  keywordsSet.add(`${title} clips`.toLowerCase());

  // 4. Release Date & Schedule
  keywordsSet.add(`${title} release date`.toLowerCase());
  keywordsSet.add(`${title} ${year} premiere`.toLowerCase());
  keywordsSet.add(`${title} theatrical release`.toLowerCase());

  // 5. Cast, Director & Crew Queries
  if (director) {
    keywordsSet.add(`${director} ${title}`.toLowerCase());
    keywordsSet.add(`${director} movies`.toLowerCase());
    keywordsSet.add(`${director} new film`.toLowerCase());
  }

  castNames.forEach(actor => {
    keywordsSet.add(`${actor} in ${title}`.toLowerCase());
    keywordsSet.add(`${actor} new movie`.toLowerCase());
    keywordsSet.add(`${actor} ${year} film`.toLowerCase());
  });

  // 6. Synopsis, Plot, Rating & Reviews
  keywordsSet.add(`${title} review`.toLowerCase());
  keywordsSet.add(`${title} rating`.toLowerCase());
  keywordsSet.add(`${title} synopsis`.toLowerCase());
  keywordsSet.add(`${title} plot summary`.toLowerCase());
  keywordsSet.add(`${title} explained`.toLowerCase());

  // 7. Genre + Theme Keywords
  genres.forEach(genre => {
    keywordsSet.add(`best ${genre.toLowerCase()} movies ${year}`);
    keywordsSet.add(`${genre.toLowerCase()} film ${title.toLowerCase()}`);
  });

  // 8. Custom Movie Keywords
  if (movie.keywords && Array.isArray(movie.keywords)) {
    movie.keywords.forEach(kw => {
      keywordsSet.add(kw.toLowerCase());
      keywordsSet.add(`${title.toLowerCase()} ${kw.toLowerCase()}`);
    });
  }

  // 9. Public Domain / Free Cinema specific keywords
  if (movie.publicDomain) {
    keywordsSet.add(`watch ${title.toLowerCase()} free public domain`);
    keywordsSet.add(`${title.toLowerCase()} legal open stream`);
    keywordsSet.add(`classic cinema ${title.toLowerCase()}`);
    keywordsSet.add(`archive.org ${title.toLowerCase()} full movie`);
  }

  return Array.from(keywordsSet);
}

/**
 * Generates an SEO FAQ array for rich Google Search FAQ structured data
 */
export function generateMovieFAQs(movie: Movie, baseUrl: string) {
  const title = movie.title;
  const year = movie.releaseYear || (movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 2026);
  const isUpcoming = movie.releaseDate && new Date(movie.releaseDate) > new Date();

  const faqs = [
    {
      question: `What is the release date of ${title}?`,
      answer: movie.releaseDate 
        ? `${title} is scheduled for release on ${movie.releaseDate}. Track full premiere countdowns and latest trailers on Jamal Movies.`
        : `${title} was released in ${year}.`
    },
    {
      question: `Who stars in and directs ${title}?`,
      answer: `${title} is directed by ${movie.director || 'renowned filmmakers'}${movie.cast && movie.cast.length > 0 ? ` and stars ${movie.cast.slice(0, 4).map(c => c.name).join(', ')}` : ''}.`
    },
    {
      question: `What is the storyline of ${title}?`,
      answer: movie.overview || `Explore the complete synopsis, cast list, and trailer clips for ${title} on Jamal Movies.`
    },
    {
      question: `Where can I watch ${title} online or see official trailers?`,
      answer: movie.publicDomain 
        ? `${title} is a verified open-license public domain masterpiece available for 100% free, legal full-length streaming on Jamal Movies.`
        : `You can watch official HD trailers, preview clips, ratings, and theater/streaming release schedules for ${title} directly on Jamal Movies.`
    }
  ];

  return faqs;
}
