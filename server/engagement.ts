import { db } from './db';
import { Movie } from '../src/types';

export interface BattleMatchup {
  id: string;
  category: string;
  title: string;
  movieA: Movie;
  movieB: Movie;
  votesA: number;
  votesB: number;
}

export interface TriviaQuestion {
  id: string;
  type: 'blur_poster' | 'quote' | 'director' | 'cast_detective' | 'runtime_riddle';
  question: string;
  clue?: string;
  targetMovie: Movie;
  options: Array<{ id: string; label: string; isCorrect: boolean; movie?: Movie }>;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// In-memory battle vote tally
const battleVotesMap: Record<string, { votesA: number; votesB: number }> = {};

export function getRouletteMovie(mood?: string, minRating: number = 0): Movie | null {
  const allMovies = db.getAllMovies();
  if (allMovies.length === 0) return null;

  let candidates = allMovies.filter(m => !minRating || (m.rating && m.rating >= minRating));

  if (mood) {
    const m = mood.toLowerCase();
    if (m === 'scifi') {
      candidates = candidates.filter(x => x.genres?.some(g => /sci-fi|science fiction|space|futur/i.test(g)) || /sci-fi/i.test(x.overview));
    } else if (m === 'horror') {
      candidates = candidates.filter(x => x.genres?.some(g => /horror|thriller|mystery/i.test(g)) || /horror/i.test(x.overview));
    } else if (m === 'action') {
      candidates = candidates.filter(x => x.genres?.some(g => /action|adventure/i.test(g)));
    } else if (m === 'drama') {
      candidates = candidates.filter(x => x.genres?.some(g => /drama|crime|biography/i.test(g)));
    } else if (m === 'fast90') {
      candidates = candidates.filter(x => x.runtime && x.runtime <= 105 && x.runtime >= 60);
    } else if (m === 'classic' || m === 'free') {
      candidates = candidates.filter(x => x.publicDomain || (x.releaseYear && x.releaseYear < 1980));
    } else if (m === 'toprated') {
      candidates = candidates.filter(x => x.rating >= 7.8);
    } else if (m === '2026') {
      candidates = candidates.filter(x => x.releaseYear === 2026 || (x.releaseDate && x.releaseDate.includes('2026')));
    }
  }

  if (candidates.length === 0) {
    candidates = allMovies;
  }

  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex];
}

export function getBattleMatchups(): BattleMatchup[] {
  const allMovies = db.getAllMovies();
  if (allMovies.length < 4) return [];

  // Seeded top pairings
  const curatedPairs: Array<{ id: string; category: string; title: string; t1: string; t2: string; baseA: number; baseB: number }> = [
    {
      id: 'battle-scifi-titans',
      category: 'Sci-Fi Colosseum',
      title: 'Which Mind-Bending Odyssey Wins?',
      t1: 'Dune: Part Two',
      t2: 'Interstellar',
      baseA: 1420,
      baseB: 1560
    },
    {
      id: 'battle-noir-horror',
      category: 'Gothic Atmosphere',
      title: 'Ultimate Creature of the Shadows',
      t1: 'Nosferatu',
      t2: 'Night of the Living Dead',
      baseA: 890,
      baseB: 1120
    },
    {
      id: 'battle-superhero-hype',
      category: 'Comic Epic',
      title: 'Multiverse Madness Face-Off',
      t1: 'Spider-Man: Beyond the Spider-Verse',
      t2: 'The Batman',
      baseA: 2150,
      baseB: 1980
    },
    {
      id: 'battle-directors-cut',
      category: 'Auteur Showdown',
      title: 'Christopher Nolan Masterwork',
      t1: 'Oppenheimer',
      t2: 'Inception',
      baseA: 1840,
      baseB: 1920
    },
    {
      id: 'battle-classic-dystopia',
      category: 'Golden Era Vision',
      title: 'Grandest Silent Masterpiece',
      t1: 'Metropolis',
      t2: 'The Cabinet of Dr. Caligari',
      baseA: 670,
      baseB: 540
    }
  ];

  const results: BattleMatchup[] = [];

  curatedPairs.forEach(pair => {
    const movieA = allMovies.find(m => m.title.toLowerCase().includes(pair.t1.toLowerCase())) || allMovies[0];
    const movieB = allMovies.find(m => m.title.toLowerCase().includes(pair.t2.toLowerCase())) || allMovies[1];
    
    if (movieA && movieB && movieA.id !== movieB.id) {
      const votes = battleVotesMap[pair.id] || { votesA: pair.baseA, votesB: pair.baseB };
      results.push({
        id: pair.id,
        category: pair.category,
        title: pair.title,
        movieA,
        movieB,
        votesA: votes.votesA,
        votesB: votes.votesB
      });
    }
  });

  // Also generate 5 dynamic random matchups
  const shuffled = [...allMovies].sort(() => 0.5 - Math.random());
  for (let i = 0; i < Math.min(shuffled.length - 1, 10); i += 2) {
    const mA = shuffled[i];
    const mB = shuffled[i + 1];
    if (mA && mB) {
      const dynId = `dyn-battle-${mA.id}-${mB.id}`;
      const votes = battleVotesMap[dynId] || { 
        votesA: Math.floor(Math.random() * 300) + 120, 
        votesB: Math.floor(Math.random() * 300) + 110 
      };
      battleVotesMap[dynId] = votes;
      results.push({
        id: dynId,
        category: `${mA.genres?.[0] || 'Cinema'} Clash`,
        title: `${mA.title} vs ${mB.title}`,
        movieA: mA,
        movieB: mB,
        votesA: votes.votesA,
        votesB: votes.votesB
      });
    }
  }

  return results;
}

