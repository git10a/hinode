import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import LogoutButton from '@/components/admin/LogoutButton';
import styles from '@/components/admin/admin.module.css';
import { formatPostDate } from '@/lib/blogPosts';
import { ADMIN_METADATA, openAdminPage } from '@/lib/cms/adminPage';
import { listArticlesForAdmin } from '@/lib/cms/articles';

export const dynamic = 'force-dynamic';
export const metadata = { title: '記事の管理 | HINODE CMS', ...ADMIN_METADATA };

export default async function AdminHomePage() {
    const { db } = await openAdminPage();
    const articles = db ? await listArticlesForAdmin(db) : [];

    return (
        <AdminShell
            title="記事の管理"
            hasDatabase={Boolean(db)}
            actions={(
                <>
                    <LogoutButton />
                    <Link href="/admin/articles/new" className={styles.primaryButton}>新しい記事を書く</Link>
                </>
            )}
        >
            {articles.length === 0 ? (
                <p className={styles.empty}>
                    まだ記事がありません。<br />
                    「新しい記事を書く」から始めるか、既存記事を取り込んでください（docs/cms.md）。
                </p>
            ) : (
                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>状態</th>
                                <th>タイトル</th>
                                <th>公開日</th>
                                <th>更新日</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articles.map((article) => (
                                <tr key={article.id}>
                                    <td>
                                        <span className={article.status === 'published' ? styles.badgePublished : styles.badgeDraft}>
                                            {article.status === 'published' ? '公開中' : '下書き'}
                                        </span>
                                    </td>
                                    <td>
                                        <Link href={`/admin/articles/${article.id}`} className={styles.titleLink}>
                                            {article.title || '（タイトルなし）'}
                                        </Link>
                                        <span className={styles.subText}>/blog/{article.id}</span>
                                    </td>
                                    <td className={styles.nowrap}>{article.publishedAt ? formatPostDate(article.publishedAt) : '—'}</td>
                                    <td className={styles.nowrap}>{formatPostDate(article.revisedAt || article.updatedAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminShell>
    );
}
