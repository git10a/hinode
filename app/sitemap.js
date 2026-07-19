import { getAllBlogPosts } from '../lib/microcms';
import COURSE_GUIDES from '../lib/courseGuides';
import { BLOG_TOPICS } from '../lib/blogTopics';

const SITE_URL = 'https://hinode-run.com';

// ブログ更新はwebhook（/api/revalidate）でも再生成されるが、
// 念のため定期再検証もかけておく
export const revalidate = 3600;

const STATIC_PATHS = [
    { path: '/', lastModified: '2026-07-13' },
    { path: '/about', lastModified: '2026-07-13' },
    { path: '/blog', lastModified: '2026-07-13' },
    { path: '/courses' },
    { path: '/event-runs' },
    { path: '/faq' },
    { path: '/first-run', lastModified: '2026-07-13' },
    { path: '/press', lastModified: '2026-07-13' },
    { path: '/privacy' },
    { path: '/rules' },
    { path: '/schedule', lastModified: '2026-07-13' },
    { path: '/contact', lastModified: '2026-07-19' },
];

function entry(path, lastModified) {
    return {
        url: `${SITE_URL}${path === '/' ? '' : path}`,
        ...(lastModified ? { lastModified } : {}),
    };
}

export default async function sitemap() {
    const posts = await getAllBlogPosts();

    return [
        ...STATIC_PATHS.map(({ path, lastModified }) => entry(path, lastModified)),
        ...COURSE_GUIDES.map((course) => entry(`/courses/${course.slug}`)),
        ...BLOG_TOPICS.map((topic) => entry(`/blog/topics/${topic.slug}`, '2026-07-13')),
        ...posts
            .filter((post) => post.id && post.publishedAt)
            .map((post) => entry(`/blog/${post.id}`, post.publicUpdatedAt || post.updatedAt || post.publishedAt)),
    ];
}
