import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  Play, 
  Film, 
  CheckCircle2, 
  XCircle, 
  RotateCw, 
  Trophy, 
  Eye, 
  Flame, 
  Star, 
  ChevronRight,
  Zap,
  ExternalLink
} from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { Movie } from '../types';
import { AdSlotBanner } from './AdSlotBanner';
import { ADSTERRA_TARGETED_CHANNELS, openAdsterraLink } from '../utils/adsterra';

interface TriviaOption {
  id: string;
  label: string;
  isCorrect: boolean;
  movie?: Movie;
}

interface TriviaQuestion {
  id: string;
  type: 'blur_poster' | 'quote' | 'director' | 'cast_detective' | 'runtime_riddle';
  question: string;
  clue?: string;
  targetMovie: Movie;
  options: TriviaOption[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const CineQuizView: React.FC = () => {
  const { openMovieDetails, setTrailerMovie, showToast } = useMovies();

  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [highestStreak, setHighestStreak] = useState<number>(0);
  const [unblurLevel, setUnblurLevel] = useState<number>(18); // px blur
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  const fetchQuestions = async () => {
    setIsLoading(true);
    setQuizCompleted(false);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setCurrentIndex(0);
    setUnblurLevel(18);

    try {
      const res = await fetch('/api/engagement/trivia?count=10');
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (option: TriviaOption) => {
    if (isAnswered) return;

    setSelectedOptionId(option.id);
    setIsAnswered(true);
    setUnblurLevel(0); // Reveal full image

    if (option.isCorrect) {
      const addedScore = 100 + streak * 20;
      setScore(prev => prev + addedScore);
      setStreak(prev => {
        const next = prev + 1;
        if (next > highestStreak) setHighestStreak(next);
        return next;
      });
      showToast('Correct! +Points earned!', 'success');
    } else {
      setStreak(0);
      showToast('Not quite! Check out the trailer below.', 'info');
    }
  };

  const handleNextQuestion = () => {
    setSelectedOptionId(null);
    setIsAnswered(false);
    setUnblurLevel(18);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleHintUnblur = () => {
    setUnblurLevel(prev => Math.max(4, prev - 6));
  };

  return (
    <div className="pt-28 pb-24 w-full px-4 sm:px-8 lg:px-12 xl:px-16 space-y-10">
      
      {/* Header Banner */}
      <div className="border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            Cinema Trivia & IQ
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            CineQuiz: Test Your Movie Knowledge
          </h1>
          <p className="text-sm text-zinc-300 mt-1 max-w-2xl">
            Guess films from blurred artwork, iconic taglines, director filmographies, and cast riddles!
          </p>
        </div>

        {/* Real-time Game Stats */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center gap-2 text-amber-300">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold font-mono">{score} PTS</span>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-rose-300">
            <Flame className="w-4 h-4 fill-rose-400 text-rose-400" />
            <span className="text-xs font-bold font-mono">{streak} Streak</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="h-96 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-amber-400/20 border-t-amber-400 rounded-full animate-spin" />
        </div>
      ) : quizCompleted ? (
        /* Final Scorecard Screen */
        <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-[#0a0d1f]/95 border border-white/15 backdrop-blur-2xl shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center mx-auto text-4xl shadow-inner">
            🏆
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white">Quiz Completed!</h2>
            <p className="text-sm text-zinc-300">
              You scored <span className="text-amber-400 font-bold font-mono">{score} points</span> with a peak streak of <span className="text-rose-400 font-bold font-mono">{highestStreak} in a row</span>!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={fetchQuestions}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-white font-black text-sm transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCw className="w-4 h-4" />
              <span>Play Another Round</span>
            </button>

            <a
              href={ADSTERRA_TARGETED_CHANNELS.QUIZ_REWARD_UNLOCK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => openAdsterraLink(ADSTERRA_TARGETED_CHANNELS.QUIZ_REWARD_UNLOCK)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-sm shadow-xl shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-zinc-950" />
              <span>⚡ Claim Quiz VIP Stream Pass</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="pt-6 border-t border-white/10">
            <AdSlotBanner placement="leaderboard" />
          </div>
        </div>
      ) : currentQ ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Visual Clue Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-3xl bg-[#0a0d1f]/95 border border-white/15 overflow-hidden backdrop-blur-2xl shadow-2xl p-4 space-y-4">
              
              {/* Question Format Badge */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-xl bg-white/[0.08] text-xs font-mono font-bold text-amber-300 border border-white/10">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="text-xs font-mono text-zinc-400 uppercase">
                  {currentQ.type.replace('_', ' ')}
                </span>
              </div>

              {/* Poster / Clue Box */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 flex items-center justify-center">
                <img
                  src={currentQ.targetMovie.poster || currentQ.targetMovie.backdrop}
                  alt="Mystery Movie"
                  className="w-full h-full object-cover transition-all duration-500"
                  style={{ filter: isAnswered ? 'none' : `blur(${unblurLevel}px)` }}
                />

                {!isAnswered && unblurLevel > 6 && (
                  <button
                    onClick={handleHintUnblur}
                    className="absolute bottom-4 right-4 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-black/90 transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>Unblur Hint</span>
                  </button>
                )}
              </div>

              {/* Clue Text */}
              {currentQ.clue && (
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/5 text-xs text-zinc-300">
                  <span className="font-bold text-amber-400">Clue: </span>
                  {currentQ.clue}
                </div>
              )}
            </div>

            {/* Adsterra Medium Rectangle slot */}
            <AdSlotBanner placement="medium-rectangle" />
          </div>

          {/* Question & Options Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0a0d1f]/95 border border-white/15 backdrop-blur-2xl shadow-2xl space-y-6">
              
              <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                {currentQ.question}
              </h2>

              {/* Options List */}
              <div className="space-y-3">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  let btnStyle = 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-white';

                  if (isAnswered) {
                    if (opt.isCorrect) {
                      btnStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-2 ring-emerald-400/40';
                    } else if (isSelected && !opt.isCorrect) {
                      btnStyle = 'bg-rose-500/20 border-rose-400 text-rose-300';
                    } else {
                      btnStyle = 'opacity-40 border-transparent bg-white/[0.02] text-zinc-500';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(opt)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between font-semibold text-sm sm:text-base cursor-pointer ${btnStyle}`}
                    >
                      <span>{opt.label}</span>
                      {isAnswered && opt.isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                      {isAnswered && isSelected && !opt.isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Answer Explanation & Immediate Movie Trailer CTA */}
              {isAnswered && (
                <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl space-y-4 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                      Cinema Knowledge Reveal
                    </span>
                    <p className="text-sm text-zinc-200 leading-relaxed">
                      {currentQ.explanation}
                    </p>
                  </div>

                  {/* Immediate Trailer & Details CTAs */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-white/10">
                    {currentQ.targetMovie.trailerKey && (
                      <button
                        onClick={() => setTrailerMovie(currentQ.targetMovie)}
                        className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all hover:scale-105 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-zinc-950" />
                        <span>Watch "{currentQ.targetMovie.title}" HD Trailer</span>
                      </button>
                    )}

                    <button
                      onClick={() => openMovieDetails(currentQ.targetMovie)}
                      className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 text-white font-bold text-xs flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>Full Movie Details</span>
                    </button>

                    <button
                      onClick={handleNextQuestion}
                      className="ml-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/25 transition-all hover:scale-105 cursor-pointer"
                    >
                      <span>Next Question</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* In-feed Ad Banner Slot */}
            <AdSlotBanner placement="leaderboard" />

          </div>

        </div>
      ) : null}

    </div>
  );
};
