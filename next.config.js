/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['images.unsplash.com', 'images.microcms-assets.io'],
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
