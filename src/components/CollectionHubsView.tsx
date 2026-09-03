import React, { useState } from 'react';
import { 
  Clapperboard, 
  Tv, 
  Play, 
  ExternalLink, 
  Compass, 
  Sparkles, 
  Film, 
  ShieldCheck, 
  Zap,
  ArrowRight,
  Filter
} from 'lucide-react';
import { CURATED_COLLECTIONS } from '../data/collectionsData';
import { CollectionHub } from '../types';
import { useMovies } from '../context/MovieContext';
import { SEOHead } from './SEOHead';
import { AdSlotBanner } from './AdSlotBanner';
import { ADSTERRA_TARGETED_CHANNELS, openAdsterraLink } from '../utils/adsterra';

export const CollectionHubsView: React.FC = () => {
  const { 
    setSearchQuery, 
    setSelectedGenre, 
    setActiveTab, 
    openMovieDetails,
    setStreamingMovie
  } = useMovies();

  const [activeFilter, setActiveFilter] = useState<'all' | 'director' | 'franchise' | 'where-to-watch'>('all');
  const [selectedHub, setSelectedHub] = useState<CollectionHub | null>(null);

  const filteredHubs = activeFilter === 'all' 
    ? CURATED_COLLECTIONS 
    : CURATED_COLLECTIONS.filter(h => h.type === activeFilter);

  const handleExploreHub = (hub: CollectionHub) => {
    if (hub.targetGenre) {
      setSelectedGenre(hub.targetGenre);
      setSearchQuery('');
    } else if (hub.targetQuery) {
      setSearchQuery(hub.targetQuery);
    }
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pt-28 pb-24 w-full px-4 sm:px-8 lg:px-12 xl:px-16 space-y-8">
      <SEOHead 
        title="Franchise & Director Hubs — Where to Watch Movies & Complete Sagas | Jamal Movies"
        description="Browse curated cinema hubs for visionary directors like Christopher Nolan and Denis Villeneuve, major franchises (Dune, Batman, Universal Monsters), and complete Where to Watch streaming guides."
        url={typeof window !== 'undefined' ? `${window.location.origin}/collections` : '/collections'}
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Collection Hubs', item: '/collections' }
        ]}
      />

      {/* Hero Header */}
      <div className="border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider mb-3">
          <Clapperboard className="w-3.5 h-3.5" />
          Curated Cinema Universe
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Franchise Hubs &amp; Auteur Collections
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 mt-2 max-w-3xl leading-relaxed">
          Comprehensive filmographies, franchise timelines, and verified <strong className="text-amber-400">Where to Watch</strong> guides for Hollywood auteurs, epic sagas, and free public domain cinematic treasures.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20'
              : 'bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08]'
          }`}
        >
          All Collections ({CURATED_COLLECTIONS.length})
        </button>

        <button
          onClick={() => setActiveFilter('director')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeFilter === 'director'
              ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20'
              : 'bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08]'
          }`}
        >
          Auteur Directors
        </button>

        <button
          onClick={() => setActiveFilter('franchise')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeFilter === 'franchise'
              ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20'
              : 'bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08]'
          }`}
        >
          Franchises &amp; Sagas
        </button>

        <button
          onClick={() => setActiveFilter('where-to-watch')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeFilter === 'where-to-watch'
              ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20'
              : 'bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08]'
          }`}
        >
          Where To Watch Guides
        </button>
      </div>

      {/* Hub Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHubs.map((hub) => (
          <div
            key={hub.id}
            className="group relative rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-amber-400/40 transition-all duration-300 overflow-hidden backdrop-blur-xl shadow-xl flex flex-col justify-between"
          >
            {/* Top Visual Poster Header */}
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <img
                src={hub.backdrop}
                alt={hub.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d1f] via-black/40 to-transparent" />
              
              {/* Badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-amber-300 text-[11px] font-bold">
                  {hub.badge}
                </span>
              </div>

              {/* Title Overlay */}
              <div className="absolute bottom-3 left-4 right-4">
                <div className="text-[11px] font-mono text-amber-400 font-semibold">
                  {hub.creatorOrTagline}
                </div>
                <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                  {hub.title}
                </h3>
              </div>
            </div>

            {/* Hub Content */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3">
                {hub.description}
              </p>

              {/* Featured Titles Chips */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                  Featured Motion Pictures
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {hub.featuredTitles.map((title, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSearchQuery(title);
                        setActiveTab('home');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-amber-400/20 border border-white/10 hover:border-amber-400/40 text-[11px] text-zinc-200 hover:text-amber-300 transition-colors cursor-pointer"
                    >
                      {title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Where to Watch Matrix Card */}
              {hub.whereToWatchInfo && (
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Zap className="w-3 h-3 text-amber-400" />
                      Availability:
                    </span>
                    <span className="text-zinc-200 font-semibold">{hub.whereToWatchInfo.theatricalStatus}</span>
                  </div>

                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Play className="w-3 h-3 text-purple-400" />
                      Resolution:
                    </span>
                    <span className="text-purple-300 font-mono font-bold">{hub.whereToWatchInfo.trailerResolution}</span>
                  </div>

                  {hub.whereToWatchInfo.freeStreamAvailable && (
                    <div className="mt-1 pt-1 border-t border-white/10 flex items-center justify-between text-emerald-400 font-bold">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        100% Free Public Domain Stream
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300 font-mono">
                        VERIFIED
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => handleExploreHub(hub)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-102 active:scale-98 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5 text-zinc-950" />
                  <span>Browse Hub Catalog</span>
                </button>

                {hub.type === 'where-to-watch' && (
                  <button
                    onClick={() => {
                      if (hub.id === 'hub-where-free-cinema') {
                        setActiveTab('public-domain');
                      } else {
                        setActiveTab('upcoming');
                      }
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    title="Open Dedicated Section"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Adsterra Sponsored Leaderboard */}
      <AdSlotBanner placement="leaderboard" className="mt-10" />

    </div>
  );
};
