import { Movie, CastMember, CrewMember } from '../src/types';

// Map of TMDB Genre IDs to names
const TMDB_GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};

export const CURATED_UPCOMING_RELEASES: Movie[] = [
  {
    id: 'mov-up-1',
    tmdbId: 1003596,
    title: 'Avengers: Doomsday',
    originalTitle: 'Avengers: Doomsday',
    tagline: 'New dynasty. Ultimate doom.',
    overview: 'Earth\'s mightiest heroes face their most formidable existential adversary when Doctor Victor von Doom emerges from the multiverse with devastating cosmic ambition.',
    poster: 'https://image.tmdb.org/t/p/w500/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    releaseDate: '2026-11-06',
    releaseYear: 2026,
    runtime: 165,
    genres: ['Action', 'Science Fiction', 'Adventure'],
    rating: 9.3,
    voteCount: 3100,
    popularity: 99.8,
    certification: 'PG-13',
    trailerKey: 'hA6hldpST08',
    director: 'Anthony Russo, Joe Russo',
    upcoming: true,
    featured: true,
    cast: [
      { id: 1021, name: 'Robert Downey Jr.', character: 'Victor von Doom / Doctor Doom', profilePath: 'https://image.tmdb.org/t/p/w185/5q.jpg' },
      { id: 1022, name: 'Pedro Pascal', character: 'Reed Richards / Mr. Fantastic', profilePath: 'https://image.tmdb.org/t/p/w185/pp.jpg' },
      { id: 1023, name: 'Benedict Cumberbatch', character: 'Dr. Stephen Strange', profilePath: 'https://image.tmdb.org/t/p/w185/bc.jpg' },
      { id: 1024, name: 'Tom Holland', character: 'Peter Parker / Spider-Man', profilePath: 'https://image.tmdb.org/t/p/w185/th.jpg' },
      { id: 1025, name: 'Anthony Mackie', character: 'Sam Wilson / Captain America', profilePath: 'https://image.tmdb.org/t/p/w185/am.jpg' }
    ],
    crew: [
      { id: 2021, name: 'Anthony Russo', job: 'Director', department: 'Directing' },
      { id: 2022, name: 'Joe Russo', job: 'Director', department: 'Directing' },
      { id: 2023, name: 'Alan Silvestri', job: 'Original Music Composer', department: 'Sound' }
    ],
    keywords: ['doctor doom', 'multiverse', 'mcu', 'avengers', 'russo brothers', 'marvel']
  },
  {
    id: 'mov-up-2',
    tmdbId: 969681,
    title: 'The Batman Part II',
    originalTitle: 'The Batman Part II',
    tagline: 'Darkness falls deeper over Gotham City.',
    overview: 'Robert Pattinson returns as Bruce Wayne / Batman in the continuation of Matt Reeves\' gritty detective crime noir universe as new criminal kingpins vie for control of a submerged Gotham.',
    poster: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    releaseDate: '2026-10-02',
    releaseYear: 2026,
    runtime: 170,
    genres: ['Crime', 'Action', 'Drama', 'Mystery', 'Thriller'],
    rating: 9.0,
    voteCount: 1900,
    popularity: 97.5,
    certification: 'PG-13',
    trailerKey: 'mqqft2x_Aa4',
    director: 'Matt Reeves',
    upcoming: true,
    featured: true,
    cast: [
      { id: 1071, name: 'Robert Pattinson', character: 'Bruce Wayne / The Batman', profilePath: 'https://image.tmdb.org/t/p/w185/rp.jpg' },
      { id: 1072, name: 'Colin Farrell', character: 'Oswald Cobblepot / The Penguin', profilePath: 'https://image.tmdb.org/t/p/w185/cf.jpg' },
      { id: 1073, name: 'Andy Serkis', character: 'Alfred Pennyworth', profilePath: 'https://image.tmdb.org/t/p/w185/as.jpg' },
      { id: 1074, name: 'Jeffrey Wright', character: 'Jim Gordon', profilePath: 'https://image.tmdb.org/t/p/w185/jw.jpg' }
    ],
    crew: [
      { id: 2071, name: 'Matt Reeves', job: 'Director', department: 'Directing' },
      { id: 2072, name: 'Michael Giacchino', job: 'Original Music Composer', department: 'Sound' }
    ],
    keywords: ['batman', 'gotham city', 'detective', 'matt reeves', 'noir', 'crime epic']
  },
  {
    id: 'mov-up-3',
    tmdbId: 569094,
    title: 'Spider-Man: Beyond the Spider-Verse',
    originalTitle: 'Spider-Man: Beyond the Spider-Verse',
    tagline: 'Miles Morales will defy every destiny in every dimension.',
    overview: 'The conclusion to the Spider-Verse trilogy following Miles Morales as he tries to rescue his father while navigating the multiversal spider-society and confronting his dark alternate universe counterpart on Earth-42.',
    poster: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0x2.jpg',
    releaseDate: '2026-11-20',
    releaseYear: 2026,
    runtime: 145,
    genres: ['Animation', 'Action', 'Adventure', 'Science Fiction'],
    rating: 9.2,
    voteCount: 2800,
    popularity: 98.9,
    certification: 'PG',
    trailerKey: 'cqGjhVJWtEg',
    director: 'Joaquim Dos Santos, Kemp Powers, Justin K. Thompson',
    upcoming: true,
    featured: true,
    cast: [
      { id: 1061, name: 'Shameik Moore', character: 'Miles Morales / Spider-Man', profilePath: 'https://image.tmdb.org/t/p/w185/sm.jpg' },
      { id: 1062, name: 'Hailee Steinfeld', character: 'Gwen Stacy / Spider-Woman', profilePath: 'https://image.tmdb.org/t/p/w185/hs.jpg' },
      { id: 1063, name: 'Oscar Isaac', character: 'Miguel O\'Hara / Spider-Man 2099', profilePath: 'https://image.tmdb.org/t/p/w185/oi.jpg' },
      { id: 1064, name: 'Daniel Kaluuya', character: 'Hobart "Hobie" Brown / Spider-Punk', profilePath: 'https://image.tmdb.org/t/p/w185/dk.jpg' },
      { id: 1065, name: 'Jason Schwartzman', character: 'The Spot', profilePath: 'https://image.tmdb.org/t/p/w185/js.jpg' }
    ],
    crew: [
      { id: 2061, name: 'Phil Lord', job: 'Producer', department: 'Production' },
      { id: 2062, name: 'Christopher Miller', job: 'Producer', department: 'Production' },
      { id: 2063, name: 'Daniel Pemberton', job: 'Original Music Composer', department: 'Sound' }
    ],
    keywords: ['spider-verse', 'miles morales', 'multiverse', 'spider-man', 'animation marvel', 'earth-42']
  },
  {
    id: 'mov-up-4',
    tmdbId: 1195631,
    title: 'The Mandalorian & Grogu',
    originalTitle: 'The Mandalorian & Grogu',
    tagline: 'This is the way... to the big screen.',
    overview: 'The beloved bounty hunter Din Djarin and his Force-sensitive apprentice Grogu embark on a new galactic cinematic quest as the nascent New Republic struggles to safeguard peace against remnant Imperial warlords.',
    poster: 'https://image.tmdb.org/t/p/w500/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    releaseDate: '2026-12-25',
    releaseYear: 2026,
    runtime: 135,
    genres: ['Science Fiction', 'Action', 'Adventure'],
    rating: 9.1,
    voteCount: 2450,
    popularity: 99.2,
    certification: 'PG-13',
    trailerKey: 'aOC8E5z_ifw',
    director: 'Jon Favreau',
    upcoming: true,
    featured: true,
    cast: [
      { id: 1101, name: 'Pedro Pascal', character: 'Din Djarin / The Mandalorian', profilePath: 'https://image.tmdb.org/t/p/w185/pp.jpg' },
      { id: 1102, name: 'Sigourney Weaver', character: 'Imperial Commander', profilePath: 'https://image.tmdb.org/t/p/w185/sig.jpg' },
      { id: 1103, name: 'Katee Sackhoff', character: 'Bo-Katan Kryze', profilePath: 'https://image.tmdb.org/t/p/w185/ks.jpg' }
    ],
    crew: [
      { id: 2101, name: 'Jon Favreau', job: 'Director', department: 'Directing' },
      { id: 2102, name: 'Dave Filoni', job: 'Producer', department: 'Production' },
      { id: 2103, name: 'Ludwig Göransson', job: 'Original Music Composer', department: 'Sound' }
    ],
    keywords: ['star wars', 'mandalorian', 'grogu', 'baby yoda', 'lucasfilm', 'sci-fi']
  },
  {
    id: 'mov-up-5',
    tmdbId: 447365,
    title: 'Dune: Messiah',
    originalTitle: 'Dune: Part Three - Messiah',
    tagline: 'The holy war cannot be stopped.',
    overview: 'Paul Atreides rules as Emperor of the Known Universe, wrestling with the apocalyptic religious jihad waged in his name across thousands of worlds and the rising conspiracy against his golden throne.',
    poster: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0x2.jpg',
    releaseDate: '2026-12-18',
    releaseYear: 2026,
    runtime: 175,
    genres: ['Science Fiction', 'Adventure', 'Drama'],
    rating: 9.4,
    voteCount: 3600,
    popularity: 99.9,
    certification: 'PG-13',
    trailerKey: 'Way9Dexny3w',
    director: 'Denis Villeneuve',
    upcoming: true,
    featured: true,
    cast: [
      { id: 1111, name: 'Timothée Chalamet', character: 'Paul Atreides / Muad\'Dib', profilePath: 'https://image.tmdb.org/t/p/w185/tc.jpg' },
      { id: 1112, name: 'Zendaya', character: 'Chani', profilePath: 'https://image.tmdb.org/t/p/w185/zd.jpg' },
      { id: 1113, name: 'Florence Pugh', character: 'Princess Irulan', profilePath: 'https://image.tmdb.org/t/p/w185/fp.jpg' },
      { id: 1114, name: 'Anya Taylor-Joy', character: 'Alia Atreides', profilePath: 'https://image.tmdb.org/t/p/w185/at.jpg' }
    ],
    crew: [
      { id: 2111, name: 'Denis Villeneuve', job: 'Director', department: 'Directing' },
      { id: 2112, name: 'Hans Zimmer', job: 'Original Music Composer', department: 'Sound' }
    ],
    keywords: ['arrakis', 'dune', 'messiah', 'spice', 'denis villeneuve', 'hans zimmer']
  },
  {
    id: 'mov-up-6',
    tmdbId: 1084242,
    title: 'Shrek 5',
    originalTitle: 'Shrek 5',
    tagline: 'Far Far Away is back.',
    overview: 'The beloved ogre Shrek, Donkey, and Princess Fiona return for a chaotic new family adventure deep in the magical realms of Far Far Away.',
    poster: 'https://image.tmdb.org/t/p/w500/shrek5_poster.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/ilRyazdMJwN05exqhwK4tMKBYZs.jpg',
    releaseDate: '2026-12-23',
    releaseYear: 2026,
    runtime: 105,
    genres: ['Animation', 'Comedy', 'Family', 'Fantasy'],
    rating: 8.9,
    voteCount: 1800,
    popularity: 97.8,
    certification: 'PG',
    trailerKey: 'cqGjhVJWtEg',
    director: 'Walt Dohrn, Brad Ableson',
    upcoming: true,
    cast: [
      { id: 1121, name: 'Mike Myers', character: 'Shrek', profilePath: 'https://image.tmdb.org/t/p/w185/mm.jpg' },
      { id: 1122, name: 'Eddie Murphy', character: 'Donkey', profilePath: 'https://image.tmdb.org/t/p/w185/em.jpg' },
      { id: 1123, name: 'Cameron Diaz', character: 'Princess Fiona', profilePath: 'https://image.tmdb.org/t/p/w185/cd.jpg' }
    ],
    crew: [
      { id: 2121, name: 'Walt Dohrn', job: 'Director', department: 'Directing' }
    ],
    keywords: ['shrek', 'ogre', 'donkey', 'far far away', 'dreamworks', 'animation']
  },
  {
    id: 'mov-up-7',
    tmdbId: 1003598,
    title: 'Avengers: Secret Wars',
    originalTitle: 'Avengers: Secret Wars',
    tagline: 'The ultimate collision of all realities.',
    overview: 'The culmination of the Multiverse Saga brings heroes and variants from across infinite timelines into a final cataclysmic battle on Battleworld.',
    poster: 'https://image.tmdb.org/t/p/w500/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    releaseDate: '2027-05-07',
    releaseYear: 2027,
    runtime: 180,
    genres: ['Action', 'Science Fiction', 'Adventure'],
    rating: 9.5,
    voteCount: 4200,
    popularity: 99.9,
    certification: 'PG-13',
    trailerKey: 'hA6hldpST08',
    director: 'Anthony Russo, Joe Russo',
    upcoming: true,
    featured: true,
    cast: [
      { id: 1021, name: 'Robert Downey Jr.', character: 'Victor von Doom / Doctor Doom', profilePath: 'https://image.tmdb.org/t/p/w185/5q.jpg' },
      { id: 1024, name: 'Tom Holland', character: 'Peter Parker / Spider-Man', profilePath: 'https://image.tmdb.org/t/p/w185/th.jpg' },
      { id: 1022, name: 'Pedro Pascal', character: 'Reed Richards / Mr. Fantastic', profilePath: 'https://image.tmdb.org/t/p/w185/pp.jpg' },
      { id: 1141, name: 'Hugh Jackman', character: 'Logan / Wolverine', profilePath: 'https://image.tmdb.org/t/p/w185/hj.jpg' },
      { id: 1142, name: 'Ryan Reynolds', character: 'Wade Wilson / Deadpool', profilePath: 'https://image.tmdb.org/t/p/w185/rr.jpg' }
    ],
    crew: [
      { id: 2021, name: 'Anthony Russo', job: 'Director', department: 'Directing' },
      { id: 2022, name: 'Joe Russo', job: 'Director', department: 'Directing' },
      { id: 2023, name: 'Alan Silvestri', job: 'Original Music Composer', department: 'Sound' }
    ],
    keywords: ['secret wars', 'battleworld', 'multiverse saga', 'marvel', 'avengers', 'russo brothers']
  },
  {
    id: 'mov-up-8',
    tmdbId: 823464,
    title: 'Star Wars: Starfighter / New Jedi Order',
    originalTitle: 'Star Wars: New Jedi Order',
    tagline: 'The galaxy seeks a new light.',
    overview: 'Rey Skywalker attempts to build a new Jedi Academy fifteen years after the events of The Rise of Skywalker, navigating rising galactic factions and mysterious new threats in the unknown regions.',
    poster: 'https://image.tmdb.org/t/p/w500/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    releaseDate: '2027-12-17',
    releaseYear: 2027,
    runtime: 142,
    genres: ['Science Fiction', 'Action', 'Adventure'],
    rating: 9.0,
    voteCount: 2100,
    popularity: 98.4,
    certification: 'PG-13',
    trailerKey: 'aOC8E5z_ifw',
    director: 'Sharmeen Obaid-Chinoy',
    upcoming: true,
    featured: true,
    cast: [
      { id: 1151, name: 'Daisy Ridley', character: 'Rey Skywalker', profilePath: 'https://image.tmdb.org/t/p/w185/dr.jpg' }
    ],
    crew: [
      { id: 2151, name: 'Sharmeen Obaid-Chinoy', job: 'Director', department: 'Directing' },
      { id: 2152, name: 'Steven Knight', job: 'Screenplay', department: 'Writing' }
    ],
    keywords: ['star wars', 'jedi', 'rey', 'force', 'lucasfilm', 'galaxy']
  },
  {
    id: 'mov-up-9',
    tmdbId: 1022789,
    title: 'Toy Story 5',
    originalTitle: 'Toy Story 5',
    tagline: 'Toy meets Tech.',
    overview: 'Woody, Buzz Lightyear, Jessie and the gang face their greatest contemporary challenge yet when electronics and screens disrupt the special bond between children and their physical toys.',
    poster: 'https://image.tmdb.org/t/p/w500/toystory5_poster.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    releaseDate: '2026-11-27',
    releaseYear: 2026,
    runtime: 100,
    genres: ['Animation', 'Family', 'Adventure', 'Comedy'],
    rating: 8.8,
    voteCount: 1600,
    popularity: 96.9,
    certification: 'G',
    trailerKey: 'cqGjhVJWtEg',
    director: 'Andrew Stanton',
    upcoming: true,
    cast: [
      { id: 1131, name: 'Tom Hanks', character: 'Woody', profilePath: 'https://image.tmdb.org/t/p/w185/th.jpg' },
      { id: 1132, name: 'Tim Allen', character: 'Buzz Lightyear', profilePath: 'https://image.tmdb.org/t/p/w185/ta.jpg' },
      { id: 1133, name: 'Joan Cusack', character: 'Jessie', profilePath: 'https://image.tmdb.org/t/p/w185/jc.jpg' }
    ],
    crew: [
      { id: 2131, name: 'Andrew Stanton', job: 'Director', department: 'Directing' },
      { id: 2132, name: 'Randy Newman', job: 'Original Music Composer', department: 'Sound' }
    ],
    keywords: ['pixar', 'woody', 'buzz lightyear', 'toy story', 'animation']
  },
  {
    id: 'mov-up-10',
    tmdbId: 1226578,
    title: 'Scream 7',
    originalTitle: 'Scream 7',
    tagline: 'Every legend has a final chapter.',
    overview: 'Sidney Prescott faces the return of Ghostface in a high-stakes battle to protect her family from a lethal copycat killer obsessed with the legacy of Woodsboro.',
    poster: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/9r1y1E09Tq8U2Y1a8c9qF04a3eF.jpg',
    releaseDate: '2027-02-26',
    releaseYear: 2027,
    runtime: 118,
    genres: ['Horror', 'Mystery', 'Thriller'],
    rating: 8.7,
    voteCount: 1300,
    popularity: 96.0,
    certification: 'R',
    trailerKey: 'cqGjhVJWtEg',
    director: 'Kevin Williamson',
    upcoming: true,
    cast: [
      { id: 1141, name: 'Neve Campbell', character: 'Sidney Prescott', profilePath: 'https://image.tmdb.org/t/p/w185/nc.jpg' },
      { id: 1142, name: 'Courteney Cox', character: 'Gale Weathers', profilePath: 'https://image.tmdb.org/t/p/w185/cc.jpg' },
      { id: 1143, name: 'Patrick Dempsey', character: 'Mark Kincaid', profilePath: 'https://image.tmdb.org/t/p/w185/pd.jpg' }
    ],
    crew: [
      { id: 2141, name: 'Kevin Williamson', job: 'Director', department: 'Directing' }
    ],
    keywords: ['ghostface', 'slasher', 'woodsboro', 'scream', 'horror']
  }
];

