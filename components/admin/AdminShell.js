import styles from './admin.module.css';

// 管理画面の共通の枠。db が無い環境では、設定が済んでいないことを伝える
export default function AdminShell({ title, actions = null, hasDatabase = true, narrow = false, children }) {
    return (
        <main className={styles.page}>
            <div className={narrow ? styles.narrow : styles.container}>
                <div className={styles.pageHeader}>
                    <div>
                        <p className={styles.eyebrow}>HINODE CMS</p>
                        <h1 className={styles.pageTitle}>{title}</h1>
                    </div>
                    {actions && <div className={styles.headerActions}>{actions}</div>}
                </div>
                {hasDatabase ? children : (
                    <p className={styles.empty}>
                        CMS のデータベースがまだ設定されていません。<br />
                        docs/cms.md の「本番への切り替え手順」を済ませると使えるようになります。
                    </p>
                )}
            </div>
        </main>
    );
}
