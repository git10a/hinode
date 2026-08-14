import Link from '@/components/SiteLink';
import styles from '../start.module.css';

export const metadata = { title: '送信しました｜HINODE' };

export default function StartThanksPage() {
    return (
        <main className={styles.page}>
            <div className={`${styles.container} ${styles.thanks}`}>
                <p className={styles.eyebrow}>THANK YOU</p>
                <h1>送信しました</h1>
                <p className={styles.lead}>ご連絡ありがとうございます。候補エリアの状況を確認し、必要に応じてメールでご連絡します。</p>
                <Link href="/" className={styles.secondaryButton}>TOPへ戻る</Link>
            </div>
        </main>
    );
}
