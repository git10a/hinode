import Link from '@/components/SiteLink';
import styles from '../contact.module.css';

export const metadata = {
    title: '送信完了｜HINODE',
    description: 'HINODEへのお問い合わせを受け付けました。',
    robots: {
        index: false,
        follow: false,
    },
};

export default function ContactThanksPage() {
    return (
        <section className={styles.page}>
            <div className={`${styles.container} ${styles.thanksContainer}`}>
                <p className={styles.eyebrow}>THANK YOU</p>
                <h1 className={styles.title}>送信しました</h1>
                <p className={styles.lead}>
                    お問い合わせを受け付けました。
                    内容を確認し、必要に応じて運営より返信します。
                </p>
                <div className={styles.thanksActions}>
                    <Link href="/" className={styles.secondaryButton}>トップへ戻る</Link>
                    <Link href="/schedule" className={styles.secondaryButton}>グループラン日程を見る</Link>
                </div>
            </div>
        </section>
    );
}
