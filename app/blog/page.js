import Link from 'next/link';
import Image from 'next/image';
import { client } from '../../lib/microcms';
import styles from './blog.module.css';

export const revalidate = 60;

export const metadata = {
    title: 'BLOG | HINODE',
    description: '朝のランニングの良さを、日々伝えるHINODEのブログ。活動ログや朝ランにまつわる考えを発信。',
};

const BLOG_CATEGORIES = [
    {
        id: 'course',
        label: 'コース紹介',
        keywords: ['コース', '皇居', '目黒川', '代々木', '公園', 'ルート', 'スポット', '日の出'],
    },
    {
        id: 'beginner',
        label: '初心者向け',
        keywords: ['初参加', '初心者', '初めて', 'はじめて', '1人', '一人', '不安', '参加方法'],
    },
    {
        id: 'gear',
        label: '装備・施設',
        keywords: ['装備', '持ち物', '荷物', 'ウェア', 'シューズ', 'シャワー', 'ロッカー', '銭湯', '施設'],
    },
];

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

function normalizeText(value = '') {
    return value.toLowerCase().trim();
}

function getPostSearchText(post) {
    return normalizeText(`${post.title || ''} ${post.description || ''}`);
}

function getPostCategoryIds(post) {
    const text = getPostSearchText(post);
    return BLOG_CATEGORIES
        .filter((category) => category.keywords.some((keyword) => text.includes(normalizeText(keyword))))
        .map((category) => category.id);
}

function buildBlogHref({ category = 'all', q = '' }) {
    const params = new URLSearchParams();
    if (category !== 'all') params.set('category', category);
    if (q) params.set('q', q);
    const query = params.toString();
    return query ? `/blog?${query}` : '/blog';
}

export default async function BlogPage({ searchParams = {} }) {
    const posts = await getBlogPosts();
    const requestedCategory = typeof searchParams.category === 'string' ? searchParams.category : 'all';
    const activeCategory = BLOG_CATEGORIES.some((category) => category.id === requestedCategory)
        ? requestedCategory
        : 'all';
    const rawSearchQuery = typeof searchParams.q === 'string' ? searchParams.q.trim() : '';
    const searchQuery = normalizeText(rawSearchQuery);
    const filteredPosts = posts.filter((post) => {
        const matchesCategory = activeCategory === 'all' || getPostCategoryIds(post).includes(activeCategory);
        const matchesSearch = !searchQuery || getPostSearchText(post).includes(searchQuery);
        return matchesCategory && matchesSearch;
    });
    const [featured, ...rest] = filteredPosts;
    const activeCategoryLabel = activeCategory === 'all'
        ? 'すべて'
        : BLOG_CATEGORIES.find((category) => category.id === activeCategory)?.label;

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

            <section className={styles.browseSection} aria-labelledby="blog-browse-title">
                <div className={styles.browseInner}>
                    <div className={styles.browseHeader}>
                        <p className={styles.browseKicker}>BROWSE</p>
                        <h2 id="blog-browse-title" className={styles.browseTitle}>読みたい記事を探す</h2>
                    </div>
                    <form action="/blog" className={styles.searchForm}>
                        {activeCategory !== 'all' && (
                            <input type="hidden" name="category" value={activeCategory} />
                        )}
                        <label htmlFor="blog-search" className={styles.searchLabel}>
                            キーワード
                        </label>
                        <input
                            id="blog-search"
                            name="q"
                            type="search"
                            defaultValue={rawSearchQuery}
                            placeholder="キーワードで探す"
                            className={styles.searchInput}
                        />
                        <button type="submit" className={styles.searchButton}>
                            <svg viewBox="0 0 24 24" className={styles.searchIcon} aria-hidden="true">
                                <circle cx="11" cy="11" r="6" />
                                <path d="M16 16l4 4" />
                            </svg>
                            検索
                        </button>
                    </form>
                    <div className={styles.categoryList} aria-label="記事カテゴリ">
                        <Link
                            href={buildBlogHref({ category: 'all', q: rawSearchQuery })}
                            className={`${styles.categoryChip} ${activeCategory === 'all' ? styles.categoryChipActive : ''}`}
                        >
                            すべて
                        </Link>
                        {BLOG_CATEGORIES.map((category) => (
                            <Link
                                key={category.id}
                                href={buildBlogHref({ category: category.id, q: rawSearchQuery })}
                                className={`${styles.categoryChip} ${activeCategory === category.id ? styles.categoryChipActive : ''}`}
                            >
                                {category.label}
                            </Link>
                        ))}
                    </div>
                    {(activeCategory !== 'all' || rawSearchQuery) && (
                        <div className={styles.activeFilter}>
                            <span>{activeCategoryLabel}</span>
                            {rawSearchQuery && <span>「{rawSearchQuery}」</span>}
                            <Link href="/blog" className={styles.clearFilter}>条件をクリア</Link>
                        </div>
                    )}
                </div>
            </section>

            <section className={styles.listSection}>
                {posts.length === 0 ? (
                    <p className={styles.empty}>記事がまだありません。</p>
                ) : filteredPosts.length === 0 ? (
                    <p className={styles.empty}>条件に合う記事が見つかりませんでした。</p>
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
