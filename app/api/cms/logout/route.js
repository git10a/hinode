import { cookies } from 'next/headers';
import { SESSION_COOKIE, isSameOrigin } from '@/lib/cms/auth';
import { fail, json } from '@/lib/cms/http';

export const dynamic = 'force-dynamic';

export async function POST(request) {
    if (!isSameOrigin(request)) return fail(403, '送信元を確認できませんでした。');
    (await cookies()).delete(SESSION_COOKIE);
    return json({ ok: true });
}
