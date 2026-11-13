import { cookies } from 'next/headers';

// 管理画面のログイン（どこランの記事CMSの方式を移植）。
// パスワードは ADMIN_PASSWORD、セッションは ADMIN_SESSION_SECRET で署名した期限つきトークンをCookieに入れる。
// AIエージェントの入稿は CMS_API_TOKEN（Bearer）で認証し、下書きしか作れない。

export const SESSION_COOKIE = 'hinode_admin';
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

// 15分のあいだに同じIPから5回失敗したら、以降のログインを止める
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 5;

const MIN_SECRET_LENGTH = 32;
const encoder = new TextEncoder();

const toHex = (buffer) => Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, '0')).join('');

// 長さの違いからも中身を推測できないよう、両方のハッシュを取ってから全バイトを比べる
async function safeEqual(a, b) {
    const [left, right] = await Promise.all([a, b].map(async (value) => (
        new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(String(value))))
    )));
    let mismatch = 0;
    for (let index = 0; index < left.length; index += 1) mismatch |= left[index] ^ right[index];
    return mismatch === 0;
}

async function sign(payload) {
    const secret = process.env.ADMIN_SESSION_SECRET;
    if (!secret || secret.length < MIN_SECRET_LENGTH) return '';
    const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    return toHex(await crypto.subtle.sign('HMAC', key, encoder.encode(payload)));
}

export function isAuthConfigured() {
    return Boolean(process.env.ADMIN_PASSWORD) && (process.env.ADMIN_SESSION_SECRET || '').length >= MIN_SECRET_LENGTH;
}

export async function verifyPassword(password) {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected || typeof password !== 'string') return false;
    return safeEqual(password, expected);
}

export async function createSessionToken(now = Date.now()) {
    const payload = String(now + SESSION_MAX_AGE_SECONDS * 1000);
    return `${payload}.${await sign(payload)}`;
}

export async function verifySessionToken(token, now = Date.now()) {
    if (!token) return false;
    const [payload, signature] = token.split('.');
    if (!payload || !signature || !(Number(payload) > now)) return false;
    const expected = await sign(payload);
    return Boolean(expected) && safeEqual(signature, expected);
}

export async function isAdmin() {
    const store = await cookies();
    return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

// AIエージェント用のトークン。Authorization: Bearer <CMS_API_TOKEN>
export async function hasApiToken(request) {
    const expected = process.env.CMS_API_TOKEN;
    if (!expected || expected.length < MIN_SECRET_LENGTH) return false;
    const match = /^Bearer\s+(.+)$/i.exec(request.headers.get('authorization') || '');
    return match ? safeEqual(match[1].trim(), expected) : false;
}

// Cookieで認証する書き込みは、同じサイトから送られたものだけ受け付ける（他サイトからの送信を防ぐ）
export function isSameOrigin(request) {
    const origin = request.headers.get('origin');
    if (!origin) return false;
    try {
        return new URL(origin).host === new URL(request.url).host;
    } catch {
        return false;
    }
}

export function getClientIp(request) {
    return request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
}

export async function isLoginBlocked(db, ip, now = Date.now()) {
    const row = await db
        .prepare('SELECT COUNT(*) AS attempts FROM login_attempts WHERE ip = ? AND attempted_at > ?')
        .bind(ip, now - LOGIN_WINDOW_MS)
        .first();
    return (row?.attempts || 0) >= LOGIN_MAX_ATTEMPTS;
}

export async function recordFailedLogin(db, ip, now = Date.now()) {
    await db.batch([
        db.prepare('DELETE FROM login_attempts WHERE attempted_at <= ?').bind(now - LOGIN_WINDOW_MS),
        db.prepare('INSERT INTO login_attempts (ip, attempted_at) VALUES (?, ?)').bind(ip, now),
    ]);
}

export async function clearFailedLogins(db, ip) {
    await db.prepare('DELETE FROM login_attempts WHERE ip = ?').bind(ip).run();
}
