import { getMediaBucket } from '@/lib/cloudflareEnv';
import { fail, identifyActor, json } from '@/lib/cms/http';
import { createMediaKey, mediaUrl, validateImage } from '@/lib/cms/media';

export const dynamic = 'force-dynamic';

// 画像のアップロード。管理画面と、取り込みスクリプトから使う
export async function POST(request) {
    const { denied } = await identifyActor(request);
    if (denied) return denied;

    const bucket = await getMediaBucket();
    if (!bucket) return fail(503, '画像の置き場（R2）が設定されていません。');

    let file;
    try {
        file = (await request.formData()).get('file');
    } catch {
        return fail(400, '送信内容を読み取れませんでした。');
    }
    if (!file || typeof file.arrayBuffer !== 'function') return fail(400, '画像ファイルがありません。');

    const bytes = new Uint8Array(await file.arrayBuffer());
    const { info, error } = validateImage(bytes);
    if (error) return fail(422, error);

    const key = createMediaKey(info);
    // 中身から判定した形式を使う（送られてきた Content-Type は信用しない）
    await bucket.put(key, bytes, { httpMetadata: { contentType: info.type } });

    return json({ ok: true, url: mediaUrl(key), width: info.width, height: info.height });
}
