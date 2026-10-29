export const LUMA_CALENDAR_URL = 'https://luma.com/hinode';

const CALENDAR_FEED_URL = 'https://api.luma.com/ics/get?entity=calendar&id=cal-JWxU0jyUqr7q0ZS';
const REVALIDATE_SECONDS = 300;
const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

// The public iCal feed contains dates and locations, but no cover images.
// Reuse the location photos from the approved card design.
const RUN_PHOTOS = [
    ['代々木', 'https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,anim=false,background=white,quality=75,width=360,height=240/uploads/e0/0a1a7dc2-a477-4a09-b384-fa09b5904fee.jpg'],
    ['皇居', 'https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,anim=false,background=white,quality=75,width=360,height=240/uploads/pe/e7d1a8b5-56f4-4aa3-b7b5-9dcab0490101.jpg'],
    ['目黒川', 'https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,anim=false,background=white,quality=75,width=360,height=240/uploads/no/09800da1-f05e-42dd-9dfe-45f000a6c049.jpg'],
];

const LOCATION_LABELS = new Map([
    ['Yoyogi Park Clock Tower', '原宿門前時計塔'],
    ['Kikyō-mon Gate', '桔梗門'],
    ['Starbucks Coffee - Naka-Meguro Tsutaya Books', 'スターバックス 中目黒 蔦屋書店'],
]);

function unescapeText(value = '') {
    return value.replace(/\\([nN,;\\])/g, (_, character) => character.toLowerCase() === 'n' ? '\n' : character);
}

function parseDate(property) {
    if (!property) return null;
    const match = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/.exec(property.value);
    if (!match) return null;
    const [, year, month, day, hours = '00', minutes = '00', seconds = '00', utc] = match;
    const allDay = !match[4];
    const timezone = property.parameters.match(/(?:^|;)TZID="?([^;"]+)/i)?.[1];
    // Luma publishes UTC. Accept explicit JST and date-only events too, but do
    // not guess the timezone of a floating or otherwise unsupported timestamp.
    if (!allDay && !utc && timezone !== 'Asia/Tokyo') return null;
    const iso = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${utc ? 'Z' : '+09:00'}`;
    const date = new Date(iso);
    if (!Number.isFinite(date.getTime())) return null;
    const local = new Date(date.getTime() + (utc ? 0 : JST_OFFSET_MS));
    if (local.getUTCFullYear() !== Number(year) || local.getUTCMonth() + 1 !== Number(month) || local.getUTCDate() !== Number(day)) return null;
    return { date, allDay };
}

function eventUrl(properties) {
    const value = properties.get('URL')?.value || unescapeText(properties.get('DESCRIPTION')?.value).match(/https:\/\/(?:luma\.com|lu\.ma)\/[^\s<>]+/)?.[0];
    if (!value) return null;
    try {
        const url = new URL(value);
        if (url.protocol !== 'https:' || !['luma.com', 'lu.ma'].includes(url.hostname) || url.username || url.password) return null;
        return url.href;
    } catch {
        return null;
    }
}

export function parseLumaCalendar(calendar, now = new Date()) {
    if (!/^BEGIN:VCALENDAR\r?$/m.test(calendar) || !/^END:VCALENDAR\r?$/m.test(calendar)) {
        throw new Error('Invalid Luma calendar feed');
    }

    const events = new Map();
    let properties = null;
    let nestedDepth = 0;
    // iCalendar folds long content lines with a CRLF followed by whitespace.
    for (const line of calendar.replace(/\r?\n[ \t]/g, '').split(/\r?\n/)) {
        if (line === 'BEGIN:VEVENT') {
            properties = new Map();
            nestedDepth = 0;
        } else if (line === 'END:VEVENT' && properties) {
            const start = parseDate(properties.get('DTSTART'));
            const end = parseDate(properties.get('DTEND'));
            const title = unescapeText(properties.get('SUMMARY')?.value).replace(/^HINODE[\s　|｜:：-]*/i, '').trim();
            const href = eventUrl(properties);
            const expiry = end?.date.getTime() || (start?.allDay ? start.date.getTime() + 24 * 60 * 60 * 1000 : start?.date.getTime());
            if (start && title && href && properties.get('STATUS')?.value !== 'CANCELLED' && expiry > now.getTime()) {
                const location = unescapeText(properties.get('LOCATION')?.value);
                const venueName = location.split(',')[0].trim();
                const startAt = start.date.toISOString();
                const id = `${properties.get('UID')?.value || href}:${startAt}`;
                events.set(id, {
                    id,
                    title,
                    href,
                    startAt,
                    allDay: start.allDay,
                    location: LOCATION_LABELS.get(venueName) || venueName,
                    image: RUN_PHOTOS.find(([place]) => title.includes(place))?.[1] || '/assets/ogp-home.jpg',
                });
            }
            properties = null;
        } else if (properties) {
            if (line.startsWith('BEGIN:')) {
                nestedDepth += 1;
            } else if (line.startsWith('END:')) {
                nestedDepth -= 1;
            } else if (nestedDepth === 0) {
                const colon = line.indexOf(':');
                if (colon < 0) continue;
                const [name, ...parameters] = line.slice(0, colon).split(';');
                properties.set(name.toUpperCase(), { value: line.slice(colon + 1), parameters: parameters.join(';') });
            }
        }
    }
    return [...events.values()].sort((a, b) => a.startAt.localeCompare(b.startAt));
}

export async function getUpcomingLumaEvents() {
    try {
        const response = await fetch(CALENDAR_FEED_URL, {
            next: { revalidate: REVALIDATE_SECONDS },
            signal: AbortSignal.timeout(8000),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return parseLumaCalendar(await response.text());
    } catch (error) {
        console.error('Luma calendar fetch failed:', error.message);
        return null;
    }
}
