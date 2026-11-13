import { deleteArticle, getArticle } from '@/lib/cms/articles';
import { checkArticle } from '@/lib/cms/checks';
import { fail, json, requireAdminRequest, requireDatabase } from '@/lib/cms/http';

export const dynamic = 'force-dynamic';

async function load(request, params) {
    const denied = await requireAdminRequest(request);
    if (denied) return { denied };
    const { db, denied: noDb } = await requireDatabase();
    if (noDb) return { denied: noDb };

    const article = await getArticle(db, (await params).id);
    return article ? { db, article } : { denied: fail(404, '記事が見つかりません。') };
}

export async function GET(request, { params }) {
    const { article, denied } = await load(request, params);
    if (denied) return denied;
    return json({ ok: true, article, issues: checkArticle(article) });
}

export async function DELETE(request, { params }) {
    const { db, article, denied } = await load(request, params);
    if (denied) return denied;

    await deleteArticle(db, article.id);
    return json({ ok: true, needsRevalidate: article.status === 'published' });
}
