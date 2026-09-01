import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Film, 
  Compass, 
  Star, 
  Play, 
  Bot, 
  Zap, 
  Bookmark, 
  Check, 
  RefreshCw 
} from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { Movie, AiRecommendationResult } from '../types';

export const AIConciergeModal: React.FC = () => {
  const { 
    isAiConciergeOpen, 
    setAiConciergeOpen, 
    openMovieDetails, 
    isInWatchlist, 
    toggleWatchlist 
  } = useMovies();

  const [mode, setMode] = useState<'vibe' | 'chat'>('vibe');

  // Vibe matcher states
  const [selectedMood, setSelectedMood] = useState<string>('Mind-Bending Sci-Fi');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState<boolean>(false);
  const [recommendationResult, setRecommendationResult] = useState<AiRecommendationResult | null>(null);

  // CineBot chat states
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: "Hello! I'm **CineBot**, your personal cinema curator at Jamal Movies Studio. Ask me anything about movie recommendations, director retrospectives, trivia, or public domain masterpieces!"
    }
  ]);
  const [userChatInput, setUserChatInput] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  const moodPresets = [
    { label: '🌌 Mind-Bending Sci-Fi', mood: 'Mind-Bending Sci-Fi', genres: ['Science Fiction', 'Adventure'] },
    { label: '💥 High-Octane Action Thriller', mood: 'Adrenaline & Heists', genres: ['Action', 'Thriller'] },
    { label: '🏛️ Golden Age Public Domain', mood: 'Public Domain Classics', genres: ['Drama', 'Horror'] },
    { label: '🧠 Dark Psychological Mystery', mood: 'Psychological Tension', genres: ['Drama', 'Thriller', 'Mystery'] },
    { label: '🍿 Modern Blockbuster Spectacle', mood: 'Grand Blockbuster', genres: ['Science Fiction', 'Action'] },
    { label: '🧟 Cult Horror Cinema', mood: 'Atmospheric Horror', genres: ['Horror', 'Thriller'] }
  ];

  if (!isAiConciergeOpen) return null;

  const handleGenerateVibe = async (presetMood?: string) => {
    setIsLoadingRecommendations(true);
    const targetMood = presetMood || selectedMood;
    const foundPreset = moodPresets.find(p => p.mood === targetMood);

    try {
      const res = await fetch('/api/recommendations/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: targetMood,
          prompt: customPrompt.trim() || undefined,
          preferredGenres: foundPreset ? foundPreset.genres : undefined
        })
      });

      if (res.ok) {
        const data: AiRecommendationResult = await res.json();
        setRecommendationResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatInput.trim() || isChatLoading) return;

    const userText = userChatInput.trim();
    const nextHistory = [...chatMessages, { role: 'user' as const, content: userText }];
    setChatMessages(nextHistory);
    setUserChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: chatMessages.slice(-6)
        })
      });

      if (res.ok) {
        const data = await res.json();
        setChatMessages([...nextHistory, { role: 'assistant', content: data.reply }]);
      } else {
        setChatMessages([
          ...nextHistory,
          { role: 'assistant', content: "I'm having a brief connection pause, but I recommend exploring our top-rated Sci-Fi and Public Domain movies!" }
        ]);
      }
    } catch (err) {
      setChatMessages([
        ...nextHistory,
        { role: 'assistant', content: "Unable to reach CineBot server right now. Try again shortly." }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#05060f]/80 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-5xl lg:max-w-6xl bg-[#0a0d1f]/95 border border-white/15 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-200 text-zinc-100">
        
        {/* Header with Frosted Glass */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-white/[0.04] backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25 text-zinc-950">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  CineMind AI Studio Concierge
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-lg font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                  Gemini 3.7
                </span>
              </div>
              <p className="text-xs text-zinc-300">
                Personalized cinema curation & intelligent movie advisor
              </p>
            </div>
          </div>

          <button
            onClick={() => setAiConciergeOpen(false)}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.1] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-white/10 bg-white/[0.02] text-sm font-semibold">
          <button
            onClick={() => setMode('vibe')}
            className={`flex-1 py-3.5 px-4 flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              mode === 'vibe' 
                ? 'text-amber-400 border-amber-400 bg-amber-400/10 font-bold' 
                : 'text-zinc-400 border-transparent hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>AI Vibe Matcher</span>
          </button>

          <button
            onClick={() => setMode('chat')}
            className={`flex-1 py-3.5 px-4 flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
              mode === 'chat' 
                ? 'text-amber-400 border-amber-400 bg-amber-400/10 font-bold' 
                : 'text-zinc-400 border-transparent hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Ask CineBot Assistant</span>
          </button>
        </div>

        {/* MODE 1: AI VIBE MATCHER */}
        {mode === 'vibe' && (
          <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
            
            {/* Mood selector pills */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2.5">
                1. Select Desired Cinematic Mood:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {moodPresets.map(preset => (
                  <button
                    key={preset.mood}
                    onClick={() => {
                      setSelectedMood(preset.mood);
                      handleGenerateVibe(preset.mood);
                    }}
                    className={`p-3.5 rounded-2xl text-xs font-semibold text-left border transition-all backdrop-blur-xl cursor-pointer ${
                      selectedMood === preset.mood
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/15 scale-[1.02]'
                        : 'bg-white/[0.04] border-white/10 text-zinc-300 hover:bg-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom prompt input */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2">
                2. Or Describe What You Feel Like Watching (Optional):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerateVibe()}
                  placeholder="e.g. Something with complex timeline twists like Inception or high suspense horror..."
                  className="flex-1 bg-white/[0.06] border border-white/15 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-amber-400 backdrop-blur-md"
                />
                <button
                  onClick={() => handleGenerateVibe()}
                  disabled={isLoadingRecommendations}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm flex items-center gap-2 shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all active:scale-95 shrink-0 cursor-pointer"
                >
                  {isLoadingRecommendations ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>Generate</span>
                </button>
              </div>
            </div>

            {/* Results Section */}
            {isLoadingRecommendations ? (
              <div className="py-12 text-center space-y-3 bg-white/[0.04] rounded-3xl border border-white/10 backdrop-blur-xl">
                <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                <div className="text-sm font-semibold text-white">Analyzing Cinema Catalog with Gemini AI...</div>
                <p className="text-xs text-zinc-300 max-w-sm mx-auto">
                  Cross-referencing themes, pacing, screenplay archetypes, and ratings for optimal pairing.
                </p>
              </div>
            ) : recommendationResult ? (
              <div className="space-y-4 pt-2">
                {/* Curator commentary box in Frosted Glass */}
                <div className="p-5 rounded-3xl bg-white/[0.04] border border-amber-500/30 backdrop-blur-xl space-y-2 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-mono uppercase font-bold text-amber-300">
                      Curated Program: {recommendationResult.curatedTheme}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {recommendationResult.suggestedTags?.map(tag => (
                        <span key={tag} className="text-[10px] px-2.5 py-0.5 rounded-lg bg-white/[0.08] border border-white/10 text-zinc-200">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed italic">
                    "{recommendationResult.rationale}"
                  </p>
                </div>

                {/* Recommended Movie Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {recommendationResult.recommendedMovies.map((movie: Movie, idx: number) => {
                    const inWatchlist = isInWatchlist(movie.id);
                    return (
                      <div
                        key={`ai-rec-${movie.id || idx}-${idx}`}
                        onClick={() => {
                          openMovieDetails(movie);
                          setAiConciergeOpen(false);
                        }}
                        className="group relative p-2.5 rounded-3xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all cursor-pointer shadow-xl hover:scale-102 flex flex-col justify-between backdrop-blur-xl"
                      >
                        <div>
                          <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden mb-2 bg-zinc-800 border border-white/10">
                            <img
                              src={movie.poster}
                              alt={movie.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-lg bg-[#05060f]/80 backdrop-blur-md text-[10px] font-bold text-amber-300 flex items-center gap-1 border border-white/15">
                              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                              <span>{movie.rating}</span>
                            </div>
                            {movie.publicDomain && (
                              <div className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-lg bg-emerald-500/20 backdrop-blur-md text-[9px] font-bold text-emerald-300 font-mono border border-emerald-500/30">
                                Free
                              </div>
                            )}
                          </div>

                          <div className="text-xs font-bold text-white truncate group-hover:text-amber-400">
                            {movie.title}
                          </div>
                          <div className="text-[10px] text-zinc-400 flex items-center justify-between mt-0.5">
                            <span>{movie.releaseYear}</span>
                            <span className="truncate max-w-[70px]">{movie.genres[0]}</span>
                          </div>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => toggleWatchlist(movie)}
                            className={`p-1.5 rounded-xl text-xs flex items-center gap-1 font-medium transition-colors w-full justify-center cursor-pointer ${
                              inWatchlist 
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                                : 'bg-white/[0.08] hover:bg-white/[0.16] text-zinc-300 border border-white/10'
                            }`}
                          >
                            {inWatchlist ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                            <span>{inWatchlist ? 'Saved' : 'Watchlist'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-white/[0.04] border border-white/10 rounded-3xl backdrop-blur-xl">
                <Sparkles className="w-8 h-8 text-amber-400/50 mx-auto mb-2" />
                <p className="text-xs text-zinc-300">
                  Select a mood preset above or type a custom prompt to discover tailored cinema matches.
                </p>
              </div>
            )}

          </div>
        )}

        {/* MODE 2: ASK CINEBOT ASSISTANT */}
        {mode === 'chat' && (
          <div className="flex flex-col h-[65vh]">
            
            {/* Chat message stream */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-300 flex items-center justify-center border border-amber-500/30 shrink-0 mt-0.5 backdrop-blur-md">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div 
                    className={`max-w-xl p-3.5 rounded-3xl text-xs sm:text-sm leading-relaxed backdrop-blur-xl ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-semibold shadow-md'
                        : 'bg-white/[0.06] border border-white/10 text-zinc-100 whitespace-pre-line shadow-lg'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isChatLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-300 flex items-center justify-center border border-amber-500/30 shrink-0 backdrop-blur-md">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white/[0.06] border border-white/10 p-3.5 rounded-3xl text-xs text-zinc-300 flex items-center gap-2 backdrop-blur-xl">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span>CineBot is analyzing cinema lore & catalog...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendChatMessage} className="p-3 sm:p-4 border-t border-white/10 bg-white/[0.03] backdrop-blur-md flex gap-2">
              <input
                type="text"
                value={userChatInput}
                onChange={(e) => setUserChatInput(e.target.value)}
                placeholder="Ask about directors, movie recommendations, public domain trivia..."
                className="flex-1 bg-white/[0.06] border border-white/15 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-amber-400 backdrop-blur-md"
              />
              <button
                type="submit"
                disabled={isChatLoading || !userChatInput.trim()}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-zinc-950 font-bold text-sm flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all active:scale-95 shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>

          </div>
        )}

      </div>

    </div>
  );
};
