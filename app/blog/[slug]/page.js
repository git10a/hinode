import Link from 'next/link';
import { client } from '../../../lib/microcms';
import styles from './post.module.css';
import { notFound } from 'next/navigation';

export const revalidate = 60;

function getBlogCtaClosing(post) {
    const haystack = `${post.title || ''} ${post.description || ''}`.toLowerCase();
    if (haystack.includes('皇居') || haystack.includes('kokyo')) {
        return '次の水曜6:30、桔梗門前で会いましょう。';
    }
    if (haystack.includes('目黒') || haystack.includes('meguro')) {
        return '次の木曜6:30、中目黒スタバ蔦屋書店前で会いましょう。';
    }
    if (haystack.includes('代々木') || haystack.includes('yoyogi')) {
        return '次の日曜7:30、原宿時計塔で会いましょう。';
    }
    return null;
}

export async function generateMetadata({ params }) {
    const post = await getBlogPost(params.slug);

    // 記事が存在しない場合（下書きまたは削除済み）は noindex を返す
    if (!post) {
        return {
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    // publishedAt がない記事（下書き状態）も noindex
    if (!post.publishedAt) {
        return {
            title: post.title,
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const url = `https://hinode-run.com/blog/${params.slug}`;

    return {
        title: `${post.title} | HINODE BLOG`,
        description: post.description || `${post.title}の記事です。`,
        openGraph: {
            title: post.title,
            description: post.description || `${post.title}の記事です。`,
            url: url,
            siteName: 'HINODE',
            type: 'article',
            images: post.thumbnail ? [
                {
                    url: post.thumbnail.url,
                    width: post.thumbnail.width,
                    height: post.thumbnail.height,
                }
            ] : [],
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
        return data.contents.map((post) => ({
            slug: post.id,
        }));
    } catch (e) {
        return [];
    }
}

async function getBlogPost(id) {
    try {
        const data = await client.get({
            endpoint: 'blogs',
            contentId: id,
        });
        return data;
    } catch (error) {
        return null;
    }
}

export default async function BlogPost({ params }) {
    const post = await getBlogPost(params.slug);

    // 記事が存在しない、または publishedAt がない（下書き）場合は 404
    if (!post || !post.publishedAt) {
        notFound();
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "image": post.thumbnail ? [post.thumbnail.url] : [],
        "datePublished": post.publishedAt,
        "dateModified": post.updatedAt,
        "author": {
            "@type": "Organization",
            "name": "HINODE"
        }
    };

    return (
        <article className={styles.container}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className={styles.header}>
                <time className={styles.date}>{new Date(post.publishedAt).toLocaleDateString('ja-JP')}</time>
                <h1 className={styles.title}>{post.title}</h1>
            </div>

            {post.thumbnail && (
                <div className={styles.thumbnailWrapper}>
                    <img src={post.thumbnail.url} alt={post.title} className={styles.thumbnail} />
                </div>
            )}

            {post.content ? (
                <div
                    className={styles.content}
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            ) : (
                <div className={styles.content}>
                    <p>本文がありません。MicroCMSで「本文」フィールド（API ID: content）に入力があるか確認してください。</p>
                </div>
            )}

            <aside className={styles.endCta}>
                <h2 className={styles.endCtaTitle}>次の開催は、今週です。</h2>
                <p className={styles.endCtaText}>
                    HINODEは毎週決まった曜日・時間に、皇居・目黒川・代々木公園で開催しています。予約不要・参加費無料。
                </p>
                {getBlogCtaClosing(post) && (
                    <p className={styles.endCtaText}>{getBlogCtaClosing(post)}</p>
                )}
                <Link href="/schedule" className={styles.endCtaBtn}>
                    開催日程を見る →
                </Link>
            </aside>
        </article>
    );
}
