import Link from '@/components/SiteLink';
import styles from './for-organizers.module.css';

const SITE_URL = 'https://hinode-run.com';
const CONTACT_HREF = {
    pathname: '/contact',
    query: {
        type: 'work',
        category: '大会・ランニングイベントのWeb制作',
    },
};

export const metadata = {
    title: '大会・ランニングイベントのWeb制作｜HINODE',
    description: 'マラソン大会やランニングイベントの集客に向けた情報設計、Webサイト制作、公開後の運用まで、ランナー目線で支援します。',
    alternates: {
        canonical: `${SITE_URL}/for-organizers`,
    },
    openGraph: {
        title: '大会・ランニングイベントのWeb制作｜HINODE',
        description: 'ランナーに伝わり、参加につながる大会サイトを。情報設計から制作・運用まで支援します。',
        url: `${SITE_URL}/for-organizers`,
        siteName: 'HINODE',
        locale: 'ja_JP',
        type: 'website',
        images: ['/assets/ogp-home.jpg'],
    },
    twitter: {
        card: 'summary_large_image',
        title: '大会・ランニングイベントのWeb制作｜HINODE',
        description: 'ランナーに伝わり、参加につながる大会サイトを。情報設計から制作・運用まで支援します。',
        images: ['/assets/ogp-home.jpg'],
    },
};

const SUPPORT_ITEMS = [
    {
        number: '01',
        title: '参加者募集のための情報設計',
        description: '大会の魅力と、日時・会場・コース・参加条件などの必要情報を整理し、エントリーを検討しやすい導線を設計します。',
    },
    {
        number: '02',
        title: '大会・イベントサイトの制作',
        description: 'スマートフォンでの見やすさを前提に、告知ページから大会公式サイトまで、規模や運営体制に合った形で制作します。',
    },
    {
        number: '03',
        title: '公開後の更新・運用支援',
        description: '募集開始後の情報追加、よくある質問の整理、当日案内や開催後のレポートなど、継続的な更新も支援します。',
    },
];

const CONSULTATION_ITEMS = [
    '新しいマラソン大会やランニングイベントを立ち上げたい',
    '現在の大会サイトが分かりづらく、必要な情報が伝わっていない',
    '自治体の地域資源を生かしたランニングイベントを企画したい',
    '企業のランニング企画を、参加者に届く形で発信したい',
];

export default function ForOrganizersPage() {
    return (
        <section className={styles.page}>
            <div className={styles.container}>
                <div className={styles.hero}>
                    <p className={styles.eyebrow}>FOR ORGANIZERS</p>
                    <h1 className={styles.title}>大会・自治体・企業の方へ</h1>
                    <p className={styles.catch}>
                        ランナーに伝わり、<br className={styles.mobileBreak} />
                        参加につながる大会サイトを。
                    </p>
                    <p className={styles.lead}>
                        HINODEでは、マラソン大会やランニングイベントの企画・運営に携わる方向けに、
                        参加者募集のための情報設計、Webサイト制作、公開後の運用まで支援しています。
                    </p>
                </div>

                <div className={styles.intro}>
                    <h2>Webサイトをつくるだけではありません</h2>
                    <p>
                        ランナーが参加を決めるまでには、コースの特徴、アクセス、制限時間、
                        当日の流れなど、確認したい情報がいくつもあります。
                    </p>
                    <p>
                        ランニングコミュニティを運営するHINODEが、
                        ランナーが知りたい情報と主催者が伝えたい魅力を整理し、
                        参加を検討しやすいサイトをつくります。
                    </p>
                </div>

                <section className={styles.section}>
                    <p className={styles.sectionLabel}>WHAT WE SUPPORT</p>
                    <h2 className={styles.sectionTitle}>支援できること</h2>
                    <div className={styles.supportList}>
                        {SUPPORT_ITEMS.map((item) => (
                            <article key={item.number} className={styles.supportItem}>
                                <span className={styles.number}>{item.number}</span>
                                <div>
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className={styles.section}>
                    <p className={styles.sectionLabel}>CONSULTATION</p>
                    <h2 className={styles.sectionTitle}>こんなご相談から</h2>
                    <ul className={styles.consultationList}>
                        {CONSULTATION_ITEMS.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section className={styles.cta}>
                    <p className={styles.sectionLabel}>CONTACT</p>
                    <h2>まずは、企画の段階からご相談ください</h2>
                    <p>
                        開催時期や現在決まっていることを伺い、必要な支援範囲を一緒に整理します。
                        まだ構想段階でも問題ありません。
                    </p>
                    <Link href={CONTACT_HREF} className={styles.ctaButton}>
                        Web制作について相談する
                    </Link>
                </section>
            </div>
        </section>
    );
}
