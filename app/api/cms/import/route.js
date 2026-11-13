import { publishImportedArticles } from '@/lib/cms/articles';
import { fail, json, readJson, requireAdminRequest, requireDatabase } from '@/lib/cms/http';

export const dynamic = 'force-dynamic';

// 既存記事の取り込みの仕上げ（npm run cms:import の最後に呼ばれる）。
// 取り込みは全件を下書きとして入れ、ここでまとめて公開にする。記事の読み込み元は
// 「CMS に公開記事が1件でもあれば CMS」で決まるので、1件ずつ公開すると、取り込みの途中で
// サイトの記事が一部しか表示されなくなる。それを避けるための一括切り替え
export async function POST(request) {
    const denied = await requireAdminRequest(request);
    if (denied) return denied;
    const { db, denied: noDb } = await requireDatabase();
    if (noDb) return noDb;

    const input = await readJson(request);
    if (!Array.isArray(input?.publish)) return fail(400, '公開する記事のIDを publish に配列で渡してください。');

    const published = await publishImportedArticles(db, input.publish);
    return json({ ok: true, published, needsRevalidate: published > 0 });
}
