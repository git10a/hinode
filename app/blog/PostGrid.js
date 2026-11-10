import Image from 'next/image';
import Link from '@/components/SiteLink';
import { formatPostDate, getPostDisplayDate } from '@/lib/blogPosts';
import styles from './blog.module.css';

// ブログ一覧・トピック別一覧で共通の記事カードグリッド
export default function PostGrid({ posts }) {
    return (
        <div className={styles.grid}>
            {posts.map((post) => (
                <Link href={`/blog/${post.id}`} key={post.id} className={styles.card}>
                    {post.thumbnail && (
                        <div className={styles.thumbnailWrapper}>
                            <Image
                                src={post.thumbnail.url}
                                alt={post.title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 360px"
                                className={styles.thumbnail}
                            />
                        </div>
                    )}
                    <div className={styles.content}>
                        <time className={styles.date} dateTime={getPostDisplayDate(post)}>
                            {formatPostDate(getPostDisplayDate(post))}
                        </time>
                        <h2 className={styles.title}>{post.title}</h2>
                        {post.description && (
                            <p className={styles.excerpt}>{post.description}</p>
                        )}
                    </div>
                </Link>
            ))}
        </div>
    );
}