export const TMDB_REVERSE_GENRE_MAP: Record<string, number> = Object.entries(TMDB_GENRE_MAP).reduce((acc, [id, name]) => {
  acc[name.toLowerCase()] = Number(id);
  return acc;
}, {} as Record<string, number>);

// Helper to make authenticated requests to TMDB v3/v4 API
async function fetchFromTmdbApi(endpoint: string, queryParams: Record<string, string | number | undefined> = {}): Promise<any | null> {
  const apiKey = process.env.TMDB_API_KEY || process.env.TMDB_READ_ACCESS_TOKEN;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }

  try {
    const isBearer = apiKey.length > 50;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    let url = `https://api.themoviedb.org/3${cleanEndpoint}`;
    const params = new URLSearchParams();

    if (isBearer) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    } else {
      params.append('api_key', apiKey);
    }

    for (const [k, v] of Object.entries(queryParams)) {
      if (v !== undefined && v !== null && String(v).trim() !== '') {
        params.append(k, String(v));
      }
    }

    const queryString = params.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const res = await fetch(url, { headers, signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`TMDB API request failed for ${endpoint}: HTTP ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (err: any) {
    console.warn(`TMDB API fetch error on ${endpoint}:`, err.message);
    return null;
  }
}

// Convert raw TMDB movie payload into our strongly typed Movie model
export function transformTmdbItemToMovie(item: any, customProps: Partial<Movie> = {}): Movie {
  const releaseYear = item.release_date ? parseInt(item.release_date.split('-')[0], 10) : 2025;
  
  let genres: string[] = [];
  if (Array.isArray(item.genres) && item.genres.length > 0) {
    genres = item.genres.map((g: any) => g.name || TMDB_GENRE_MAP[g.id] || g).filter(Boolean);
  } else if (Array.isArray(item.genre_ids)) {
    genres = item.genre_ids.map((id: number) => TMDB_GENRE_MAP[id]).filter(Boolean);
  }
  if (genres.length === 0) {
    genres = ['Drama', 'Cinema'];
  }

  // Extract director, cast and crew if credits exist
  let director = customProps.director || undefined;
  const cast: CastMember[] = [];
  const crew: CrewMember[] = [];

  if (item.credits) {
    if (Array.isArray(item.credits.cast)) {
      item.credits.cast.slice(0, 10).forEach((c: any) => {
        cast.push({
          id: c.id,
          name: c.name,
          character: c.character || 'Cast',
          profilePath: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : undefined
        });
      });
    }

    if (Array.isArray(item.credits.crew)) {
      item.credits.crew.forEach((cr: any) => {
        if (cr.job === 'Director' && !director) {
          director = cr.name;
        }
        if (['Director', 'Screenplay', 'Writer', 'Producer', 'Original Music Composer', 'Director of Photography'].includes(cr.job)) {
          if (crew.length < 8) {
            crew.push({
              id: cr.id,
              name: cr.name,
              job: cr.job,
              department: cr.department
            });
          }
        }
      });
    }
  }

  // Extract trailer video key
  let trailerKey: string | undefined = undefined;
  if (item.videos && Array.isArray(item.videos.results)) {
    const trailer = item.videos.results.find((v: any) => 
      v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
    ) || item.videos.results.find((v: any) => v.site === 'YouTube');
    if (trailer) {
      trailerKey = trailer.key;
    }
  }

  // Extract certification (US rating)
  let certification: string | undefined = 'PG-13';
  if (item.release_dates && Array.isArray(item.release_dates.results)) {
    const usRelease = item.release_dates.results.find((r: any) => r.iso_3166_1 === 'US');
    if (usRelease && Array.isArray(usRelease.release_dates)) {
      const cert = usRelease.release_dates.find((rd: any) => rd.certification)?.certification;
      if (cert) certification = cert;
    }
  }

  // Extract keywords
  let keywords: string[] = [];
  if (item.keywords) {
    const kwList = Array.isArray(item.keywords.keywords) ? item.keywords.keywords : (Array.isArray(item.keywords.results) ? item.keywords.results : []);
    keywords = kwList.map((k: any) => k.name).slice(0, 8);
  }

  const poster = item.poster_path 
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}` 
    : (customProps.poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80');

  const backdrop = item.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` 
    : (item.poster_path ? `https://image.tmdb.org/t/p/original${item.poster_path}` : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop&q=80');

  return {
    id: `mov-tmdb-${item.id}`,
    tmdbId: Number(item.id),
    title: item.title || item.original_title || 'Untitled Feature',
    originalTitle: item.original_title,
    tagline: item.tagline || (genres[0] ? `${genres[0]} cinematic experience` : 'Featured Film'),
    overview: item.overview || 'Synopsis arriving soon. Check back for full plot overview and theatrical schedule.',
    poster,
    backdrop,
    releaseDate: item.release_date || `${releaseYear}-01-01`,
    releaseYear,
    runtime: item.runtime || 120,
    genres,
    rating: Number(item.vote_average ? Number(item.vote_average).toFixed(1) : '8.0'),
    voteCount: item.vote_count || 100,
    popularity: Number(item.popularity ? Number(item.popularity).toFixed(1) : '85.0'),
    certification,
    trailerKey,
    director,
    cast,
    crew,
    keywords,
    budget: item.budget,
    revenue: item.revenue,
    status: item.status,
    ...customProps
  };
}

// 1. TMDB Upcoming Releases Angle
export async function fetchTmdbUpcomingReleases(): Promise<{ movies: Movie[]; source: 'tmdb_live' | 'curated_tmdb_cache' }> {
  const todayStr = new Date().toISOString().split('T')[0];
  
  let rawResults: any[] = [];
  const upcomingData = await fetchFromTmdbApi('/movie/upcoming', { page: 1, language: 'en-US' });
  if (upcomingData && Array.isArray(upcomingData.results)) {
    rawResults.push(...upcomingData.results);
  }

  // Also query discover endpoint with primary_release_date.gte to get rich upcoming theatrical pipeline
  const discoverData = await fetchFromTmdbApi('/discover/movie', {
    'primary_release_date.gte': todayStr,
    'sort_by': 'popularity.desc',
    page: 1,
    language: 'en-US'
  });
  if (discoverData && Array.isArray(discoverData.results)) {
    rawResults.push(...discoverData.results);
  }

  const liveMovies: Movie[] = rawResults
    .filter((item: any) => item.poster_path && item.release_date && item.release_date >= todayStr)
    .map((item: any) => transformTmdbItemToMovie(item, { upcoming: true }));

  // Strict future release curated list
  const futureCurated = CURATED_UPCOMING_RELEASES.filter(m => !m.releaseDate || m.releaseDate >= todayStr);

  // Merge live TMDB data with rich curated upcoming list
  const existingTmdbIds = new Set(liveMovies.map(m => m.tmdbId).filter(Boolean));
  const combined = [
    ...liveMovies,
    ...futureCurated.filter(m => !existingTmdbIds.has(m.tmdbId))
  ];

  const seen = new Set<string>();
  const deduplicated: Movie[] = [];
  for (const m of combined) {
    const key = String(m.tmdbId || m.id || m.title);
    if (!seen.has(key) && (!m.releaseDate || m.releaseDate >= todayStr)) {
      seen.add(key);
      deduplicated.push(m);
    }
  }

  deduplicated.sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());

  return {
    movies: deduplicated.length > 0 ? deduplicated : futureCurated,
    source: liveMovies.length > 0 ? 'tmdb_live' : 'curated_tmdb_cache'
  };
}

// 2. TMDB Trending Movies Angle (Day or Week)
export async function fetchTmdbTrending(timeWindow: 'day' | 'week' = 'day', page = 1): Promise<Movie[] | null> {
  const data = await fetchFromTmdbApi(`/trending/movie/${timeWindow}`, { page, language: 'en-US' });
  if (!data || !Array.isArray(data.results)) return null;

  return data.results
    .filter((item: any) => item.poster_path)
    .map((item: any) => transformTmdbItemToMovie(item, { trending: true }));
}

// 3. TMDB Now Playing in Theaters Angle
export async function fetchTmdbNowPlaying(page = 1): Promise<Movie[] | null> {
  const data = await fetchFromTmdbApi('/movie/now_playing', { page, language: 'en-US' });
  if (!data || !Array.isArray(data.results)) return null;

  return data.results
    .filter((item: any) => item.poster_path)
    .map((item: any) => transformTmdbItemToMovie(item, { nowPlaying: true }));
}

// 4. TMDB Top Rated Angle
export async function fetchTmdbTopRated(page = 1): Promise<Movie[] | null> {
  const data = await fetchFromTmdbApi('/movie/top_rated', { page, language: 'en-US' });
  if (!data || !Array.isArray(data.results)) return null;

  return data.results
    .filter((item: any) => item.poster_path)
    .map((item: any) => transformTmdbItemToMovie(item, { topRated: true }));
}

// 5. TMDB Popular Movies Angle
export async function fetchTmdbPopular(page = 1): Promise<Movie[] | null> {
  const data = await fetchFromTmdbApi('/movie/popular', { page, language: 'en-US' });
  if (!data || !Array.isArray(data.results)) return null;

  return data.results
    .filter((item: any) => item.poster_path)
    .map((item: any) => transformTmdbItemToMovie(item, { popular: true }));
}

// 6. TMDB Multi-Filter Discover Angle
export async function fetchTmdbDiscover(options: {
  genre?: string;
  year?: string | number;
  minRating?: number;
  sortBy?: string;
  certification?: string;
  page?: number;
}): Promise<{ movies: Movie[]; totalPages: number; totalResults: number } | null> {
  const queryParams: Record<string, string | number | undefined> = {
    page: options.page || 1,
    language: 'en-US',
    include_adult: 'false'
  };

  if (options.genre) {
    const genreId = TMDB_REVERSE_GENRE_MAP[options.genre.toLowerCase()];
    if (genreId) {
      queryParams['with_genres'] = genreId;
    }
  }

  if (options.year) {
    queryParams['primary_release_year'] = options.year;
  }

  if (options.minRating) {
    queryParams['vote_average.gte'] = options.minRating;
    queryParams['vote_count.gte'] = 50;
  }

  if (options.certification) {
    queryParams['certification_country'] = 'US';
    queryParams['certification'] = options.certification;
  }

  // Sort mapping
  if (options.sortBy === 'rating') {
    queryParams['sort_by'] = 'vote_average.desc';
    queryParams['vote_count.gte'] = 100;
  } else if (options.sortBy === 'releaseDate') {
    queryParams['sort_by'] = 'primary_release_date.desc';
  } else if (options.sortBy === 'revenue') {
    queryParams['sort_by'] = 'revenue.desc';
  } else if (options.sortBy === 'title') {
    queryParams['sort_by'] = 'original_title.asc';
  } else {
    queryParams['sort_by'] = 'popularity.desc';
  }

  const data = await fetchFromTmdbApi('/discover/movie', queryParams);
  if (!data || !Array.isArray(data.results)) return null;

  const movies = data.results
    .filter((item: any) => item.poster_path)
    .map((item: any) => transformTmdbItemToMovie(item));

  return {
    movies,
    totalPages: Math.min(data.total_pages || 1, 50),
    totalResults: data.total_results || movies.length
  };
}

// 7. TMDB Search Multi/Movie Angle
export async function fetchTmdbSearch(query: string, page = 1): Promise<Movie[] | null> {
  if (!query || query.trim() === '') return [];
  const data = await fetchFromTmdbApi('/search/movie', {
    query: query.trim(),
    page,
    language: 'en-US',
    include_adult: 'false'
  });
  if (!data || !Array.isArray(data.results)) return null;

  return data.results
    .filter((item: any) => item.poster_path)
    .map((item: any) => transformTmdbItemToMovie(item));
}

// 8. TMDB Deep Details Angle (Credits, Videos, Similar, Keywords, Reviews)
export async function fetchTmdbMovieDetails(tmdbId: number | string): Promise<Movie | null> {
  const data = await fetchFromTmdbApi(`/movie/${tmdbId}`, {
    append_to_response: 'credits,videos,similar,recommendations,release_dates,keywords,reviews',
    language: 'en-US'
  });
  if (!data) return null;

  return transformTmdbItemToMovie(data);
}

// 9. TMDB Person Angle (Cast Filmography & Bio)
export async function fetchTmdbPerson(personId: number): Promise<any | null> {
  return await fetchFromTmdbApi(`/person/${personId}`, {
    append_to_response: 'movie_credits,images',
    language: 'en-US'
  });
}
