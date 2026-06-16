import Link from 'next/link';
import styles from '../work-contact.module.css';

export const metadata = {
    title: '送信完了｜HINODE',
    description: 'HINODEへのお仕事・取材のご相談を受け付けました。',
};

export default function WorkContactThanksPage() {
    return (
        <section className={styles.page}>
            <div className={`${styles.container} ${styles.thanksContainer}`}>
                <p className={styles.eyebrow}>THANK YOU</p>
                <h1 className={styles.title}>送信しました</h1>
                <p className={styles.lead}>
                    お仕事・取材のご相談を受け付けました。
                    内容を確認し、必要に応じて運営より返信します。
                </p>
                <div className={styles.thanksActions}>
                    <Link href="/" className={styles.secondaryButton}>トップへ戻る</Link>
                    <Link href="/press" className={styles.secondaryButton}>プレスキットを見る</Link>
                </div>
            </div>
        </section>
    );
}
