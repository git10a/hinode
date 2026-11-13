import { getMediaBucket } from '@/lib/cloudflareEnv';
import { isValidMediaKey } from '@/lib/cms/media';

// 記事の画像を R2 から返す。キーは一度決まると中身が変わらない。
// 本番では vinext の CDN アダプターがブラウザ向けの Cache-Control を「毎回確認」に書き換えるので、
// ETag での確認（304）に応えて、2回目以降は本体を送らずに済ませる。
const CACHE_CONTROL = 'public, max-age=31536000, immutable';

export async function GET(request, { params }) {
    const key = ((await params).key || []).join('/');
    const bucket = isValidMediaKey(key) ? await getMediaBucket() : null;
    // If-None-Match が一致するときは、R2 が本体なしのオブジェクトを返す
    const object = bucket ? await bucket.get(key, { onlyIf: request.headers }) : null;

    if (!object) return new Response('Not found', { status: 404 });

    const headers = {
        'Cache-Control': CACHE_CONTROL,
        'X-Content-Type-Options': 'nosniff',
        ETag: object.httpEtag,
    };
    if (!object.body) return new Response(null, { status: 304, headers });

    return new Response(object.body, {
        headers: { ...headers, 'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream' },
    });
}
