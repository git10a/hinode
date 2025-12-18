/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['images.unsplash.com', 'images.microcms-assets.io'],
    },
    async redirects() {
        return [
            {
                source: '/:path*',
                has: [
                    {
                        type: 'host',
                        value: 'www.hinode-run.com',
                    },
                ],
                destination: 'https://hinode-run.com/:path*',
                permanent: true,
            },
        ];
    },
};

module.exports = nextConfig;
