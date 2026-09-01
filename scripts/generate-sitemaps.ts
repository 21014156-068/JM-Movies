import fs from 'fs';
import path from 'path';
import { INITIAL_MOVIES, GENRE_LIST } from '../server/data/movies';
import { CURATED_UPCOMING_RELEASES } from '../server/tmdb';
import { generateMovieKeywords } from '../server/seoKeywords';

const DOMAIN = 'https://jmcinema-phi.vercel.app';
const TODAY = new Date().toISOString().split('T')[0];
const PUBLIC_DIR = path.resolve(process.cwd(), 'public');

if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// 1. Master Sitemap Index
const masterSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${DOMAIN}/sitemap-main.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap-movies.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap-keywords.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
</sitemapindex>`.trim();

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), masterSitemap, 'utf8');

// 2. Main Pages Sitemap
const mainRoutes = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/trending', priority: '0.9', changefreq: 'daily' },
  { path: '/top-rated', priority: '0.8', changefreq: 'weekly' },
  { path: '/upcoming', priority: '0.9', changefreq: 'daily' },
  { path: '/watchlist', priority: '0.6', changefreq: 'weekly' },
  { path: '/history', priority: '0.5', changefreq: 'weekly' },
  { path: '/favorites', priority: '0.6', changefreq: 'weekly' },
  { path: '/trivia', priority: '0.7', changefreq: 'weekly' },
  { path: '/battle', priority: '0.7', changefreq: 'weekly' },
  { path: '/roulette', priority: '0.7', changefreq: 'weekly' },
  { path: '/privacy-policy', priority: '0.3', changefreq: 'monthly' },
  { path: '/terms', priority: '0.3', changefreq: 'monthly' },
  { path: '/disclaimer', priority: '0.3', changefreq: 'monthly' },
  { path: '/dmca', priority: '0.3', changefreq: 'monthly' },
  { path: '/contact', priority: '0.4', changefreq: 'monthly' }
];

// Add genres
GENRE_LIST.forEach(g => {
  mainRoutes.push({
    path: `/?genre=${encodeURIComponent(g)}`,
    priority: '0.8',
    changefreq: 'weekly'
  });
});

const mainSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${mainRoutes.map(r => `  <url>
    <loc>${DOMAIN}${r.path.replace(/&/g, '&amp;')}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n')}
</urlset>`.trim();

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-main.xml'), mainSitemap, 'utf8');

// 3. Movies Sitemap with Google Image Schema
const combinedMovies = [...INITIAL_MOVIES, ...CURATED_UPCOMING_RELEASES];
const seen = new Set<string>();
const uniqueMovies = combinedMovies.filter(m => {
  const key = m.id || (m.tmdbId ? `tmdb-${m.tmdbId}` : m.title.toLowerCase());
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

const movieUrls = uniqueMovies.map(m => {
  const safeTitle = (m.title || 'Movie').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const poster = m.poster ? m.poster.replace(/&/g, '&amp;') : '';
  const date = m.releaseDate || TODAY;

  return `  <url>
    <loc>${DOMAIN}/movie/${m.id}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    ${poster ? `<image:image>
      <image:loc>${poster}</image:loc>
      <image:title>${safeTitle} (${m.releaseYear || ''})</image:title>
    </image:image>` : ''}
  </url>`;
}).join('\n');

const moviesSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${movieUrls}
</urlset>`.trim();

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-movies.xml'), moviesSitemap, 'utf8');

// 4. Keyword Clusters Sitemap
const uniqueKeywords = new Set<string>();
uniqueMovies.forEach(m => {
  const kws = generateMovieKeywords(m);
  kws.slice(0, 10).forEach(kw => uniqueKeywords.add(kw));
});

const keywordUrls = Array.from(uniqueKeywords).slice(0, 500).map(kw => `  <url>
    <loc>${DOMAIN}/?search=${encodeURIComponent(kw).replace(/&/g, '&amp;')}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n');

const keywordsSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${keywordUrls}
</urlset>`.trim();

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-keywords.xml'), keywordsSitemap, 'utf8');

// 5. Robots.txt
const robotsTxt = `# Googlebot & Universal Search Engine Directives
User-agent: *
Allow: /
Allow: /movie/
Allow: /trending
Allow: /top-rated
Allow: /upcoming
Disallow: /api/
Disallow: /admin

# Master Sitemap Index
Sitemap: ${DOMAIN}/sitemap.xml
Sitemap: ${DOMAIN}/sitemap-main.xml
Sitemap: ${DOMAIN}/sitemap-movies.xml
Sitemap: ${DOMAIN}/sitemap-keywords.xml
`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), robotsTxt, 'utf8');

console.log('✅ Sitemaps and robots.txt successfully generated into /public directory.');
