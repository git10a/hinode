import { revalidateBlog } from '@/lib/blogRevalidate';
import { listArticlesForAdmin, saveArticle } from '@/lib/cms/articles';
import { fail, json, readJson, requireAdminRequest, requireDatabase } from '@/lib/cms/http';

export const dynamic = 'force-dynamic';

// 管理画面: 記事の一覧
export async function GET(request) {
    const denied = await requireAdminRequest(request);
    if (denied) return denied;
    const { db, denied: noDb } = await requireDatabase();
    if (noDb) return noDb;

    return json({ ok: true, articles: await listArticlesForAdmin(db) });
}

// 管理画面: 記事の作成・更新・公開。既存記事の取り込み（import: true）もここを通る
export async function POST(request) {
    const denied = await requireAdminRequest(request);
    if (denied) return denied;
    const { db, denied: noDb } = await requireDatabase();
    if (noDb) return noDb;

    const input = await readJson(request);
    if (!input) return fail(400, '送信内容を読み取れませんでした。');

    const result = await saveArticle(db, input, { allowPublish: true, allowImport: true });
    if (result.error) return fail(422, result.error, { issues: result.issues });

    // 公開中の記事に関わる保存のときだけ、公開ページを作り直す
    if (result.article.status === 'published' || result.wasPublished) revalidateBlog(result.article.id);

    return json({ ok: true, article: result.article, issues: result.issues });
}
