/** @type {import('next-sitemap').IConfig} */

const INDEX_SUNRISE_CITIES = new Set([
  'tokyo-chiyoda', 'tokyo-meguro', 'tokyo-shibuya',
  'osaka', 'kyoto', 'sapporo', 'fukuoka', 'nagoya', 'yokohama', 'sendai',
]);

module.exports = {
  siteUrl: 'https://hinode-run.com',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  generateIndexSitemap: false,
  transform: async (config, path) => {
    // /sunrise/[city] のうちホワイトリスト外はサイトマップから除外
    const match = path.match(/^\/sunrise\/(.+)$/);
    if (match && !INDEX_SUNRISE_CITIES.has(match[1])) return null;

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
