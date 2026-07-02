import Link from '@/components/SiteLink';
import ContactForm from './ContactForm';
import styles from './work-contact.module.css';

const SITE_URL = 'https://hinode-run.com';

export const metadata = {
    title: 'お仕事・取材のご相談｜HINODE',
    description: 'HINODEへのお仕事依頼、取材、掲載、イベント出演などのご相談フォームです。グループラン参加に関するお問い合わせ窓口ではありません。',
    alternates: {
        canonical: `${SITE_URL}/work-contact`,
    },
    openGraph: {
        title: 'お仕事・取材のご相談｜HINODE',
        description: 'HINODEへのお仕事依頼、取材、掲載、イベント出演などのご相談フォームです。',
        url: `${SITE_URL}/work-contact`,
        siteName: 'HINODE',
        locale: 'ja_JP',
        type: 'website',
        images: ['/assets/ogp-home.jpg'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'お仕事・取材のご相談｜HINODE',
        description: 'HINODEへのお仕事依頼、取材、掲載、イベント出演などのご相談フォームです。',
        images: ['/assets/ogp-home.jpg'],
    },
};

export default function WorkContactPage() {
    return (
        <section className={styles.page}>
            <div className={styles.container}>
                <p className={styles.eyebrow}>WORK / PRESS</p>
                <h1 className={styles.title}>お仕事・取材のご相談</h1>
                <p className={styles.lead}>
                    HINODEへの取材、掲載、イベント出演、協業などのご相談はこちらからお送りください。
                    内容を確認し、必要に応じて運営より返信します。
                </p>

                <div className={styles.notice}>
                    <h2>グループラン参加の連絡窓口ではありません</h2>
                    <p>
                        通常のグループランへの参加・集合場所・雨天時の確認については、
                        <Link href="/schedule">グループラン日程</Link>
                        と
                        <Link href="/faq">よくある質問</Link>
                        をご確認ください。このフォームでは参加連絡や個別の参加相談には返信していません。
                    </p>
                </div>

                <ContactForm />
            </div>
        </section>
    );
}
