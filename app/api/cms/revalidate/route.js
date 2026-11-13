import { revalidateBlog } from '@/lib/blogRevalidate';
import { json, readJson, requireAdminRequest } from '@/lib/cms/http';

export const dynamic = 'force-dynamic';

// 公開ページの作り直し。記事の保存（/api/cms/articles）とは別のリクエストにしてある。
// Cloudflare のキャッシュ消去は回数制限で失敗することがあり、失敗するとこのリクエストは 500 になる。
// その場合も記事は保存済みで、ページは定期的な作り直し（最大15分）で反映される。
// 呼び出し側（管理画面・取り込みスクリプト）は、500 を「反映に時間がかかる」として扱う
export async function POST(request) {
    const denied = await requireAdminRequest(request);
    if (denied) return denied;

    const input = await readJson(request);
    const id = typeof input?.id === 'string' ? input.id : undefined;
    return json({ ok: true, revalidated: revalidateBlog(id) });
}
