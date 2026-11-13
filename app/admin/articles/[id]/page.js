import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import ArticleEditor from '@/components/admin/ArticleEditor';
import styles from '@/components/admin/admin.module.css';
import { ADMIN_METADATA, openAdminPage } from '@/lib/cms/adminPage';
import { getArticle } from '@/lib/cms/articles';

export const dynamic = 'force-dynamic';
export const metadata = { title: '記事の編集 | HINODE CMS', ...ADMIN_METADATA };

export default async function EditArticlePage({ params }) {
    const { db } = await openAdminPage();
    const article = db ? await getArticle(db, (await params).id) : null;
    if (db && !article) notFound();

    return (
        <AdminShell
            title="記事の編集"
            hasDatabase={Boolean(db)}
            actions={<Link href="/admin" className={styles.textButton}>← 記事の一覧</Link>}
        >
            {/* 別の記事へ移ったときに入力内容を持ち越さないよう、記事ごとに作り直す */}
            <ArticleEditor key={article?.id} article={article} />
        </AdminShell>
    );
}
