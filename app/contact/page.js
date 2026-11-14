import ContactForm from './ContactForm';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/site';
import styles from './contact.module.css';


export const metadata = {
    title: 'お問い合わせ｜HINODE',
    description: 'HINODEへのコースの提案、参加に関する質問、お仕事・取材などのお問い合わせフォームです。',
    alternates: {
        canonical: `${SITE_URL}/contact`,
    },
    openGraph: {
        title: 'お問い合わせ｜HINODE',
        description: '走ってほしいコースの提案、参加に関する質問、お仕事・取材のご相談はこちらから。',
        url: `${SITE_URL}/contact`,
        siteName: SITE_NAME,
        locale: 'ja_JP',
        type: 'website',
        images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'お問い合わせ｜HINODE',
        description: '走ってほしいコースの提案、参加に関する質問、お仕事・取材のご相談はこちらから。',
        images: [DEFAULT_OG_IMAGE],
    },
};

export default async function ContactPage({ searchParams }) {
    const { type, category } = (await searchParams) ?? {};
    const initialInquiryType = type === 'work' ? 'work' : 'community';
    const initialCategory = typeof category === 'string' ? category : '';

    return (
        <section className={styles.page}>
            <div className={styles.container}>
                <p className={styles.eyebrow}>CONTACT</p>
                <h1 className={styles.title}>お問い合わせ</h1>
                <p className={styles.lead}>
                    HINODEに走ってほしいコース、
                    参加に関する質問、お仕事・取材のご相談などをこちらからお送りください。
                </p>

                <div className={styles.examples}>
                    <p>
                        <strong>コースの提案</strong>
                        「この街を走ってほしい」など、気軽なアイデアを歓迎しています。
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
