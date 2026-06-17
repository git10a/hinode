/** @type {import('next').NextConfig} */
const THIRTY_DAYS_SECONDS = 60 * 60 * 24 * 30;

const nextConfig = {
    images: {
        formats: ['image/avif', 'image/webp'],
        // 最適化済み画像のキャッシュ保持期間。/assets内の画像を同名のまま
        // 差し替えた場合、反映に最大30日かかる点に注意
        minimumCacheTTL: THIRTY_DAYS_SECONDS,
        remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'images.microcms-assets.io' },
        ],
    },
    async headers() {
        return [
            {
                source: '/assets/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: `public, max-age=${THIRTY_DAYS_SECONDS}, immutable`,
                    },
                ],
            },
            {
                source: '/images/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: `public, max-age=${THIRTY_DAYS_SECONDS}, immutable`,
                    },
                ],
            },
            {
                source: '/favicon.png',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: `public, max-age=${THIRTY_DAYS_SECONDS}, immutable`,
                    },
                ],
            },
            {
                source: '/googlebc7bc599f52dfc4c.html',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: `public, max-age=${THIRTY_DAYS_SECONDS}, immutable`,
                    },
                ],
            },
            {
                source: '/:file(robots\\.txt|sitemap\\.xml|llms\\.txt)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
                    },
                ],
            },
        ];
    },
    async redirects() {
        return [
            {
                source: '/running-community-tokyo',
                destination: '/',
                statusCode: 301,
            },
            {
                source: '/blog/ybshx0x8x',
                destination: '/blog/kkzy8gvj1',
                permanent: true,
            },
        ];
    },
};

module.exports = nextConfig;
