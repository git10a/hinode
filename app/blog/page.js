import Link from 'next/link';
import Image from 'next/image';
import { client } from '../../lib/microcms';
import styles from './blog.module.css';

export const revalidate = 60;

export const metadata = {
    title: 'BLOG | HINODE',
    description: '朝のランニングの良さを、日々伝えるHINODEのブログ。活動ログや朝ランにまつわる考えを発信。',
};

async function getBlogPosts() {
    try {
        const data = await client.get({
            endpoint: 'blogs',
            queries: {
                fields: 'id,title,publishedAt,thumbnail,description',
                limit: 20,
            },
        });
        return data.contents;
    } catch (error) {
        console.error('Failed to fetch blog posts:', error);
        return [];
    }
}

function formatDate(iso) {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}.${m}.${day}`;
}

export default async function BlogPage() {
    const posts = await getBlogPosts();
    const [featured, ...rest] = posts;

    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.heroImageWrapper}>
                    <Image
                        src="/assets/Toyosu.jpg"
                        alt=""
                        fill
                        priority
                        sizes="100vw"
                        className={styles.heroImage}
                    />
                    <div className={styles.heroOverlay} aria-hidden="true" />
                </div>

                <div className={styles.heroInner}>
                    <div className={styles.heroText}>
                        <h1 className={styles.pageTitle}>BLOG</h1>
                        <p className={styles.subtitle}>朝のランニングの良さを、日々伝えるHINODEのブログ</p>
                    </div>

                    {featured && (
                        <Link href={`/blog/${featured.id}`} className={styles.featured}>
                            {featured.thumbnail && (
                                <div className={styles.featuredThumb}>
                                    <Image
                                        src={featured.thumbnail.url}
                                        alt={featured.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 220px"
                                        className={styles.featuredImage}
                                    />
                                </div>
                            )}
                            <div className={styles.featuredBody}>
                                <span className={styles.featuredLabel}>FEATURED</span>
                                <h2 className={styles.featuredTitle}>{featured.title}</h2>
                                {featured.description && (
                                    <p className={styles.featuredDesc}>{featured.description}</p>
                                )}
                                <time className={styles.featuredDate}>{formatDate(featured.publishedAt)}</time>
                            </div>
                        </Link>
                    )}
                </div>
            </section>

            <section className={styles.listSection}>
                {posts.length === 0 ? (
                    <p className={styles.empty}>記事がまだありません。</p>
                ) : rest.length === 0 ? null : (
                    <div className={styles.grid}>
                        {rest.map((post) => (
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
                                    <time className={styles.date}>{formatDate(post.publishedAt)}</time>
                                    <h2 className={styles.title}>{post.title}</h2>
                                    {post.description && (
                                        <p className={styles.excerpt}>{post.description}</p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
