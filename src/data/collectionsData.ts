import { CollectionHub } from '../types';

export const CURATED_COLLECTIONS: CollectionHub[] = [
  // --- DIRECTORS ---
  {
    id: 'hub-christopher-nolan',
    slug: 'christopher-nolan',
    title: 'Christopher Nolan: Architectural Cinema & IMAX Epics',
    type: 'director',
    creatorOrTagline: 'Visionary Director • 70mm Film & Practical Spectacle',
    description: 'Explore the complete filmography of Christopher Nolan, known for non-linear storytelling, mind-bending physics, and thunderous soundscapes from Oppenheimer to Inception and Interstellar.',
    backdrop: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80',
    poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
    badge: 'Auteur Director',
    movieCount: 12,
    featuredTitles: ['Oppenheimer', 'Inception', 'Interstellar', 'The Dark Knight', 'Tenet', 'Dunkirk'],
    targetQuery: 'Christopher Nolan',
    whereToWatchInfo: {
      freeStreamAvailable: false,
      theatricalStatus: '70mm IMAX & Digital 4K',
      trailerResolution: '4K Ultra HD HDR'
    }
  },
  {
    id: 'hub-denis-villeneuve',
    slug: 'denis-villeneuve',
    title: 'Denis Villeneuve: Sci-Fi Grandeur & Brutalist Worlds',
    type: 'director',
    creatorOrTagline: 'Master of Atmospheric Scale & Sound Design',
    description: 'Immerse yourself in Denis Villeneuve’s sensory cinematic canvases, bridging philosophical depth with staggering visual scale across Dune, Blade Runner 2049, and Arrival.',
    backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1920&q=80',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    badge: 'Auteur Director',
    movieCount: 9,
    featuredTitles: ['Dune: Part Two', 'Dune', 'Blade Runner 2049', 'Arrival', 'Sicario'],
    targetQuery: 'Denis Villeneuve',
    whereToWatchInfo: {
      freeStreamAvailable: false,
      theatricalStatus: 'IMAX 1.43:1 & Premium Formats',
      trailerResolution: '4K Ultra HD'
    }
  },
  {
    id: 'hub-quentin-tarantino',
    slug: 'quentin-tarantino',
    title: 'Quentin Tarantino: Dialogue, Grit & Cinematic Pop-Art',
    type: 'director',
    creatorOrTagline: 'Cinephile Storyteller • 10-Film Anthology',
    description: 'Relive the stylized needle-drops, sharp monologues, and kinetic violence of Quentin Tarantino’s iconic filmography spanning Pulp Fiction to Once Upon a Time in Hollywood.',
    backdrop: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=1920&q=80',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    badge: 'Auteur Director',
    movieCount: 10,
    featuredTitles: ['Pulp Fiction', 'Django Unchained', 'Inglourious Basterds', 'Kill Bill', 'Reservoir Dogs'],
    targetQuery: 'Quentin Tarantino',
    whereToWatchInfo: {
      freeStreamAvailable: false,
      theatricalStatus: '35mm Panavision & Home Video Remasters',
      trailerResolution: '1080p & 4K'
    }
  },
  {
    id: 'hub-hayao-miyazaki',
    slug: 'hayao-miyazaki-studio-ghibli',
    title: 'Hayao Miyazaki & Studio Ghibli: Hand-Drawn Magic',
    type: 'director',
    creatorOrTagline: 'Master Animator • Nature, Flight & Human Spirit',
    description: 'Journey through the legendary hand-drawn worlds of Hayao Miyazaki, from Oscar winners Spirited Away and The Boy and the Heron to Princess Mononoke and My Neighbor Totoro.',
    backdrop: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1920&q=80',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    badge: 'Animation Legend',
    movieCount: 12,
    featuredTitles: ['The Boy and the Heron', 'Spirited Away', 'Princess Mononoke', "Howl's Moving Castle"],
    targetQuery: 'Miyazaki',
    whereToWatchInfo: {
      freeStreamAvailable: false,
      theatricalStatus: 'Studio Ghibli Fest & Global Streaming',
      trailerResolution: 'Full HD'
    }
  },

  // --- FRANCHISES & SAGAS ---
  {
    id: 'hub-dune-saga',
    slug: 'dune-universe',
    title: 'The Dune Universe: Frank Herbert’s Spice & Prophecy',
    type: 'franchise',
    creatorOrTagline: 'The Litany Against Fear • House Atreides Chronicles',
    description: 'Experience the desert planet Arrakis, political intrigue, sandworms, and the rise of Paul Muad’Dib across Denis Villeneuve’s monumental cinematic chapters and upcoming spin-offs.',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80',
    poster: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80',
    badge: 'Sci-Fi Epic',
    movieCount: 3,
    featuredTitles: ['Dune: Part Two', 'Dune', 'Dune: Messiah'],
    targetQuery: 'Dune',
    whereToWatchInfo: {
      freeStreamAvailable: false,
      theatricalStatus: 'Theaters Worldwide & Digital VOD',
      trailerResolution: '4K Dolby Vision'
    }
  },
  {
    id: 'hub-batman-legacy',
    slug: 'batman-gotham-legacy',
    title: 'Batman & The Dark Knight Legacy',
    type: 'franchise',
    creatorOrTagline: 'The Caped Crusader • Shadows of Gotham City',
    description: 'Trace the evolving cinematic interpretations of Gotham’s protector, from Christopher Nolan’s Dark Knight trilogy to Matt Reeves’ neo-noir The Batman and Tim Burton classics.',
    backdrop: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=1920&q=80',
    poster: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80',
    badge: 'Superhero Universe',
    movieCount: 8,
    featuredTitles: ['The Dark Knight', 'The Batman', 'The Dark Knight Rises', 'Batman Begins'],
    targetQuery: 'Batman',
    whereToWatchInfo: {
      freeStreamAvailable: false,
      theatricalStatus: 'Digital VOD & IMAX Revivals',
      trailerResolution: '4K Ultra HD'
    }
  },
  {
    id: 'hub-classic-monsters',
    slug: 'classic-gothic-monsters',
    title: 'Universal Gothic Monsters & Early Horror Sagas',
    type: 'franchise',
    creatorOrTagline: '100% Free Public Domain Streams • Dracula, Frankenstein & Beyond',
    description: 'The roots of cinematic terror: Bela Lugosi’s Dracula, Boris Karloff’s Frankenstein, Nosferatu, and Night of the Living Dead. Stream in their entirety legally and free on Jamal Movies.',
    backdrop: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=1920&q=80',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    badge: '100% Free Stream',
    movieCount: 16,
    featuredTitles: ['Nosferatu', 'Night of the Living Dead', 'House on Haunted Hill', 'The Cabinet of Dr. Caligari'],
    targetGenre: 'Horror',
    whereToWatchInfo: {
      freeStreamAvailable: true,
      theatricalStatus: 'Jamal Free Public Domain Player',
      trailerResolution: 'HD Archive Restorations'
    }
  },

  // --- WHERE TO WATCH HUBS ---
  {
    id: 'hub-where-free-cinema',
    slug: 'free-public-domain-movies',
    title: 'Where to Watch Free Movies: The Public Domain Vault',
    type: 'where-to-watch',
    creatorOrTagline: 'No Paywall • No Subscriptions • Zero Copyright Restraints',
    description: 'A curated index of cinema masterpieces in the public domain. Enjoy instant in-browser playback with custom playback speeds, theatre mode, and zero commercial interruptions.',
    backdrop: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1920&q=80',
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80',
    badge: 'Free Streaming Hub',
    movieCount: 24,
    featuredTitles: ['Charade', 'His Girl Friday', 'Night of the Living Dead', 'Nosferatu', 'M (Fritz Lang)'],
    targetGenre: 'Public Domain',
    whereToWatchInfo: {
      freeStreamAvailable: true,
      theatricalStatus: 'Instant Legal Web Player',
      trailerResolution: 'Full HD 1080p'
    }
  },
  {
    id: 'hub-where-2026-blockbusters',
    slug: 'where-to-watch-2026-premieres',
    title: 'Where to Watch 2026 Movie Releases & Theatrical Premieres',
    type: 'where-to-watch',
    creatorOrTagline: 'IMAX Countdown • Official 4K Previews • Global Premiere Dates',
    description: 'Find theatrical release schedules, premiere countdowns, official studio teaser trailers, and digital release windows for the most anticipated 2026 Hollywood spectacles.',
    backdrop: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1920&q=80',
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    badge: '2026 Theatrical Calendar',
    movieCount: 30,
    featuredTitles: ['Avatar: Fire and Ash', 'Avengers: Doomsday', 'The Batman: Part II', 'Spider-Man 4'],
    targetQuery: '2026',
    whereToWatchInfo: {
      freeStreamAvailable: false,
      theatricalStatus: 'Cinemas & IMAX Worldwide',
      trailerResolution: 'Official 4K YouTube Player'
    }
  }
];
