import ContactForm from './ContactForm';
import styles from './contact.module.css';

const SITE_URL = 'https://hinode-run.com';

export const metadata = {
    title: 'お問い合わせ｜HINODE',
    description: 'HINODEへの企画ランやコースの提案、参加に関する質問、お仕事・取材などのお問い合わせフォームです。',
    alternates: {
        canonical: `${SITE_URL}/contact`,
    },
    openGraph: {
        title: 'お問い合わせ｜HINODE',
        description: '企画ランや走ってほしいコースの提案、参加に関する質問、お仕事・取材のご相談はこちらから。',
        url: `${SITE_URL}/contact`,
        siteName: 'HINODE',
        locale: 'ja_JP',
        type: 'website',
        images: ['/assets/ogp-home.jpg'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'お問い合わせ｜HINODE',
        description: '企画ランや走ってほしいコースの提案、参加に関する質問、お仕事・取材のご相談はこちらから。',
        images: ['/assets/ogp-home.jpg'],
    },
};

export default function ContactPage({ searchParams }) {
    const initialInquiryType = searchParams?.type === 'work' ? 'work' : 'community';
    const initialCategory = typeof searchParams?.category === 'string' ? searchParams.category : '';

    return (
        <section className={styles.page}>
            <div className={styles.container}>
                <p className={styles.eyebrow}>CONTACT</p>
                <h1 className={styles.title}>お問い合わせ</h1>
                <p className={styles.lead}>
                    土曜の企画ランのアイデア、HINODEに走ってほしいコース、
                    参加に関する質問、お仕事・取材のご相談などをこちらからお送りください。
                </p>

                <div className={styles.examples}>
                    <p>
                        <strong>企画やコースの提案</strong>
                        「パン屋を巡るランがしたい」「この街を走ってほしい」など、気軽なアイデアを歓迎しています。
                    </p>
                    <p>
                        <strong>お仕事・取材のご相談</strong>
                        取材、掲載、イベント出演、協業などのご相談も同じフォームから受け付けています。
                    </p>
                </div>

                <ContactForm
                    initialInquiryType={initialInquiryType}
                    initialCategory={initialCategory}
                />
            </div>
        </section>
    );
}
