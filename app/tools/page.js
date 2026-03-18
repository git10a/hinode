import styles from './tools.module.css';

export const metadata = {
    title: 'TOOLS | HINODE',
    description: 'ランナーに役立つウェブサービスを開発しています。',
};

export default function Tools() {
    return (
        <>
            <section className={styles.toolsHero}>
                <div className="container">
                    <h1 className={styles.title}>TOOLS</h1>
                    <p className={styles.description}>
                        ランナーに役立つウェブサービスを開発しています。
                    </p>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.contentContainer}>
                    <div className={styles.toolsGrid}>
                        <a href="https://kizarm.com/" target="_blank" rel="noopener noreferrer" className={styles.toolCard}>
                            <div className={styles.toolHeader}>
                                <h2 className={styles.toolTitle}>KIZARM</h2>
                            </div>
                            <p className={styles.toolDescription}>
                                KIZARM（キザーム）は、マラソンやロードレースに出場するランナーのための記録管理サービスです。
                            </p>
                            <span className={styles.toolLink}>kizarm.com →</span>
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