export function voteInBattle(battleId: string, choice: 'A' | 'B'): { votesA: number; votesB: number; totalVotes: number; percentA: number; percentB: number } {
  if (!battleVotesMap[battleId]) {
    battleVotesMap[battleId] = { votesA: 100, votesB: 95 };
  }

  if (choice === 'A') {
    battleVotesMap[battleId].votesA += 1;
  } else {
    battleVotesMap[battleId].votesB += 1;
  }

  const vA = battleVotesMap[battleId].votesA;
  const vB = battleVotesMap[battleId].votesB;
  const total = vA + vB;
  const percentA = Math.round((vA / total) * 100);
  const percentB = 100 - percentA;

  return {
    votesA: vA,
    votesB: vB,
    totalVotes: total,
    percentA,
    percentB
  };
}

export function getTriviaQuestions(count: number = 8): TriviaQuestion[] {
  const allMovies = db.getAllMovies().filter(m => m.overview && m.title && m.poster);
  if (allMovies.length < 4) return [];

  const questions: TriviaQuestion[] = [];
  const shuffled = [...allMovies].sort(() => 0.5 - Math.random());

  shuffled.slice(0, count).forEach((targetMovie, idx) => {
    // Generate other 3 distractors
    const distractors = allMovies
      .filter(m => m.id !== targetMovie.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const qTypes: TriviaQuestion['type'][] = ['blur_poster', 'quote', 'director', 'cast_detective', 'runtime_riddle'];
    const chosenType = qTypes[idx % qTypes.length];

    let questionText = '';
    let clue = '';
    let explanation = '';

    if (chosenType === 'blur_poster') {
      questionText = 'Can you name this film from its iconic visual artwork?';
      clue = `Released in ${targetMovie.releaseYear} • Genre: ${targetMovie.genres?.join(', ') || 'Feature'}`;
      explanation = `${targetMovie.title} (${targetMovie.releaseYear}) directed by ${targetMovie.director || 'esteemed filmmakers'}.`;
    } else if (chosenType === 'quote') {
      const taglineOrPlot = targetMovie.tagline || targetMovie.overview.split('.')[0] + '.';
      questionText = `Which movie features this memorable tagline or premise? "${taglineOrPlot}"`;
      clue = `Starring ${targetMovie.cast?.[0]?.name || 'celebrated talent'}`;
      explanation = `"${targetMovie.title}" captivated audiences with this exact narrative hook!`;
    } else if (chosenType === 'director') {
      questionText = `Who directed the acclaimed motion picture "${targetMovie.title}" (${targetMovie.releaseYear})?`;
      clue = `Rating: ${targetMovie.rating}/10 on TMDB`;
      explanation = `${targetMovie.director || 'The production team'} brought this visual masterpiece to the silver screen.`;
    } else if (chosenType === 'cast_detective') {
      const topCast = (targetMovie.cast || []).slice(0, 3).map(c => c.name).join(', ');
      questionText = `Name the movie featuring this star-studded ensemble: ${topCast || 'Leading Hollywood Cast'}`;
      clue = `Runtime: ${targetMovie.runtime || 120} min`;
      explanation = `${topCast || 'The ensemble'} starred together in the ${targetMovie.releaseYear} release "${targetMovie.title}".`;
    } else {
      questionText = `In what year did the masterpiece "${targetMovie.title}" make its theatrical premiere?`;
      clue = `Directed by ${targetMovie.director || 'legendary creators'}`;
      explanation = `"${targetMovie.title}" premiered in ${targetMovie.releaseYear}.`;
    }

    const allChoices = [targetMovie, ...distractors].sort(() => 0.5 - Math.random());
    const options = allChoices.map(m => {
      let label = m.title;
      if (chosenType === 'director') {
        label = m.director || m.title;
      } else if (chosenType === 'runtime_riddle') {
        label = `${m.releaseYear}`;
      }
      return {
        id: m.id,
        label,
        isCorrect: m.id === targetMovie.id,
        movie: m
      };
    });

    questions.push({
      id: `trivia-q-${targetMovie.id}-${idx}`,
      type: chosenType,
      question: questionText,
      clue,
      targetMovie,
      options,
      explanation,
      difficulty: idx % 3 === 0 ? 'easy' : idx % 3 === 1 ? 'medium' : 'hard'
    });
  });

  return questions;
}

export function getDoubleFeaturePairing(movieId: string): { primary: Movie; recommended: Movie[]; theme: string } | null {
  const allMovies = db.getAllMovies();
  const primary = db.getMovieById(movieId);
  if (!primary) return null;

  // Find complementary movies: same genre or matching decade / director
  const matches = allMovies.filter(m => {
    if (m.id === primary.id) return false;
    const shareGenre = m.genres?.some(g => primary.genres?.includes(g));
    const shareDirector = m.director && primary.director && m.director === primary.director;
    return shareGenre || shareDirector;
  }).slice(0, 4);

  return {
    primary,
    recommended: matches.length > 0 ? matches : allMovies.slice(0, 3),
    theme: `${primary.genres?.[0] || 'Cinema'} Double-Feature Marathon`
  };
}
