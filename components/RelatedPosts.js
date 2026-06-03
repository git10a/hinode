import Link from 'next/link';
import Image from 'next/image';
import { formatPostDate, getPostDisplayDate } from '../lib/blogPosts';
import styles from '../app/blog/[slug]/post.module.css';

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
                            <time className={styles.relatedDate} dateTime={getPostDisplayDate(post)}>
                                {formatPostDate(getPostDisplayDate(post))}
                            </time>
                            <h3 className={styles.relatedCardTitle}>{post.title}</h3>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
