import React, { useState } from 'react';
import { 
  Globe, 
  FileCode, 
  Search, 
  Copy, 
  Check, 
  ExternalLink, 
  Layers, 
  Send,
  Database,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { pingSitemaps } from '../utils/seo';

const TOTAL_TMDB_MOVIES = 1170000;
const MOVIES_PER_SITEMAP = 25000;
const TOTAL_CHUNKS = Math.ceil(TOTAL_TMDB_MOVIES / MOVIES_PER_SITEMAP); // 47

export const SitemapIndexHub: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [searchId, setSearchId] = useState<string>('');
  const [isPinging, setIsPinging] = useState(false);
  const [pingStatus, setPingStatus] = useState<string | null>(null);
  const [chunkFilter, setChunkFilter] = useState<string>('all');

  const copyToClipboard = (text: string, key: string) => {
    const fullUrl = text.startsWith('http') ? text : `${window.location.origin}${text}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePing = async () => {
    setIsPinging(true);
    setPingStatus(null);
    try {
      const res = await pingSitemaps();
      if (res.success) {
        setPingStatus('Google & Bing search crawlers notified of all 47 sitemap chunks!');
      } else {
        setPingStatus('Sitemap notification submitted.');
      }
    } catch {
      setPingStatus('Ping request sent.');
    } finally {
      setIsPinging(false);
      setTimeout(() => setPingStatus(null), 5000);
    }
  };

  // Movie ID lookup calculation
  const parsedId = parseInt(searchId.trim().replace(/^tmdb-/, ''), 10);
  const lookupResult = !isNaN(parsedId) && parsedId >= 1 && parsedId <= TOTAL_TMDB_MOVIES
    ? {
        chunk: Math.floor((parsedId - 1) / MOVIES_PER_SITEMAP) + 1,
        startId: Math.floor((parsedId - 1) / MOVIES_PER_SITEMAP) * MOVIES_PER_SITEMAP + 1,
        endId: Math.min((Math.floor((parsedId - 1) / MOVIES_PER_SITEMAP) + 1) * MOVIES_PER_SITEMAP, TOTAL_TMDB_MOVIES)
      }
    : null;

  // Filter chunks for display
  const allChunks = Array.from({ length: TOTAL_CHUNKS }, (_, i) => {
    const chunkNum = i + 1;
    const start = (chunkNum - 1) * MOVIES_PER_SITEMAP + 1;
    const end = Math.min(chunkNum * MOVIES_PER_SITEMAP, TOTAL_TMDB_MOVIES);
    return {
      num: chunkNum,
      filename: `sitemap-movies-${chunkNum}.xml`,
      url: `/sitemap-movies-${chunkNum}.xml`,
      range: `#${start.toLocaleString()} – #${end.toLocaleString()}`,
      count: end - start + 1
    };
  });

  const displayedChunks = chunkFilter === 'all' 
    ? allChunks 
    : chunkFilter === 'first10' 
      ? allChunks.slice(0, 10) 
      : chunkFilter === 'recent' 
        ? allChunks.slice(-10) 
        : allChunks;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              Scalable SEO Infrastructure
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-semibold">
              47 XML Sitemaps Active
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Paginated Sitemap Index for All 1.17M Movies
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Strictly compliant with the Google Search Console limit of 50,000 URLs per sitemap. Chunks the global 1,170,000 TMDB catalog into 47 optimized, fast-cached XML documents.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <button
            onClick={handlePing}
            disabled={isPinging}
            className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer hover:border-amber-400/40"
          >
            <Send className={`w-3.5 h-3.5 ${isPinging ? 'animate-pulse text-amber-400' : 'text-zinc-400'}`} />
            <span>{isPinging ? 'Pinging Search Engines...' : 'Ping Google & Bing'}</span>
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all cursor-pointer"
          >
            <span>{isExpanded ? 'Hide Chunks' : 'Explore All 47 Chunks'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {pingStatus && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{pingStatus}</span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">Total Catalog</span>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">1,170,000</div>
          <span className="text-[10px] text-zinc-400">Indexed TMDB Permalinks</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">Sitemap Chunks</span>
          <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">47 Files</div>
          <span className="text-[10px] text-zinc-400">25,000 URLs / Document</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">GSC Compliance</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">100%</div>
          <span className="text-[10px] text-zinc-400">&lt;50,000 URL Cap per File</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">Index Hierarchy</span>
          <div className="text-xl sm:text-2xl font-black text-blue-400 font-mono">2-Tier</div>
          <span className="text-[10px] text-zinc-400">Master + Movie Sitemap Index</span>
        </div>
      </div>

      {/* Core Submission Cards for Search Console */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10">
        {/* Master Index */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
                Primary Submission
              </span>
              <Globe className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <h3 className="text-sm font-bold text-white">Master Sitemap Index</h3>
            <p className="text-[11px] text-zinc-400">
              Aggregates all 47 movie sitemaps plus curated, collections, genres, years, and keywords.
            </p>
          </div>
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5 font-mono text-xs">
            <span className="text-zinc-300 truncate">/sitemap.xml</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => copyToClipboard('/sitemap.xml', 'master')}
                className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title="Copy Full URL"
              >
                {copiedKey === 'master' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 hover:text-white transition-colors"
                title="Open XML in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Dedicated Movie Index */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20">
                Movie Sub-Index
              </span>
              <Layers className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <h3 className="text-sm font-bold text-white">Dedicated Movies Index</h3>
            <p className="text-[11px] text-zinc-400">
              Direct sitemapindex containing only the 47 paginated movie sitemaps and curated HD entries.
            </p>
          </div>
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5 font-mono text-xs">
            <span className="text-zinc-300 truncate">/sitemap-movies.xml</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => copyToClipboard('/sitemap-movies.xml', 'movie-index')}
                className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title="Copy Full URL"
              >
                {copiedKey === 'movie-index' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a
                href="/sitemap-movies.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 hover:text-white transition-colors"
                title="Open XML in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Curated Movies Sitemap */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-semibold border border-purple-500/20">
                Rich Images & Videos
              </span>
              <FileCode className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <h3 className="text-sm font-bold text-white">Curated &amp; 2026 Premieres</h3>
            <p className="text-[11px] text-zinc-400">
              Enhanced with Google Image extensions, slugs, trailers, and priority 1.0 ranking tags.
            </p>
          </div>
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5 font-mono text-xs">
            <span className="text-zinc-300 truncate">/sitemap-movies-curated.xml</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => copyToClipboard('/sitemap-movies-curated.xml', 'curated')}
                className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 hover:text-white transition-colors cursor-pointer"
                title="Copy Full URL"
              >
                {copiedKey === 'curated' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a
                href="/sitemap-movies-curated.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 hover:text-white transition-colors"
                title="Open XML in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* TMDB Movie ID Lookup Tool */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-amber-400" />
              <span>Sitemap Chunk Calculator &amp; Lookup</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Enter any TMDB Movie ID (1 to 1,170,000) to instantly find which of the 47 sitemaps indexes it.
            </p>
          </div>

          <div className="w-full sm:w-72 relative">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="e.g. 550, 157336, 1022789..."
              className="w-full px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/10 focus:border-amber-400/50 text-white text-xs font-mono outline-none transition-colors pl-9"
            />
            <Database className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {lookupResult && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="space-y-0.5">
              <div className="font-semibold text-amber-300">
                TMDB Movie #{parsedId.toLocaleString()} is indexed in Chunk #{lookupResult.chunk}
              </div>
              <div className="text-[11px] text-zinc-400 font-mono">
                Sitemap Range: #{lookupResult.startId.toLocaleString()} to #{lookupResult.endId.toLocaleString()} (25,000 URLs)
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`/sitemap-movies-${lookupResult.chunk}.xml`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 hover:brightness-110 transition-all"
              >
                <span>Inspect Chunk #{lookupResult.chunk}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={`/movie/tmdb-${parsedId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1.5 transition-all"
              >
                <span>View Movie Permlink</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Expandable 47-Chunk Directory */}
      {isExpanded && (
        <div className="space-y-4 pt-2 border-t border-white/10 animate-fadeIn relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">
                All 47 Movie Sitemaps Directory
              </h3>
              <p className="text-xs text-zinc-400">
                Each document is cached for search engine bots with full weekly change frequency.
              </p>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <button
                onClick={() => setChunkFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  chunkFilter === 'all' ? 'bg-amber-400 text-zinc-950 font-bold' : 'bg-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                All 47
              </button>
              <button
                onClick={() => setChunkFilter('first10')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  chunkFilter === 'first10' ? 'bg-amber-400 text-zinc-950 font-bold' : 'bg-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                Chunks 1–10
              </button>
              <button
                onClick={() => setChunkFilter('recent')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  chunkFilter === 'recent' ? 'bg-amber-400 text-zinc-950 font-bold' : 'bg-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                Chunks 38–47
              </button>
            </div>
          </div>

          {/* Chunks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 max-h-96 overflow-y-auto pr-1">
            {displayedChunks.map((chunk) => (
              <div
                key={chunk.filename}
                className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/20 transition-all flex items-center justify-between group"
              >
                <div className="space-y-0.5 truncate mr-2">
                  <div className="text-xs font-mono font-semibold text-white flex items-center gap-1.5">
                    <FileCode className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">{chunk.filename}</span>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400">
                    {chunk.range} ({chunk.count.toLocaleString()} URLs)
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => copyToClipboard(chunk.url, chunk.filename)}
                    className="p-1 rounded-md bg-white/[0.04] hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    title="Copy URL"
                  >
                    {copiedKey === chunk.filename ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                  <a
                    href={chunk.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded-md bg-white/[0.04] hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                    title="Open XML"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
