import Link from '@/components/SiteLink';
import COURSE_GUIDES from '../../lib/courseGuides';
import styles from './courses.module.css';

const SITE_URL = 'https://hinode-run.com';

export const metadata = {
    title: '東京の朝ランコースガイド｜皇居・代々木公園・目黒川など10コース | HINODE',
    description:
        '東京の朝ランにおすすめのランニングコースを10コース紹介。皇居・代々木公園・目黒川・駒沢公園・神宮外苑など、距離・路面・ロッカー・日の出ポイントを朝ラン目線で解説します。',
    alternates: {
        canonical: `${SITE_URL}/courses`,
    },
    openGraph: {
        title: '東京の朝ランコースガイド | HINODE',
        description:
            '皇居・代々木公園・目黒川など、東京の朝ランにおすすめのコースを距離・設備・日の出ポイントつきで解説。',
        url: `${SITE_URL}/courses`,
        siteName: 'HINODE',
        locale: 'ja_JP',
        type: 'website',
    },
};

export default function CoursesPage() {
    const hinodeCourses = COURSE_GUIDES.filter((course) => course.hinode);
    const otherCourses = COURSE_GUIDES.filter((course) => !course.hinode);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: '東京の朝ランコースガイド',
        description: '東京の朝ランにおすすめのランニングコース一覧',
        itemListElement: COURSE_GUIDES.map((course, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: `${course.name}のランニングコース`,
            url: `${SITE_URL}/courses/${course.slug}`,
        })),
    };

    return (
        <section>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <section className={styles.hero}>
                <div className="container">
                    <p className={styles.eyebrow}>Tokyo Morning Run</p>
                    <h1 className={styles.title}>東京の朝ランコースガイド</h1>
                    <p className={styles.introText}>
                        朝の東京は、昼間とはまったく別の街です。
                        信号のない皇居、土の上を走れる代々木公園、川面に朝日が映る目黒川。
                        HINODEが実際に走っているコースを中心に、東京の朝ランにおすすめのコースを距離・設備・日の出ポイントつきでまとめました。
                    </p>
                </div>
            </section>

            <section className={`${styles.section} ${styles.sectionAlt}`}>
                <div className={styles.contentContainer}>
                    <h2 className={styles.sectionTitle}>HINODEが毎週走っているコース</h2>
                    <p className={styles.text}>
                        毎週のグループランで実際に走っているコースです。集合場所に来れば、予約不要・無料で誰でも一緒に走れます。
                    </p>
                    <div className={styles.courseGrid}>
                        {hinodeCourses.map((course) => (
                            <Link key={course.slug} href={`/courses/${course.slug}`} className={styles.courseCard}>
                                <span className={styles.hinodeBadge}>{course.hinode.schedule}</span>
                                <p className={styles.courseCardArea}>{course.area}</p>
                                <h3 className={styles.courseCardTitle}>{course.name}</h3>
                                <p className={styles.courseCardCatch}>{course.catch}</p>
                                <p className={styles.courseCardMeta}>{course.stats[0].value}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.contentContainer}>
                    <h2 className={styles.sectionTitle}>朝ランにおすすめの東京のコース</h2>
                    <p className={styles.text}>
                        定期開催はしていませんが、朝走るのにおすすめのコースです。
                    </p>
                    <div className={styles.courseGrid}>
                        {otherCourses.map((course) => (
                            <Link key={course.slug} href={`/courses/${course.slug}`} className={styles.courseCard}>
                                <p className={styles.courseCardArea}>{course.area}</p>
                                <h3 className={styles.courseCardTitle}>{course.name}</h3>
                                <p className={styles.courseCardCatch}>{course.catch}</p>
                                <p className={styles.courseCardMeta}>{course.stats[0].value}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className={`${styles.section} ${styles.ctaSection} ${styles.sectionAlt}`}>
                <div className={styles.narrowContainer}>
                    <p className={styles.ctaText}>
                        ひとりで走り出すのが難しい朝は、誰かと約束するのがいちばんの近道です。<br />
                        HINODEは予約不要・参加無料・1人参加歓迎の朝ランコミュニティです。
                    </p>
                    <div className={styles.hinodeBoxLinks} style={{ justifyContent: 'center' }}>
                        <Link href="/first-run" className={styles.primaryButton}>初めての方へ</Link>
                        <Link href="/schedule" className={styles.secondaryButton}>開催日程を見る</Link>
                    </div>
                </div>
            </section>
        </section>
    );
}
