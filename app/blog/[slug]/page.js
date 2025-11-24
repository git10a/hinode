import { client } from '../../../lib/microcms';
import styles from './post.module.css';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

export async function generateMetadata({ params }) {
    const post = await getBlogPost(params.slug);
    if (!post) return {};

    return {
        title: `${post.title} | HINODE BLOG`,
        description: post.description || `${post.title}の記事です。`,
        openGraph: {
            title: post.title,
            description: post.description,
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

    if (!post) {
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
        </article>
    );
}
