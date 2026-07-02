export default function robots() {
    return {
        rules: [{ userAgent: '*', allow: '/' }],
        sitemap: 'https://hinode-run.com/sitemap.xml',
    };
}
