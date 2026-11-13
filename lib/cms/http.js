import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/cloudflareEnv';
import { hasApiToken, isAdmin, isSameOrigin } from './auth';

// CMS の API で共通に使う応答と認証。

export const json = (body, status = 200) => NextResponse.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' },
});

export const fail = (status, error, extra = {}) => json({ ok: false, error, ...extra }, status);

// 管理画面（Cookie）からの操作。書き込みは同じサイトからの送信だけ受け付ける
export async function requireAdminRequest(request) {
    if (!(await isAdmin())) return fail(401, 'ログインが必要です。');
    if (request.method !== 'GET' && !isSameOrigin(request)) return fail(403, '送信元を確認できませんでした。');
    return null;
}

// 管理画面か、AIエージェントのトークンのどちらか。戻り値の actor は 'admin' | 'agent'
export async function identifyActor(request) {
    if (await hasApiToken(request)) return { actor: 'agent' };
    const denied = await requireAdminRequest(request);
    return denied ? { denied } : { actor: 'admin' };
}

export async function requireDatabase() {
    const db = await getDatabase();
    return db ? { db } : { denied: fail(503, 'CMS のデータベースが設定されていません。') };
}

export async function readJson(request) {
    try {
        return await request.json();
    } catch {
        return null;
    }
}
