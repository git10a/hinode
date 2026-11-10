import Link from '@/components/SiteLink';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import PostGrid from '@/app/blog/PostGrid';
import { sortBlogPosts } from '@/lib/blogPosts';
import { BLOG_TOPICS, getBlogTopic, getPostsForTopic } from '@/lib/blogTopics';
import { getAllBlogPosts } from '@/lib/microcms';
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from '@/lib/site';
import { createBreadcrumbJsonLd } from '@/lib/structuredData';
import blogStyles from '../../blog.module.css';
import styles from './topic.module.css';

export const revalidate = 900;

export function generateStaticParams() {
    return BLOG_TOPICS.map((topic) => ({ topic: topic.slug }));
}

export async function generateMetadata({ params }) {
    const topic = getBlogTopic((await params).topic);
    if (!topic) return { robots: { index: false, follow: false } };

    const url = absoluteUrl(`/blog/topics/${topic.slug}`);
    return {
        title: `${topic.title} | HINODE BLOG`,
        description: topic.description,
        alternates: { canonical: url },
        openGraph: {
            title: `${topic.title} | HINODE BLOG`,
            description: topic.description,
            url,
            siteName: SITE_NAME,
            locale: 'ja_JP',
            type: 'website',
            images: [DEFAULT_OG_IMAGE],
        },
    };
}

export default async function BlogTopicPage({ params }) {
    const topic = getBlogTopic((await params).topic);
    if (!topic) notFound();

    const allPosts = sortBlogPosts(await getAllBlogPosts());
    const posts = getPostsForTopic(allPosts, topic.slug);
    const jsonLd = [
        createBreadcrumbJsonLd([
            { name: 'BLOG', path: '/blog' },
            { name: topic.label, path: `/blog/topics/${topic.slug}` },
        ]),
        {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: topic.title,
            itemListElement: posts.map((post, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: post.title,
                url: absoluteUrl(`/blog/${post.id}`),
            })),
        },
    ];

    return (
        <div className={blogStyles.page}>
            <JsonLd data={jsonLd} />

            <header className={styles.topicHeader}>
                <div className={styles.topicInner}>
                    <nav className={styles.breadcrumb} aria-label="パンくずリスト">
                        <Link href="/blog">BLOG</Link><span>/</span><span>{topic.label}</span>
                    </nav>
                    <p className={styles.eyebrow}>{topic.eyebrow}</p>
                    <h1 className={styles.title}>{topic.title}</h1>
                    <p className={styles.description}>{topic.description}</p>
                </div>
            </header>

            <main className={styles.topicMain}>
                <PostGrid posts={posts} />
                <Link href="/blog" className={styles.backLink}>← すべての記事を見る</Link>
            </main>
        </div>
    );
}
