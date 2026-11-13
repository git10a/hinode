import { hasApiToken } from '@/lib/cms/auth';
import { saveArticle } from '@/lib/cms/articles';
import { fail, json, readJson, requireDatabase } from '@/lib/cms/http';
import { absoluteUrl } from '@/lib/site';

export const dynamic = 'force-dynamic';

// AIエージェントの入稿口（npm run article:push）。CMS_API_TOKEN で認証する。
// 作れるのは下書きだけで、公開済みの記事は上書きできない。公開は管理画面から人が行う。
export async function POST(request) {
    if (!(await hasApiToken(request))) return fail(401, 'トークンが正しくありません。');
    const { db, denied } = await requireDatabase();
    if (denied) return denied;

    const input = await readJson(request);
    if (!input) return fail(400, '送信内容を読み取れませんでした。');

    const result = await saveArticle(db, { ...input, status: 'draft', import: false }, { allowPublish: false });
    if (result.error) return fail(422, result.error, { issues: result.issues });

    const origin = new URL(request.url).origin;
    return json({
        ok: true,
        id: result.article.id,
        status: result.article.status,
        issues: result.issues,
        editUrl: `${origin}/admin/articles/${result.article.id}`,
        previewUrl: `${origin}/blog/preview/${result.article.previewToken}`,
        publicUrl: absoluteUrl(`/blog/${result.article.id}`),
    });
}
