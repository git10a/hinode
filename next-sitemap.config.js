/** @type {import('next-sitemap').IConfig} */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://hinode-run.com';
const EXTRA_STATIC_PATHS = ['/', '/schedule', '/first-run', '/event-runs'];

const INDEX_SUNRISE_CITIES = new Set([
  'tokyo-chiyoda', 'tokyo-meguro', 'tokyo-shibuya',
  'osaka', 'kyoto', 'sapporo', 'fukuoka', 'nagoya', 'yokohama', 'sendai',
]);

function readLocalEnv(name) {
  if (process.env[name]) return process.env[name];

  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return undefined;

  const line = fs
    .readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .find((entry) => entry.startsWith(`${name}=`));

  if (!line) return undefined;
  return line.slice(name.length + 1).replace(/^["']|["']$/g, '');
}

function createSitemapEntry(config, loc, lastmod) {
  return {
    loc,
    changefreq: config.changefreq,
    priority: config.priority,
    lastmod: lastmod || (config.autoLastmod ? new Date().toISOString() : undefined),
  };
}

async function getBlogSitemapEntries(config) {
  const serviceDomain = readLocalEnv('MICROCMS_SERVICE_DOMAIN');
  const apiKey = readLocalEnv('MICROCMS_API_KEY');
  if (!serviceDomain || !apiKey) return [];

  try {
    const params = new URLSearchParams({
      fields: 'id,publishedAt,updatedAt',
      limit: '100',
      orders: '-publishedAt',
    });
    const res = await fetch(`https://${serviceDomain}.microcms.io/api/v1/blogs?${params}`, {
      headers: { 'X-MICROCMS-API-KEY': apiKey },
    });

    if (!res.ok) return [];

    const data = await res.json();
    if (!Array.isArray(data.contents)) return [];

    return data.contents
      .filter((post) => post.id)
      .map((post) => createSitemapEntry(
        config,
        `/blog/${post.id}`,
        post.updatedAt || post.publishedAt
      ));
  } catch (error) {
    return [];
  }
}

module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  generateIndexSitemap: false,
  additionalPaths: async (config) => [
    ...EXTRA_STATIC_PATHS.map((loc) => createSitemapEntry(config, loc)),
    ...(await getBlogSitemapEntries(config)),
  ],
  transform: async (config, path) => {
    // /sunrise/[city] のうちホワイトリスト外はサイトマップから除外
    const match = path.match(/^\/sunrise\/(.+)$/);
    if (match && !INDEX_SUNRISE_CITIES.has(match[1])) return null;

    return createSitemapEntry(config, path);
  },
};
