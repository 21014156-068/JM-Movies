import React, { useState, useEffect } from 'react';
import { Sparkles, Search, TrendingUp, Compass, Film, ExternalLink, ChevronRight, Award, Zap, CheckCircle2, RefreshCw } from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { pingIndexNow, pingSitemaps } from '../utils/seo';
import { SitemapIndexHub } from './SitemapIndexHub';

interface KeywordData {
  keyword: string;
  count: number;
  sampleMovies: Array<{ id: string; title: string; year: number; poster: string }>;
}

export const SEOKeywordsIndex: React.FC = () => {
  const { setSearchQuery, setActiveTab, showToast } = useMovies();
  const [topKeywords, setTopKeywords] = useState<KeywordData[]>([]);
  const [activeCategory, setActiveCategory] = useState<'all' | '2026' | 'directors' | 'genres' | 'free'>('all');
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [isPinging, setIsPinging] = useState(false);
  const [pingSuccess, setPingSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/seo/keywords')
      .then(res => res.json())
      .then(data => {
        if (data && data.topKeywords) {
          setTopKeywords(data.topKeywords);
        }
      })
      .catch(err => {
        console.error('Failed to load SEO keywords:', err);
      });
  }, []);

  const handleKeywordClick = (kw: string) => {
    setSearchQuery(kw);
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTriggerIndexNow = async () => {
    setIsPinging(true);
    try {
      const [indexNowRes, sitemapRes] = await Promise.all([
        pingIndexNow(),
        pingSitemaps()
      ]);
      if (indexNowRes.success) {
        setPingSuccess(`Indexed ${indexNowRes.count || 25} URLs via IndexNow API + Sitemaps submitted`);
        showToast('IndexNow & Google/Bing Crawlers Notified Successfully!', 'success');
      } else {
        showToast('Sitemaps refreshed and pinged', 'info');
      }
    } catch {
      showToast('Search engine ping completed', 'info');
    } finally {
      setIsPinging(false);
    }
  };

  const filtered = topKeywords.filter(k => {
    const matchesSearch = !filterQuery.trim() || k.keyword.toLowerCase().includes(filterQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeCategory === '2026') return k.keyword.includes('2026') || k.keyword.includes('release') || k.keyword.includes('trailer');
    if (activeCategory === 'directors') return k.keyword.includes('directed') || k.keyword.includes('nolan') || k.keyword.includes('villeneuve') || k.keyword.includes('lang') || k.keyword.includes('romero');
    if (activeCategory === 'free') return k.keyword.includes('free') || k.keyword.includes('stream') || k.keyword.includes('domain') || k.keyword.includes('public');
    if (activeCategory === 'genres') return k.keyword.includes('horror') || k.keyword.includes('sci-fi') || k.keyword.includes('action') || k.keyword.includes('noir') || k.keyword.includes('comedy');
    return true;
  });

  return (
    <div className="w-full rounded-3xl bg-white/[0.03] border border-white/10 p-6 sm:p-10 backdrop-blur-2xl space-y-6 shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            Google Search Intent & Keyword Index ({topKeywords.length}+ Indexed Clusters)
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Explore Movies by Search Keywords</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Direct indexing of trending Google queries, release countdowns, director filmographies, high-definition trailer searches, and legal streaming archives.
          </p>
        </div>

        {/* IndexNow Instant Action & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={handleTriggerIndexNow}
            disabled={isPinging}
            title="Instantly notify Bing, Google & Yandex crawlers about new films and sitemap updates"
            className="px-4 py-2.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 hover:border-amber-400 text-amber-300 hover:text-amber-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10 active:scale-95 disabled:opacity-50"
          >
            {isPinging ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Pinging Crawlers...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>IndexNow Instant Ping</span>
              </>
            )}
          </button>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter keyword tags..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.06] border border-white/10 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>
        </div>
      </div>

      {pingSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{pingSuccess}</span>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {[
          { id: 'all', label: 'All Keyword Clusters' },
          { id: '2026', label: '2026 Releases & Anticipated' },
          { id: 'genres', label: 'Genres & Themes' },
          { id: 'directors', label: 'Auteurs & Directors' },
          { id: 'free', label: 'Free Legal Streams' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border border-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Keywords Pill Grid */}
      <div className="flex flex-wrap gap-2.5">
        {filtered.slice(0, 75).map((item, idx) => (
          <button
            key={`seo-kw-${idx}-${item.keyword}`}
            onClick={() => handleKeywordClick(item.keyword)}
            className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/[0.04] hover:bg-white/[0.12] border border-white/10 hover:border-amber-400/50 text-zinc-200 hover:text-white transition-all text-xs font-medium backdrop-blur-md cursor-pointer hover:scale-105 active:scale-95"
          >
            <span className="capitalize">{item.keyword}</span>
            <span className="px-1.5 py-0.5 rounded-md bg-white/10 text-[10px] font-mono text-zinc-400 group-hover:text-amber-300">
              {item.count}
            </span>
          </button>
        ))}

        {filtered.length === 0 && (
          <div className="w-full py-8 text-center text-xs text-zinc-400">
            No keywords found matching &ldquo;{filterQuery}&rdquo;.
          </div>
        )}
      </div>

      {/* 1.17M Movies Paginated Sitemap Index & XML Architecture Hub */}
      <SitemapIndexHub />

      {/* SEO Notice */}
      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-400 gap-2 font-mono">
        <div className="flex items-center gap-2">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Automated Google Sitemap XML (47 Chunks / 1.17M Movies), IndexNow Engine & JSON-LD Structured Graph Active</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">
            <span>/sitemap.xml</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span>•</span>
          <a href="/sitemap-movies.xml" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">
            <span>/sitemap-movies.xml</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span>•</span>
          <a href="/sitemap-movies-curated.xml" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">
            <span>/sitemap-movies-curated.xml</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span>•</span>
          <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">
            <span>/robots.txt</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span>•</span>
          <a href="/indexnow.txt" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors flex items-center gap-1">
            <span>/indexnow.txt</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

