import Image from 'next/image';
import { notFound } from 'next/navigation';
import TableOfContents from '@/components/TableOfContents';
import adminStyles from '@/components/admin/admin.module.css';
import { buildBlogContent, formatPostDate, getPostDisplayDate } from '@/lib/blogPosts';
import { getDatabase } from '@/lib/cloudflareEnv';
import { articleToPost, getArticleByPreviewToken } from '@/lib/cms/articles';
import styles from '../../[slug]/post.module.css';

// 下書きの共有プレビュー。URLを知っている人だけが見られる。公開状態に関係なく表示し、検索には載せない
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'プレビュー | HINODE BLOG',
    robots: { index: false, follow: false },
};

export default async function BlogPreviewPage({ params }) {
    const db = await getDatabase();
    const article = db ? await getArticleByPreviewToken(db, (await params).token) : null;
    if (!article) notFound();

    const post = articleToPost(article);
    const { html, toc } = buildBlogContent(post.content);
    const createdDate = post.publishedAt || post.createdAt || '';
    const editedDate = getPostDisplayDate(post) || createdDate;

    return (
        <div className={styles.page}>
            <div className={styles.layout}>
                <article className={styles.article}>
                    <p className={adminStyles.previewBanner}>
                        {article.status === 'published'
                            ? 'プレビュー表示です（この記事は公開中です）。'
                            : 'プレビュー表示です。この記事はまだ公開されていません。'}
                    </p>

                    {post.thumbnail && (
                        <div className={styles.thumbnailWrapper}>
                            <Image
                                src={post.thumbnail.url}
                                alt={post.title}
                                width={post.thumbnail.width || 1200}
                                height={post.thumbnail.height || 630}
                                sizes="(max-width: 840px) 100vw, 720px"
                                className={styles.thumbnail}
                            />
                        </div>
                    )}

                    <div className={styles.articleHeader}>
                        <dl className={styles.dateMeta}>
                            <div className={styles.dateItem}>
                                <dt className={styles.dateLabel}>作成日</dt>
                                <dd className={styles.dateValue}>
                                    <time dateTime={createdDate}>{formatPostDate(createdDate)}</time>
                                </dd>
                            </div>
                            <div className={styles.dateItem}>
                                <dt className={styles.dateLabel}>最終編集日</dt>
                                <dd className={styles.dateValue}>
                                    <time dateTime={editedDate}>{formatPostDate(editedDate)}</time>
                                </dd>
                            </div>
                        </dl>
                        <h1 className={styles.title}>{post.title}</h1>
                    </div>

                    <TableOfContents items={toc} />
                    <div className={styles.content} dangerouslySetInnerHTML={{ __html: html }} />
                </article>
            </div>
        </div>
    );
}
