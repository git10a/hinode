/**
 * Token store using Upstash Redis REST API.
 * Falls back to environment variable if Upstash is not configured.
 *
 * Required env vars for Upstash:
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 */

const KEY = 'strava_refresh_token';

export async function getRefreshToken() {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (url && token) {
        try {
            const res = await fetch(`${url}/get/${KEY}`, {
                headers: { Authorization: `Bearer ${token}` },
                cache: 'no-store',
            });
            const data = await res.json();
            if (data.result) return data.result;
        } catch (e) {
            console.error('Failed to read refresh token from store:', e);
        }
    }

    // Fallback to env var
    return process.env.STRAVA_REFRESH_TOKEN;
}

export async function saveRefreshToken(newToken) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) return;

    try {
        await fetch(`${url}/set/${KEY}/${encodeURIComponent(newToken)}`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        });
    } catch (e) {
        console.error('Failed to save refresh token to store:', e);
    }
}
