import Link from 'next/link';
import Image from 'next/image';
import styles from '../app/blog/[slug]/post.module.css';

function formatDate(iso) {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}.${m}.${day}`;
}

export default function RelatedPosts({ posts = [] }) {
    if (posts.length === 0) return null;

    return (
        <section className={styles.related}>
            <h2 className={styles.relatedTitle}>関連記事</h2>
            <div className={styles.relatedGrid}>
                {posts.map((post) => (
                    <Link href={`/blog/${post.id}`} key={post.id} className={styles.relatedCard}>
                        {post.thumbnail && (
                            <div className={styles.relatedThumb}>
                                <Image
                                    src={post.thumbnail.url}
                                    alt={post.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 320px"
                                />
                            </div>
                        )}
                        <div className={styles.relatedBody}>
                            <time className={styles.relatedDate}>{formatDate(post.publishedAt)}</time>
                            <h3 className={styles.relatedCardTitle}>{post.title}</h3>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
