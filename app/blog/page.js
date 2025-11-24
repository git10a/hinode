import Link from 'next/link';
import { client } from '../../lib/microcms';
import styles from './blog.module.css';

// Revalidate every hour
export const revalidate = 3600;

export const metadata = {
    title: 'BLOG | HINODE',
    description: 'HINODEの活動ログや哲学を発信。',
};

async function getBlogPosts() {
    try {
        const data = await client.get({
            endpoint: 'blogs',
            queries: {
                fields: 'id,title,publishedAt,thumbnail',
                limit: 10,
            },
        });
        return data.contents;
    } catch (error) {
        console.error('Failed to fetch blog posts:', error);
        return [];
    }
}

export default async function BlogPage() {
    const posts = await getBlogPosts();

    return (
        <div className="container" style={{ paddingBottom: '4rem', paddingTop: '8rem' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '4rem', color: '#111' }}>BLOG</h1>

            {posts.length === 0 ? (
                <p style={{ textAlign: 'center' }}>記事がまだありません。</p>
            ) : (
                <div className={styles.grid}>
                    {posts.map((post) => (
                        <Link href={`/blog/${post.id}`} key={post.id} className={styles.card}>
                            {post.thumbnail && (
                                <div className={styles.thumbnailWrapper}>
                                    <img src={post.thumbnail.url} alt={post.title} className={styles.thumbnail} />
                                </div>
                            )}
                            <div className={styles.content}>
                                <time className={styles.date}>{new Date(post.publishedAt).toLocaleDateString('ja-JP')}</time>
                                <h2 className={styles.title}>{post.title}</h2>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
