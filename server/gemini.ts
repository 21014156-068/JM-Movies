import { GoogleGenAI, Type, GenerateContentParameters, GenerateContentResponse } from '@google/genai';
import { Movie, AiRecommendationRequest, AiRecommendationResult } from '../src/types';
import { db } from './db';

// Lazy initialization of GoogleGenAI client
let aiClient: GoogleGenAI | null = null;

function getAi(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// Models cascade for high-availability & zero-downtime resilience
const FALLBACK_MODELS = [
  'gemini-3.7-flash',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite'
];

/**
 * Execute a Gemini generateContent call with automatic model cascading
 * and exponential backoff retry for transient 503 (High Demand) & 429 errors.
 */
async function callGeminiWithResilience(
  ai: GoogleGenAI,
  params: Omit<GenerateContentParameters, 'model'>
): Promise<GenerateContentResponse | null> {
  for (const model of FALLBACK_MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          ...params,
          model
        });
        return response;
      } catch (err: any) {
        const errorMessage = String(err?.message || err || '');
        const isTransient = 
          errorMessage.includes('503') || 
          errorMessage.includes('429') || 
          errorMessage.includes('UNAVAILABLE') || 
          errorMessage.includes('high demand') ||
          errorMessage.includes('overloaded') ||
          errorMessage.includes('resource exhausted');

        console.warn(`[Gemini API] Model ${model} attempt ${attempt} encountered:`, errorMessage.slice(0, 150));

        if (isTransient && attempt === 1) {
          // Brief exponential jittered backoff before second attempt
          await new Promise(res => setTimeout(res, 400 + Math.random() * 200));
          continue;
        }

        // If it failed second attempt or isn't a retryable error on this model, fall through to next model
        break;
      }
    }
  }

  return null;
}

export async function generateMovieRecommendations(
  req: AiRecommendationRequest
): Promise<AiRecommendationResult> {
  const allMovies = db.getMovies({ limit: 100 }).data;
  const catalogSummary = allMovies.map(m => ({
    id: m.id,
    title: m.title,
    genres: m.genres,
    year: m.releaseYear,
    rating: m.rating,
    director: m.director,
    overview: m.overview.slice(0, 140),
    publicDomain: m.publicDomain
  }));

  const ai = getAi();

  // If Gemini API client is available, attempt AI curation with model cascade
  if (ai) {
    try {
      const prompt = `You are the lead Cinephile Curator for "Jamal Movies Studio", an elite cinema and movie discovery platform.
Analyze our available movie catalog and recommend the best matching titles for this user's taste and mood.

User Request / Mood / Prompt: "${req.prompt || req.mood || 'Surprise me with high quality cinema'}"
User Preferred Genres: ${req.preferredGenres?.join(', ') || 'Any'}
User Favorite Titles: ${req.favoriteMovieTitles?.join(', ') || 'Not specified'}
Target Era: ${req.targetYearRange || 'Any'}

Available Catalog:
${JSON.stringify(catalogSummary, null, 2)}

Select 3 to 6 best matching movie IDs from the available catalog that best satisfy the user's vibe/request. Provide an engaging curatorial rationale and mood theme.`;

      const response = await callGeminiWithResilience(ai, {
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              curatedTheme: {
                type: Type.STRING,
                description: 'A catchy, stylish curatorial theme title (e.g. "Atmospheric Mind-Bending Odyssey" or "Golden Age Masterpieces")'
              },
              rationale: {
                type: Type.STRING,
                description: 'A sophisticated 2-3 sentence explanation of why these films match the user request'
              },
              recommendedMovieIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Array of exact movie IDs selected from the catalog'
              },
              suggestedTags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '3-5 descriptive keyword tags for this movie vibe'
              }
            },
            required: ['curatedTheme', 'rationale', 'recommendedMovieIds', 'suggestedTags']
          }
        }
      });

      if (response && response.text) {
        let jsonStr = response.text.trim();
        // Remove potential markdown code fences
        if (jsonStr.startsWith('```json')) {
          jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (jsonStr.startsWith('```')) {
          jsonStr = jsonStr.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        const parsed = JSON.parse(jsonStr);
        if (parsed && Array.isArray(parsed.recommendedMovieIds)) {
          const matchedMovies = parsed.recommendedMovieIds
            .map((id: string) => allMovies.find(m => m.id === id))
            .filter(Boolean) as Movie[];

          if (matchedMovies.length > 0) {
            return {
              curatedTheme: parsed.curatedTheme || 'Curator Selection',
              rationale: parsed.rationale || `Handpicked ${matchedMovies.length} cinematic masterworks matching your inquiry.`,
              recommendedMovies: matchedMovies,
              suggestedTags: parsed.suggestedTags || ['Cinema', 'Discovery', 'Featured']
            };
          }
        }
      }
    } catch (err: any) {
      console.warn('[Gemini Recommendations] Falling back to high-fidelity rule matching engine:', err?.message || err);
    }
  }

  // High-Fidelity Rule-based Recommendation Engine (Immediate zero-latency fallback)
  let filtered = [...allMovies];

  if (req.preferredGenres && req.preferredGenres.length > 0) {
    const genreMatched = filtered.filter(m => m.genres.some(g => req.preferredGenres!.includes(g)));
    if (genreMatched.length > 0) {
      filtered = genreMatched;
    }
  }

  if (req.prompt) {
    const p = req.prompt.toLowerCase();
    if (p.includes('sci-fi') || p.includes('space') || p.includes('future') || p.includes('mind') || p.includes('cosmos')) {
      const match = allMovies.filter(m => m.genres.includes('Science Fiction'));
      if (match.length > 0) filtered = match;
    } else if (p.includes('scary') || p.includes('horror') || p.includes('spooky') || p.includes('dead') || p.includes('thriller')) {
      const match = allMovies.filter(m => m.genres.includes('Horror') || m.genres.includes('Thriller'));
      if (match.length > 0) filtered = match;
    } else if (p.includes('action') || p.includes('fight') || p.includes('hero') || p.includes('explosive')) {
      const match = allMovies.filter(m => m.genres.includes('Action') || m.genres.includes('Adventure'));
      if (match.length > 0) filtered = match;
    } else if (p.includes('laugh') || p.includes('comedy') || p.includes('funny') || p.includes('humor')) {
      const match = allMovies.filter(m => m.genres.includes('Comedy'));
      if (match.length > 0) filtered = match;
    } else if (p.includes('classic') || p.includes('old') || p.includes('vintage') || p.includes('public domain') || p.includes('noir')) {
      const match = allMovies.filter(m => m.publicDomain || m.releaseYear < 1990);
      if (match.length > 0) filtered = match;
    } else if (p.includes('drama') || p.includes('emotional') || p.includes('deep') || p.includes('story')) {
      const match = allMovies.filter(m => m.genres.includes('Drama'));
      if (match.length > 0) filtered = match;
    }
  }

  if (filtered.length === 0) {
    filtered = allMovies.slice(0, 6);
  }

  // Sort by rating and pick top candidates
  filtered.sort((a, b) => b.rating - a.rating);
  const selected = filtered.slice(0, 5);

  const themeTitle = req.mood 
    ? `Curated Vibe: ${req.mood.charAt(0).toUpperCase() + req.mood.slice(1)}`
    : (req.prompt ? `Matched Theme: ${req.prompt.slice(0, 30)}...` : 'Curated Studio Highlights');

  const genresList = req.preferredGenres && req.preferredGenres.length > 0 
    ? req.preferredGenres.join(', ') 
    : 'acclaimed cinema';

  return {
    curatedTheme: themeTitle,
    rationale: `Selected ${selected.length} critically acclaimed titles tailored to your interest in ${genresList} with top-tier cinematography, pacing, and storytelling.`,
    recommendedMovies: selected,
    suggestedTags: Array.from(new Set(selected.flatMap(m => m.genres))).slice(0, 5)
  };
}

