import { cookies } from 'next/headers';
import {
    SESSION_COOKIE,
    SESSION_MAX_AGE_SECONDS,
    clearFailedLogins,
    createSessionToken,
    getClientIp,
    isAuthConfigured,
    isLoginBlocked,
    isSameOrigin,
    recordFailedLogin,
    verifyPassword,
} from '@/lib/cms/auth';
import { fail, json, readJson, requireDatabase } from '@/lib/cms/http';

export const dynamic = 'force-dynamic';

export async function POST(request) {
    if (!isSameOrigin(request)) return fail(403, '送信元を確認できませんでした。');
    if (!isAuthConfigured()) return fail(503, '管理画面のパスワードが設定されていません。');

    const { db, denied } = await requireDatabase();
    if (denied) return denied;

    const ip = getClientIp(request);
    if (await isLoginBlocked(db, ip)) {
        return fail(429, 'ログインの失敗が続いたため、しばらく受け付けを止めています。15分ほど待ってからやり直してください。');
    }

    const payload = await readJson(request);
    if (!(await verifyPassword(payload?.password))) {
        await recordFailedLogin(db, ip);
        return fail(401, 'パスワードが違います。');
    }

    await clearFailedLogins(db, ip);
    const store = await cookies();
    store.set(SESSION_COOKIE, await createSessionToken(), {
        httpOnly: true,
        sameSite: 'lax',
        // ローカル開発（http://localhost）でもログインできるよう、https のときだけ Secure を付ける
        secure: new URL(request.url).protocol === 'https:',
        path: '/',
        maxAge: SESSION_MAX_AGE_SECONDS,
    });
    return json({ ok: true });
}
