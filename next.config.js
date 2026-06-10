/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        formats: ['image/avif', 'image/webp'],
        // 最適化済み画像のキャッシュ保持期間。/assets内の画像を同名のまま
        // 差し替えた場合、反映に最大1日かかる点に注意
        minimumCacheTTL: 86400,
        remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'images.microcms-assets.io' },
        ],
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
