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

function parseWithBigIntIds(text) {
    // Strava event/route IDs are 19-digit, exceeding JS Number.MAX_SAFE_INTEGER.
    // Wrap long numeric "id" fields in quotes to preserve precision as string.
    const safe = text.replace(/"id":\s*(\d{16,})/g, '"id":"$1"');
    return JSON.parse(safe);
}

function normalizeParticipant(athlete) {
    const image = athlete.profile_medium || athlete.profile;
    if (!image || !/^https?:\/\//.test(image)) return null;
    return {
        id: String(athlete.id),
        image,
    };
}

async function getEventParticipants(token, eventId) {
    try {
        const res = await fetch(`${API_BASE}/group_events/${eventId}/athletes?per_page=100`, {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 3600 },
        });
        if (!res.ok) {
            console.error('Strava event athletes fetch failed:', res.status);
            return null;
        }
        const athletes = await res.json();
        if (!Array.isArray(athletes)) return null;
        return {
            participantCount: athletes.length,
            participants: athletes.map(normalizeParticipant).filter(Boolean).slice(0, 5),
        };
    } catch (e) {
        console.error('Strava event athletes fetch error:', e.message);
        return null;
    }
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
        const text = await res.text();
        const events = parseWithBigIntIds(text);
        const now = Date.now();
        const flat = [];
        for (const ev of events) {
            const occurrences = ev.upcoming_occurrences || [];
            for (const occ of occurrences) {
                const t = new Date(occ);
                if (Number.isNaN(t.getTime()) || t.getTime() < now) continue;
                flat.push({
                    eventId: String(ev.id),
                    title: ev.title,
                    address: ev.address || '',
                    startAt: t.toISOString(),
                    dayOfWeek: jstDayOfWeek(t),
                });
            }
        }
        flat.sort((a, b) => new Date(a.startAt) - new Date(b.startAt));
        const eventIds = [...new Set(flat.slice(0, 12).map((event) => event.eventId))];
        const participantEntries = await Promise.all(
            eventIds.map(async (eventId) => [eventId, await getEventParticipants(token, eventId)])
        );
        const participantsByEventId = new Map(participantEntries.filter(([, data]) => data));
        return flat.map((event) => {
            const participantData = participantsByEventId.get(event.eventId);
            return participantData ? { ...event, ...participantData } : event;
        });
    } catch (e) {
        console.error('Strava fetch error:', e.message);
        return [];
    }
}

export async function getClubMemberCount() {
    const clubId = process.env.STRAVA_CLUB_ID;
    if (!clubId || !process.env.STRAVA_CLIENT_ID) return null;
    try {
        const token = await getAccessToken();
        const res = await fetch(`${API_BASE}/clubs/${clubId}`, {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 3600 },
        });
        if (!res.ok) return null;
        const data = await res.json();
        return typeof data.member_count === 'number' ? data.member_count : null;
    } catch (e) {
        console.error('Strava club fetch error:', e.message);
        return null;
    }
}
