import Image from 'next/image';
import Link from '@/components/SiteLink';
import { notFound } from 'next/navigation';
import { getBlogPostById, getAllBlogPosts } from '../../../lib/microcms';
import { getUpcomingGroupEvents } from '../../../lib/strava';
import { formatPostDate, getPostDisplayDate, sortBlogPosts, buildBlogContent } from '../../../lib/blogPosts';
import { getBlogRunContext, getUpcomingEventForRunContext } from '../../../lib/blogRunContext';
import PostSidebar from '../../../components/PostSidebar';
import RelatedPosts from '../../../components/RelatedPosts';
import PostBottomStrip from '../../../components/PostBottomStrip';
import TableOfContents from '../../../components/TableOfContents';
import styles from './post.module.css';

export const revalidate = 900;
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
    const post = await getBlogPostById(params.slug);

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

export default async function BlogPost({ params }) {
    const [post, allPosts, upcomingEvents] = await Promise.all([
        getBlogPostById(params.slug),
        getAllBlogPosts(),
        getUpcomingGroupEvents(),
    ]);

    if (!post || !post.publishedAt) {
        notFound();
    }

    const relatedPosts = sortBlogPosts(allPosts).filter((p) => p.id !== post.id).slice(0, 3);
    const nextEvent = upcomingEvents[0] || null;
    const runContext = getBlogRunContext(post);
    const contextEvent = getUpcomingEventForRunContext(upcomingEvents, runContext);
    const { html: contentHtml, toc } = buildBlogContent(post.content);
    const createdDate = post.publishedAt || post.createdAt || '';
    const editedDate = getPostDisplayDate(post) || createdDate;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description || `${post.title}の記事です。`,
        image: post.thumbnail ? [post.thumbnail.url] : [],
        datePublished: post.publishedAt,
        dateModified: getPostDisplayDate(post),
        author: { '@type': 'Organization', name: 'HINODE' },
    };

    return (
        <div className={styles.page}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className={styles.layout}>
                <article className={styles.article}>
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

                    {post.content ? (
                        <div
                            className={styles.content}
                            dangerouslySetInnerHTML={{ __html: contentHtml }}
                        />
                    ) : (
                        <div className={styles.content}>
                            <p>本文がありません。</p>
                        </div>
                    )}

                    <div className={styles.inlineCta}>
                        <p className={styles.inlineCtaLead}>
                            <span className={styles.inlineCtaIcon} aria-hidden="true">☼</span>
                            {runContext ? `${runContext.shortName}に参加してみる` : '参加してみる'}
                        </p>
                        {runContext && (
                            <div className={styles.inlineCtaMetaList} aria-label={`${runContext.shortName}の開催情報`}>
                                <span className={styles.inlineCtaMetaItem}>{runContext.regularLabel}</span>
                                <span className={styles.inlineCtaMetaItem}>{runContext.meetingPlace}</span>
                                <span className={styles.inlineCtaMetaItem}>{runContext.distance}</span>
                            </div>
                        )}
                        <p className={styles.inlineCtaSub}>
                            {runContext ? (
                                <>
                                    {runContext.place}は、HINODEが毎週走っているコースです。<br />
                                    初めての方は、集合場所と当日の流れだけ先に見ておけば大丈夫です。
                                </>
                            ) : (
                                <>
                                    気になった方は、開催日程を見てください。<br />
                                    初めての方は、当日の流れも先に確認できます。
                                </>
                            )}
                        </p>
                        <div className={styles.inlineCtaActions}>
                            <Link href={runContext?.scheduleHref || '/schedule'} className={styles.inlineCtaBtnPrimary}>
                                {runContext ? `${runContext.place}の開催日程を見る →` : '開催日程を見る →'}
                            </Link>
                            <Link href="/first-run" className={styles.inlineCtaBtnSecondary}>
                                初参加ガイドを見る →
                            </Link>
                            {runContext ? (
                                <Link href={runContext.courseHref} className={styles.inlineCtaBtnTertiary}>
                                    コースガイドを見る →
                                </Link>
                            ) : (
                                <a
                                    href="https://www.strava.com/clubs/1772485"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.inlineCtaBtnTertiary}
                                >
                                    Stravaクラブを見る →
                                </a>
                            )}
                        </div>
                    </div>
                </article>

                <PostSidebar nextEvent={nextEvent} runContext={runContext} contextEvent={contextEvent} />
            </div>

            <RelatedPosts posts={relatedPosts} />
            <PostBottomStrip runContext={runContext} />
        </div>
    );
}
