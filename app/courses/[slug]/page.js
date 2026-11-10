import Image from 'next/image';
import Link from '@/components/SiteLink';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import COURSE_GUIDES, { getCourseGuide, getRelatedCourses } from '@/lib/courseGuides';
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from '@/lib/site';
import { createBreadcrumbJsonLd, createFaqJsonLd } from '@/lib/structuredData';
import styles from '../courses.module.css';

export function generateStaticParams() {
    return COURSE_GUIDES.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({ params }) {
    const course = getCourseGuide((await params).slug);
    if (!course) return {};

    const url = absoluteUrl(`/courses/${course.slug}`);
    return {
        title: `${course.seoTitle} | HINODE`,
        description: course.seoDescription,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: course.seoTitle,
            description: course.seoDescription,
            url,
            siteName: SITE_NAME,
            locale: 'ja_JP',
            type: 'article',
            images: [course.image || DEFAULT_OG_IMAGE],
        },
    };
}

function createJsonLd(course) {
    return [
        createBreadcrumbJsonLd([
            { name: '朝ランコースガイド', path: '/courses' },
            { name: course.name, path: `/courses/${course.slug}` },
        ]),
        createFaqJsonLd(course.faq.map((item) => ({ question: item.q, answer: item.a }))),
    ];
}

export default async function CourseDetailPage({ params }) {
    const course = getCourseGuide((await params).slug);
    if (!course) notFound();

    const related = getRelatedCourses(course);

    return (
        <section>
            <JsonLd data={createJsonLd(course)} />

            <section className={styles.hero}>
                <div className="container">
                    <span className={styles.areaChip}>{course.area}</span>
                    <h1 className={styles.title}>{course.seoTitle.split('｜')[0]}</h1>
                    <p className={styles.catchText}>{course.catch}</p>
                </div>
            </section>

            <section className={`${styles.section} ${styles.sectionAlt}`}>
                <div className={styles.narrowContainer}>
                    <nav className={styles.breadcrumb} aria-label="パンくずリスト">
                        <Link href="/">ホーム</Link>
                        {' / '}
                        <Link href="/courses">朝ランコースガイド</Link>
                        {' / '}
                        {course.name}
                    </nav>

                    <h2 className={styles.sectionTitle}>コースの基本情報</h2>
                    <div className={styles.statsCard}>
                        <table className={styles.statsTable}>
                            <tbody>
                                {course.stats.map((stat) => (
                                    <tr key={stat.label}>
                                        <th scope="row">{stat.label}</th>
                                        <td>{stat.value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.narrowContainer}>
                    <h2 className={styles.sectionTitle}>コースについて</h2>
                    {course.description.map((paragraph) => (
                        <p key={paragraph.slice(0, 16)} className={styles.text}>{paragraph}</p>
                    ))}
                </div>
            </section>

            <section className={`${styles.section} ${styles.sectionAlt}`}>
                <div className={styles.narrowContainer}>
                    <h2 className={styles.sectionTitle}>朝ラン・日の出のポイント</h2>
                    {course.morning.map((paragraph) => (
                        <p key={paragraph.slice(0, 16)} className={styles.text}>{paragraph}</p>
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.narrowContainer}>
                    {course.hinode ? (
                        <div className={styles.hinodeBox}>
                            <h2 className={styles.hinodeBoxTitle}>このコースでHINODEが毎週走っています</h2>
                            <p className={styles.hinodeBoxSchedule}>{course.hinode.schedule}</p>
                            <p className={styles.hinodeBoxMeeting}>{course.hinode.meeting}</p>
                            <p className={styles.hinodeBoxNote}>
                                {course.hinode.note}
                                予約不要・参加無料・1人参加歓迎です。背中に「HINODE」と書かれた黒いTシャツを着た運営メンバーが目印です。
                            </p>
                            <div className={styles.hinodeBoxLinks}>
                                <Link href="/first-run" className={styles.primaryButton}>初めての方へ</Link>
                                <Link href="/schedule" className={styles.secondaryButton}>開催日程を見る</Link>
                            </div>
                            {course.image && (
                                <div className={styles.mapImageWrapper}>
                                    <Image
                                        src={course.image}
                                        alt={`HINODEの${course.name}ランニングコースマップ`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 720px"
                                        className={styles.mapImage}
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={styles.hinodeBox}>
                            <h2 className={styles.hinodeBoxTitle}>朝、誰かと走りたくなったら</h2>
                            <p className={styles.hinodeBoxNote}>
                                このコースでの定期開催はありませんが、HINODEは皇居・目黒川・代々木公園で毎週朝ランを開催しています。
                                予約不要・参加無料・1人参加歓迎。ひとりで続かない朝は、集まる朝に変えられます。
                            </p>
                            <div className={styles.hinodeBoxLinks}>
                                <Link href="/first-run" className={styles.primaryButton}>初めての方へ</Link>
                                <Link href="/schedule" className={styles.secondaryButton}>開催日程を見る</Link>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <section className={`${styles.section} ${styles.sectionAlt}`}>
                <div className={styles.narrowContainer}>
                    <h2 className={styles.sectionTitle}>よくある質問</h2>
                    <div className={styles.faqList}>
                        {course.faq.map((item) => (
                            <div key={item.q} className={styles.faqItem}>
                                <h3 className={styles.faqQuestion}>{item.q}</h3>
                                <p className={styles.faqAnswer}>{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {related.length > 0 && (
                <section className={styles.section}>
                    <div className={styles.contentContainer}>
                        <h2 className={styles.sectionTitle}>近くのおすすめコース</h2>
                        <div className={styles.relatedGrid}>
                            {related.map((relatedCourse) => (
                                <Link
                                    key={relatedCourse.slug}
                                    href={`/courses/${relatedCourse.slug}`}
                                    className={styles.courseCard}
                                >
                                    <p className={styles.courseCardArea}>{relatedCourse.area}</p>
                                    <h3 className={styles.courseCardTitle}>{relatedCourse.name}</h3>
                                    <p className={styles.courseCardCatch}>{relatedCourse.catch}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </section>
    );
}
