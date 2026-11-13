import { absoluteUrl } from '@/lib/site';

export default function robots() {
    return {
        // 管理画面・CMSのAPI・下書きプレビューは検索に載せない
        rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/cms/', '/blog/preview/'] }],
        sitemap: absoluteUrl('/sitemap.xml'),
    };
}
