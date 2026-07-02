import { getAllBlogPosts } from '../lib/microcms';
import COURSE_GUIDES from '../lib/courseGuides';
import { INDEX_SUNRISE_CITY_SLUGS } from '../data/cities';

const SITE_URL = 'https://hinode-run.com';

// ブログ更新はwebhook（/api/revalidate）でも再生成されるが、
// 念のため定期再検証もかけておく
export const revalidate = 3600;

const STATIC_PATHS = [
    '/',
    '/about',
    '/blog',
    '/courses',
    '/event-runs',
    '/faq',
    '/first-run',
    '/press',
    '/privacy',
    '/rules',
    '/schedule',
    '/sunrise',
    '/work-contact',
];

function entry(path, lastModified) {
    return {
        url: `${SITE_URL}${path === '/' ? '' : path}`,
        changeFrequency: 'daily',
        priority: 0.7,
        ...(lastModified ? { lastModified } : {}),
    };
}

export default async function sitemap() {
    const posts = await getAllBlogPosts();

    return [
        ...STATIC_PATHS.map((path) => entry(path)),
        ...COURSE_GUIDES.map((course) => entry(`/courses/${course.slug}`)),
        ...INDEX_SUNRISE_CITY_SLUGS.map((slug) => entry(`/sunrise/${slug}`)),
        ...posts
            .filter((post) => post.id && post.publishedAt)
            .map((post) => entry(`/blog/${post.id}`, post.updatedAt || post.publishedAt)),
    ];
}
