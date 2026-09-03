import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  RotateCcw, 
  Tv, 
  CheckCircle2, 
  Settings,
  Sparkles,
  Zap,
  Download,
  ExternalLink,
  Moon,
  Sun,
  BookOpen,
  History,
  RotateCw
} from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { ADSTERRA_TARGETED_CHANNELS, openAdsterraLink } from '../utils/adsterra';

export const PublicDomainPlayer: React.FC = () => {
  const { streamingMovie, setStreamingMovie, showToast } = useMovies();

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(() => {
    try {
      const spd = localStorage.getItem('jamal_player_speed');
      return spd ? Number(spd) : 1;
    } catch {
      return 1;
    }
  });
  const [showControls, setShowControls] = useState<boolean>(true);
  const [speedMenuOpen, setSpeedMenuOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // New features: Theater Dimmer, Resume Playback Prompt, Vault Trivia Drawer
  const [theaterMode, setTheaterMode] = useState<boolean>(false);
  const [resumePromptTime, setResumePromptTime] = useState<number | null>(null);
  const [showVaultNotes, setShowVaultNotes] = useState<boolean>(false);

  // Auto-hide controls timeout
  const controlsTimeoutRef = useRef<any>(null);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && !showVaultNotes) {
        setShowControls(false);
        setSpeedMenuOpen(false);
      }
    }, 3500);
  };

  // Check for saved progress on mount
  useEffect(() => {
    if (!streamingMovie) return;
    try {
      const saved = localStorage.getItem(`jamal_progress_${streamingMovie.id}`);
      if (saved) {
        const savedSecs = Number(saved);
        if (savedSecs > 15) {
          setResumePromptTime(savedSecs);
        }
      }
    } catch {
      // ignore
    }
  }, [streamingMovie?.id]);

  // Save progress every 5s while playing
  useEffect(() => {
    if (!streamingMovie || currentTime <= 0) return;
    const interval = setInterval(() => {
      try {
        if (currentTime > 10 && duration > 0 && currentTime < duration - 20) {
          localStorage.setItem(`jamal_progress_${streamingMovie.id}`, String(Math.floor(currentTime)));
        } else if (duration > 0 && currentTime >= duration - 20) {
          localStorage.removeItem(`jamal_progress_${streamingMovie.id}`);
        }
      } catch {
        // ignore
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [streamingMovie?.id, currentTime, duration]);

  useEffect(() => {
    if (!streamingMovie) return;

    // Apply persisted speed
    if (videoRef.current && playbackSpeed !== 1) {
      videoRef.current.playbackRate = playbackSpeed;
    }

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showVaultNotes) {
          setShowVaultNotes(false);
          return;
        }
        setStreamingMovie(null);
      } else if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        toggleTheaterMode();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (videoRef.current) videoRef.current.currentTime -= 5;
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (videoRef.current) videoRef.current.currentTime += 5;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [streamingMovie?.id, isPlaying, isMuted, showVaultNotes, theaterMode, playbackSpeed]);

  if (!streamingMovie || !streamingMovie.streamUrl) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleTheaterMode = () => {
    setTheaterMode(prev => {
      const next = !prev;
      showToast(next ? 'Cinema Lights Off (Theater Mode)' : 'Cinema Lights On', 'info');
      return next;
    });
  };

  const resumePlayback = () => {
    if (videoRef.current && resumePromptTime !== null) {
      videoRef.current.currentTime = resumePromptTime;
      setCurrentTime(resumePromptTime);
      showToast(`Resumed from ${formatTime(resumePromptTime)}`, 'success');
      setResumePromptTime(null);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    setDuration(videoRef.current.duration || 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const changeSpeed = (spd: number) => {
    setPlaybackSpeed(spd);
    try {
      localStorage.setItem('jamal_player_speed', String(spd));
    } catch {
      // ignore
    }
    if (videoRef.current) {
      videoRef.current.playbackRate = spd;
    }
    setSpeedMenuOpen(false);
    showToast(`Playback speed set to ${spd}x`, 'info');
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div 
      className={`fixed inset-0 z-50 overflow-hidden flex items-center justify-center animate-in fade-in select-none transition-colors duration-500 ${
        theaterMode ? 'bg-[#000000]' : 'bg-black'
      }`}
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={streamingMovie.streamUrl}
        poster={streamingMovie.backdrop || streamingMovie.poster}
        autoPlay
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Resume Playback Floating Banner */}
      {resumePromptTime !== null && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-[#0d1024]/95 border border-amber-400/40 rounded-2xl p-3 sm:px-5 sm:py-3 shadow-2xl backdrop-blur-xl flex items-center gap-4 animate-in slide-in-from-top-3">
          <div className="flex items-center gap-2.5 text-xs text-zinc-200">
            <History className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Resume from <strong>{formatTime(resumePromptTime)}</strong>?
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resumePlayback}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black rounded-xl text-xs transition-colors cursor-pointer"
            >
              Resume
            </button>
            <button
              onClick={() => setResumePromptTime(null)}
              className="px-2 py-1 text-zinc-400 hover:text-white text-xs cursor-pointer"
            >
              Start Over
            </button>
          </div>
        </div>
      )}

      {/* Top Header Bar with Frosted Glass */}
      <div 
        className={`absolute top-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-b from-[#05060f]/90 via-[#05060f]/60 to-transparent backdrop-blur-md flex items-center justify-between transition-opacity duration-300 z-30 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 backdrop-blur-xl shadow-lg">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white">{streamingMovie.title}</h2>
              <span className="text-xs text-zinc-400">({streamingMovie.releaseYear})</span>
              <span className="px-2.5 py-0.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] backdrop-blur-md">
                Public Domain Cinema
              </span>
            </div>
            <div className="text-xs text-zinc-300">
              Verified Legal Full-Length Stream • Directed by {streamingMovie.director || 'Archive Master'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Cinema Vault Archive Trivia Notes */}
          <button
            onClick={() => setShowVaultNotes(!showVaultNotes)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 text-zinc-200 hover:text-white text-xs font-semibold backdrop-blur-md transition-all cursor-pointer"
            title="Film History & Public Domain Notes"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Archive Vault</span>
          </button>

          {/* Theater Dimmer Toggle */}
          <button
            onClick={toggleTheaterMode}
            className={`p-2 rounded-2xl border transition-all cursor-pointer ${
              theaterMode 
                ? 'bg-amber-500 text-zinc-950 border-amber-400' 
                : 'bg-white/[0.08] hover:bg-white/[0.16] border-white/15 text-zinc-200 hover:text-white'
            }`}
            title="Theater Mode (Lights Off) - Press L"
          >
            {theaterMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Sponsored Fast Server 2 Mirror */}
          {!theaterMode && (
            <a
              href={ADSTERRA_TARGETED_CHANNELS.PLAYER_BACKUP_MIRROR}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => openAdsterraLink(ADSTERRA_TARGETED_CHANNELS.PLAYER_BACKUP_MIRROR)}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-zinc-950" />
              <span>Server 2 (4K)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {/* Sponsored Fast Download Mirror */}
          {!theaterMode && (
            <a
              href={ADSTERRA_TARGETED_CHANNELS.FAST_DOWNLOAD_SERVER}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => openAdsterraLink(ADSTERRA_TARGETED_CHANNELS.FAST_DOWNLOAD_SERVER)}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 text-white font-bold text-xs transition-all hover:scale-105 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>HD Download</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </a>
          )}

          <button
            onClick={() => setStreamingMovie(null)}
            className="w-10 h-10 rounded-2xl bg-[#05060f]/80 hover:bg-white/[0.15] border border-white/15 text-white flex items-center justify-center backdrop-blur-xl transition-all hover:scale-105 cursor-pointer shadow-lg"
            title="Close Player (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Archive Vault Slide-over Modal */}
      {showVaultNotes && (
        <div className="absolute right-4 top-20 bottom-24 w-80 sm:w-96 bg-[#0a0d1f]/95 border border-white/20 rounded-3xl p-5 shadow-2xl backdrop-blur-2xl z-40 overflow-y-auto text-white space-y-4 animate-in slide-in-from-right-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-black">Archive Vault & Legal Notes</h3>
            </div>
            <button
              onClick={() => setShowVaultNotes(false)}
              className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 text-xs text-zinc-300">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
              <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Public Domain Status: Verified Free
              </span>
              <p className="text-[11px] text-zinc-300">
                This film is free of copyright restrictions in the United States and most international jurisdictions. You can legally watch, study, and share it worldwide without subscriptions.
              </p>
            </div>

            <div className="space-y-1.5 bg-white/[0.04] p-3 rounded-2xl border border-white/10">
              <span className="font-bold text-amber-300">Restoration & Archival Source</span>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                Streamed via the Internet Archive & Library of Congress open cultural cinema repository. Transcoded in modern progressive MP4/WebM containers with restored audio tracks.
              </p>
            </div>

            <div className="space-y-1.5 bg-white/[0.04] p-3 rounded-2xl border border-white/10">
              <span className="font-bold text-white">Film Synopsis & Legacy</span>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                {streamingMovie.overview}
              </p>
            </div>

            {streamingMovie.cast && streamingMovie.cast.length > 0 && (
              <div className="space-y-1.5 bg-white/[0.04] p-3 rounded-2xl border border-white/10">
                <span className="font-bold text-white">Starring</span>
                <div className="text-[11px] text-zinc-400 flex flex-wrap gap-1.5">
                  {streamingMovie.cast.slice(0, 6).map((c, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white/5 rounded-lg border border-white/10">
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Center Play/Pause Large Overlay if paused */}
      {!isPlaying && (
        <div 
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-20 cursor-pointer"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/50 hover:scale-110 transition-transform">
            <Play className="w-9 h-9 fill-current ml-1" />
          </div>
        </div>
      )}

      {/* Bottom Controls Bar with Frosted Glass */}
      <div 
        className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-[#05060f]/95 via-[#05060f]/75 to-transparent backdrop-blur-md transition-opacity duration-300 z-30 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress Bar Slider */}
        <div className="flex items-center gap-3 mb-3">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between text-zinc-200 text-sm">
          
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="p-2 rounded-xl hover:bg-white/[0.1] text-white transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
            </button>

            {/* Step back 10s */}
            <button
              onClick={() => {
                if (videoRef.current) videoRef.current.currentTime -= 10;
              }}
              className="p-2 rounded-xl hover:bg-white/[0.1] text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Rewind 10s"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className="p-2 rounded-xl hover:bg-white/[0.1] text-zinc-300 cursor-pointer">
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 sm:w-24 h-1 bg-white/20 rounded appearance-none accent-emerald-400 cursor-pointer"
              />
            </div>

            {/* Timestamps */}
            <div className="font-mono text-xs text-zinc-300 hidden sm:block">
              <span className="text-white font-medium">{formatTime(currentTime)}</span>
              <span className="mx-1">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            
            {/* Speed Picker */}
            <div className="relative">
              <button
                onClick={() => setSpeedMenuOpen(!speedMenuOpen)}
                className="px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] text-xs font-mono text-zinc-200 border border-white/15 backdrop-blur-md cursor-pointer"
              >
                {playbackSpeed}x Speed
              </button>

              {speedMenuOpen && (
                <div className="absolute bottom-full right-0 mb-2 bg-[#0a0d1f]/95 border border-white/20 rounded-2xl p-1.5 shadow-2xl backdrop-blur-xl flex flex-col gap-0.5 z-40 text-xs">
                  {[0.75, 1, 1.25, 1.5, 2].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => changeSpeed(spd)}
                      className={`px-3 py-1.5 rounded-xl text-left font-mono transition-colors cursor-pointer ${
                        playbackSpeed === spd 
                          ? 'bg-emerald-500 text-zinc-950 font-bold shadow-sm' 
                          : 'text-zinc-200 hover:bg-white/[0.1]'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl hover:bg-white/[0.1] text-white transition-colors cursor-pointer"
              title="Fullscreen (F)"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
