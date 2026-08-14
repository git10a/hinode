import Link from '@/components/SiteLink';
import styles from './for-organizers.module.css';

const SITE_URL = 'https://hinode-run.com';
const CONTACT_HREF = {
    pathname: '/contact',
    query: {
        type: 'work',
        category: 'HINODE拠点導入',
    },
};

export const metadata = {
    title: '地域・企業との取り組み｜HINODE',
    description: 'HINODEの拠点導入、地域ラン企画、ランニングイベント、Web制作についてご相談いただけます。',
    alternates: {
        canonical: `${SITE_URL}/for-organizers`,
    },
    openGraph: {
        title: '地域・企業との取り組み｜HINODE',
        description: 'HINODEの拠点導入、地域ラン企画、ランニングイベント、Web制作についてご相談いただけます。',
        url: `${SITE_URL}/for-organizers`,
        siteName: 'HINODE',
        locale: 'ja_JP',
        type: 'website',
        images: ['/assets/ogp-home.jpg'],
    },
    twitter: {
        card: 'summary_large_image',
        title: '地域・企業との取り組み｜HINODE',
        description: 'HINODEの拠点導入、地域ラン企画、ランニングイベント、Web制作についてご相談いただけます。',
        images: ['/assets/ogp-home.jpg'],
    },
};

const SUPPORT_ITEMS = [
    {
        number: '01',
        title: 'HINODE拠点導入',
        description: '地域や施設に、参加無料・予約不要・競争しない朝ランの拠点をつくります。ルート、集合場所、ホスト体制、告知方法を一緒に整えます。',
    },
    {
        number: '02',
        title: '地域ラン企画',
        description: '地域の景色、店舗、文化、交通を生かし、実際に走って確かめられる無理のないランニング企画を組み立てます。',
    },
    {
        number: '03',
        title: 'ランニングイベント',
        description: '単発の企画ランから継続開催まで、参加者に必要な案内、安全面、当日の流れを整理して実施します。',
    },
    {
        number: '04',
        title: 'Web制作',
        description: '大会やイベントの魅力と必要情報を整理し、スマートフォンで確認しやすい告知ページや公式サイトを制作します。',
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
                        街に、走り続けられる<br className={styles.mobileBreak} />
                        朝の場所をつくる。
                    </p>
                    <p className={styles.lead}>
                        HINODEでは、地域・施設・企業と一緒に、朝ラン拠点の導入、地域ラン企画、
                        ランニングイベント、Web制作に取り組んでいます。
                    </p>
                </div>

                <div className={styles.intro}>
                    <h2>通常開催のコミュニティを最優先にします</h2>
                    <p>
                        通常開催の参加者を商品やサービスの営業対象にはしません。協業する場合も、参加や購入を条件にせず、
                        HINODEの撮影方針と参加ルールを守ります。
                    </p>
                    <p>
                        そのうえで、地域に無理なく続く仕組みと、参加者に必要な情報を一緒に整理します。
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
                        取り組みについて相談する
                    </Link>
                </section>
            </div>
        </section>
    );
}
