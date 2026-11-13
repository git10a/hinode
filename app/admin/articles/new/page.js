import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';
import ArticleEditor from '@/components/admin/ArticleEditor';
import styles from '@/components/admin/admin.module.css';
import { ADMIN_METADATA, openAdminPage } from '@/lib/cms/adminPage';

export const dynamic = 'force-dynamic';
export const metadata = { title: '新しい記事 | HINODE CMS', ...ADMIN_METADATA };

export default async function NewArticlePage() {
    const { db } = await openAdminPage();

    return (
        <AdminShell
            title="新しい記事"
            hasDatabase={Boolean(db)}
            actions={<Link href="/admin" className={styles.textButton}>← 記事の一覧</Link>}
        >
            <ArticleEditor />
        </AdminShell>
    );
}
