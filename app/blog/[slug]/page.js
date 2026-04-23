import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { client } from '../../../lib/microcms';
import { getUpcomingGroupEvents } from '../../../lib/strava';
import PostSidebar from '../../../components/PostSidebar';
import RelatedPosts from '../../../components/RelatedPosts';
import PostBottomStrip from '../../../components/PostBottomStrip';
import styles from './post.module.css';

export const revalidate = 60;

export async function generateMetadata({ params }) {
    const post = await getBlogPost(params.slug);

    if (!post) {
        return { robots: { index: false, follow: false } };
    }
    if (!post.publishedAt) {
        return { title: post.title, robots: { index: false, follow: false } };
    }

    const url = `https://hinode-run.com/blog/${params.slug}`;

    return {
        title: `${post.title} | HINODE BLOG`,
        description: post.description || `${post.title}の記事です。`,
        openGraph: {
            title: post.title,
            description: post.description || `${post.title}の記事です。`,
            url,
            siteName: 'HINODE',
            type: 'article',
            images: post.thumbnail ? [{
                url: post.thumbnail.url,
                width: post.thumbnail.width,
                height: post.thumbnail.height,
            }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.description || `${post.title}の記事です。`,
            images: post.thumbnail ? [post.thumbnail.url] : [],
        },
    };
}

export async function generateStaticParams() {
    try {
        const data = await client.get({ endpoint: 'blogs', queries: { limit: 100 } });
        return data.contents.map((post) => ({ slug: post.id }));
    } catch (e) {
        return [];
    }
}

async function getBlogPost(id) {
    try {
        return await client.get({ endpoint: 'blogs', contentId: id });
    } catch (error) {
        return null;
    }
}

async function getRelatedPosts(currentId, limit = 3) {
    try {
        const data = await client.get({
            endpoint: 'blogs',
            queries: {
                fields: 'id,title,publishedAt,thumbnail',
                limit: limit + 1,
            },
        });
        return data.contents.filter((p) => p.id !== currentId).slice(0, limit);
    } catch (e) {
        return [];
    }
}

function formatJapaneseDate(iso) {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}.${m}.${day}`;
}

export default async function BlogPost({ params }) {
    const post = await getBlogPost(params.slug);

    if (!post || !post.publishedAt) {
        notFound();
    }

    const [relatedPosts, upcomingEvents] = await Promise.all([
        getRelatedPosts(post.id),
        getUpcomingGroupEvents(),
    ]);
    const nextEvent = upcomingEvents[0] || null;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        image: post.thumbnail ? [post.thumbnail.url] : [],
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        author: { '@type': 'Organization', name: 'HINODE' },
    };

    return (
        <div className={styles.page}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <nav className={styles.breadcrumb} aria-label="breadcrumb">
                <Link href="/" className={styles.breadcrumbLink}>HOME</Link>
                <span className={styles.breadcrumbSep}>›</span>
                <Link href="/blog" className={styles.breadcrumbLink}>BLOG</Link>
            </nav>

            <div className={styles.layout}>
                <article className={styles.article}>
                    <div className={styles.articleHeader}>
                        <time className={styles.date}>{formatJapaneseDate(post.publishedAt)}</time>
                        <h1 className={styles.title}>{post.title}</h1>
                        {post.description && (
                            <p className={styles.description}>{post.description}</p>
                        )}
                    </div>

                    {post.thumbnail && (
                        <div className={styles.thumbnailWrapper}>
                            <Image
                                src={post.thumbnail.url}
                                alt={post.title}
                                width={post.thumbnail.width}
                                height={post.thumbnail.height}
                                sizes="(max-width: 840px) 100vw, 720px"
                                priority
                                className={styles.thumbnail}
                            />
                        </div>
                    )}

                    {post.content ? (
                        <div
                            className={styles.content}
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    ) : (
                        <div className={styles.content}>
                            <p>本文がありません。</p>
                        </div>
                    )}

                    <div className={styles.inlineCta}>
                        <p className={styles.inlineCtaLead}>
                            <span className={styles.inlineCtaIcon} aria-hidden="true">☼</span>
                            参加してみる
                        </p>
                        <p className={styles.inlineCtaSub}>
                            気になった方は、開催日程を見てください。<br />
                            参加人数や雰囲気はStravaでも見られます。
                        </p>
                        <div className={styles.inlineCtaActions}>
                            <Link href="/schedule" className={styles.inlineCtaBtnPrimary}>
                                開催日程を見る →
                            </Link>
                            <a
                                href="https://www.strava.com/clubs/1772485"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.inlineCtaBtnSecondary}
                            >
                                Stravaクラブを見る →
                            </a>
                        </div>
                    </div>
                </article>

                <PostSidebar nextEvent={nextEvent} />
            </div>

            <RelatedPosts posts={relatedPosts} />
            <PostBottomStrip />
        </div>
    );
}