export async function askCineBotAssistant(
  message: string, 
  history: { role: string; content: string }[] = []
): Promise<string> {
  const ai = getAi();
  const allMovies = db.getMovies({ limit: 60 }).data;
  const movieTitles = allMovies.map(m => `"${m.title}" (${m.releaseYear}, Dir: ${m.director || 'Various'})`).join(', ');

  const systemInstruction = `You are "CineBot", the intelligent cinema advisor and resident film curator for "Jamal Movies Studio".
You are deeply knowledgeable about world cinema, directing techniques, screenplay structures, cinematography, trivia, and legal public domain treasures.
Current Jamal Movies Studio catalog includes titles like: ${movieTitles}.
Keep responses lively, engaging, concise (2-3 structured paragraphs or bullet points), nicely formatted in markdown with bold film titles, and guide users to great films or cinema history.`;

  if (ai) {
    try {
      // Build context including recent conversation history if provided
      let formattedContents = `${systemInstruction}\n\n`;
      if (history && history.length > 0) {
        const recentHistory = history.slice(-4);
        formattedContents += `Recent conversation:\n${recentHistory.map(h => `${h.role === 'user' ? 'User' : 'CineBot'}: ${h.content}`).join('\n')}\n\n`;
      }
      formattedContents += `User: ${message}\nCineBot:`;

      const response = await callGeminiWithResilience(ai, {
        contents: formattedContents
      });

      if (response && response.text) {
        return response.text.trim();
      }
    } catch (err: any) {
      console.warn('[CineBot] Error calling model cascade:', err?.message || err);
    }
  }

  // Intelligent Contextual Catalog Fallback
  const lower = message.toLowerCase();
  if (lower.includes('sci-fi') || lower.includes('space') || lower.includes('nolan')) {
    return `🎬 **Top Sci-Fi Recommendation:**\n\nFor a mind-bending cosmic journey, check out **Interstellar (2014)** or **Inception (2010)**. Both feature stellar visual effects and emotional resonance.\n\nLooking for vintage speculative cinema? Explore Fritz Lang's visionary sci-fi epic **Metropolis (1927)** streaming free in our Public Domain Cinema!`;
  }
  if (lower.includes('horror') || lower.includes('spooky') || lower.includes('scary')) {
    return `👻 **Horror Masterworks:**\n\nWe recommend **The Shining (1980)** for psychological tension, and George A. Romero's foundational classic **Night of the Living Dead (1968)**, which you can stream instantly in our legal Public Domain theater!`;
  }
  if (lower.includes('public domain') || lower.includes('free') || lower.includes('classic')) {
    return `🏛️ **Public Domain Cinema:**\n\nJamal Movies Studio hosts full-length legal streams of cinema's greatest historic masterworks! Some essential watches:\n- **Metropolis (1927)** - Fritz Lang's expressionist masterpiece\n- **Night of the Living Dead (1968)** - The film that birthed modern zombie lore\n- **His Girl Friday (1940)** - Rapid-fire screwball comedy starring Cary Grant`;
  }

  return `🎬 **Welcome to Jamal Movies Studio!**\n\nBased on your query, here are some stellar titles from our studio catalog:\n- **Interstellar (2014)** & **Inception (2010)** — For breathtaking science fiction and mind-expanding storytelling.\n- **The Dark Knight (2008)** — For high-stakes cinematic crime action.\n- **Metropolis (1927)** & **Night of the Living Dead (1968)** — Free full-length streaming in our Public Domain Cinema.\n\nFeel free to ask for specific directors, genres, plot tropes, or moods!`;
}
