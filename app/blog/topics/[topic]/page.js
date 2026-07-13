import Image from 'next/image';
import Link from '@/components/SiteLink';
import { notFound } from 'next/navigation';
import { getAllBlogPosts } from '../../../../lib/microcms';
import { formatPostDate, getPostDisplayDate, sortBlogPosts } from '../../../../lib/blogPosts';
import { BLOG_TOPICS, getBlogTopic, getPostsForTopic } from '../../../../lib/blogTopics';
import blogStyles from '../../blog.module.css';
import styles from './topic.module.css';

const SITE_URL = 'https://hinode-run.com';

export const revalidate = 900;

export function generateStaticParams() {
    return BLOG_TOPICS.map((topic) => ({ topic: topic.slug }));
}

export function generateMetadata({ params }) {
    const topic = getBlogTopic(params.topic);
    if (!topic) return { robots: { index: false, follow: false } };

    const url = `${SITE_URL}/blog/topics/${topic.slug}`;
    return {
        title: `${topic.title} | HINODE BLOG`,
        description: topic.description,
        alternates: { canonical: url },
        openGraph: {
            title: `${topic.title} | HINODE BLOG`,
            description: topic.description,
            url,
            siteName: 'HINODE',
            locale: 'ja_JP',
            type: 'website',
            images: ['/assets/ogp-home.jpg'],
        },
    };
}

export default async function BlogTopicPage({ params }) {
    const topic = getBlogTopic(params.topic);
    if (!topic) notFound();

    const allPosts = sortBlogPosts(await getAllBlogPosts());
    const posts = getPostsForTopic(allPosts, topic.slug);
    const url = `${SITE_URL}/blog/topics/${topic.slug}`;
    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'ホーム', item: SITE_URL },
                { '@type': 'ListItem', position: 2, name: 'BLOG', item: `${SITE_URL}/blog` },
                { '@type': 'ListItem', position: 3, name: topic.label, item: url },
            ],
        },
        {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: topic.title,
            itemListElement: posts.map((post, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: post.title,
                url: `${SITE_URL}/blog/${post.id}`,
            })),
        },
    ];

    return (
        <div className={blogStyles.page}>
            {jsonLd.map((entry, index) => (
                <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }} />
            ))}

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
                <div className={blogStyles.grid}>
                    {posts.map((post) => (
                        <Link href={`/blog/${post.id}`} key={post.id} className={blogStyles.card}>
                            {post.thumbnail && (
                                <div className={blogStyles.thumbnailWrapper}>
                                    <Image
                                        src={post.thumbnail.url}
                                        alt={post.title}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 360px"
                                        className={blogStyles.thumbnail}
                                    />
                                </div>
                            )}
                            <div className={blogStyles.content}>
                                <time className={blogStyles.date} dateTime={getPostDisplayDate(post)}>
                                    {formatPostDate(getPostDisplayDate(post))}
                                </time>
                                <h2 className={blogStyles.title}>{post.title}</h2>
                                {post.description && <p className={blogStyles.excerpt}>{post.description}</p>}
                            </div>
                        </Link>
                    ))}
                </div>
                <Link href="/blog" className={styles.backLink}>← すべての記事を見る</Link>
            </main>
        </div>
    );
}
