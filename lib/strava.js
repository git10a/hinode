const TOKEN_URL = 'https://www.strava.com/api/v3/oauth/token';
const API_BASE = 'https://www.strava.com/api/v3';

async function getAccessToken() {
    const res = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            client_id: process.env.STRAVA_CLIENT_ID,
            client_secret: process.env.STRAVA_CLIENT_SECRET,
            grant_type: 'refresh_token',
            refresh_token: process.env.STRAVA_REFRESH_TOKEN,
        }),
        cache: 'no-store',
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Strava token refresh failed: ${res.status} ${text}`);
    }
    const data = await res.json();
    return data.access_token;
}

function jstDayOfWeek(date) {
    const jst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    return jst.getUTCDay();
}

export async function getUpcomingGroupEvents() {
    const clubId = process.env.STRAVA_CLUB_ID;
    if (!clubId || !process.env.STRAVA_CLIENT_ID) return [];
    try {
        const token = await getAccessToken();
        const res = await fetch(
            `${API_BASE}/clubs/${clubId}/group_events?upcoming=true&per_page=200`,
            {
                headers: { Authorization: `Bearer ${token}` },
                next: { revalidate: 3600 },
            }
        );
        if (!res.ok) {
            console.error('Strava group_events fetch failed:', res.status);
            return [];
        }
        const events = await res.json();
        const now = Date.now();
        const flat = [];
        for (const ev of events) {
            const occurrences = ev.upcoming_occurrences || [];
            for (const occ of occurrences) {
                const t = new Date(occ);
                if (Number.isNaN(t.getTime()) || t.getTime() < now) continue;
                flat.push({
                    eventId: ev.id,
                    title: ev.title,
                    address: ev.address || '',
                    startAt: t.toISOString(),
                    dayOfWeek: jstDayOfWeek(t),
                });
            }
        }
        flat.sort((a, b) => new Date(a.startAt) - new Date(b.startAt));
        return flat;
    } catch (e) {
        console.error('Strava fetch error:', e.message);
        return [];
    }
}
