// Cloudflare Workers のバインディング（D1・R2）を取り出す。
// 本番とローカルの vinext では cloudflare:workers から取れる。next dev / next build や
// テストなど Workers 以外で動くときは null を返し、呼び出し側が microCMS などへ切り替える。
let cachedEnv;

export async function getCloudflareEnv() {
    if (cachedEnv !== undefined) return cachedEnv;

    try {
        const workers = await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ 'cloudflare:workers');
        cachedEnv = workers.env || null;
    } catch {
        cachedEnv = null;
    }

    return cachedEnv;
}

export async function getDatabase() {
    return (await getCloudflareEnv())?.DB || null;
}

export async function getMediaBucket() {
    return (await getCloudflareEnv())?.MEDIA || null;
}
