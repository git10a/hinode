import { getRegularRun } from './regularRuns';
import { formatTimeJst } from './jstDate';

// ブログ記事と定例ランを結びつけるための情報。
// 曜日・時刻・距離などは regularRuns から引き、ここにはブログ固有の文言だけを置く。
const BLOG_RUN_DETAILS = [
    {
        id: 'kokyo',
        courseHref: '/courses/kokyo',
        meetingPlace: '桔梗門派出所前',
        note: '皇居を1周、会話できるくらいのペースで走ります。',
        keywords: ['皇居', '桔梗門', '二重橋', '半蔵門', 'hibiya ride', 'サクラカフェ神保町'],
    },
    {
        id: 'meguro',
        courseHref: '/courses/megurogawa',
        meetingPlace: '中目黒駅 蔦屋併設スタバ前',
        note: '中目黒から目黒川沿いを、ゆっくり往復します。',
        keywords: ['目黒川', '中目黒', '池尻大橋', '蔦屋書店', '蔦屋併設スタバ'],
    },
    {
        id: 'yoyogi',
        courseHref: '/courses/yoyogi-park',
        meetingPlace: '原宿時計塔前',
        note: '日曜朝に、初参加でも入りやすいペースで走ります。',
        keywords: ['代々木', '織田フィールド', '原宿時計塔', 'runtrip base', 'nike原宿'],
    },
];

// イベント名から定例ランを推定するときの優先順（複数に当てはまる場合は先頭が勝つ）
const EVENT_TITLE_PATTERNS = [
    { id: 'yoyogi', pattern: /代々木/ },
    { id: 'meguro', pattern: /目黒|中目黒/ },
    { id: 'kokyo', pattern: /皇居/ },
];

export const BLOG_RUN_CONTEXTS = BLOG_RUN_DETAILS.map((details) => {
    const run = getRegularRun(details.id);
    return {
        ...details,
        place: run.place,
        shortName: run.name,
        dayOfWeek: run.dayOfWeek,
        time: run.timeRaw,
        scheduleHref: run.scheduleHref,
        distance: run.distance,
        regularLabel: `${run.dayShort} ${run.timeRaw}｜${run.place}`,
    };
});

function normalizeText(value = '') {
    return value.toLowerCase();
}

function isSameSlot(context, event) {
    return event?.dayOfWeek === context.dayOfWeek
        && formatTimeJst(event.startAt) === context.time;
}

export function getBlogRunContext(post = {}) {
    const text = normalizeText(`${post.title || ''} ${post.description || ''}`);
    return BLOG_RUN_CONTEXTS.find((context) => (
        context.keywords.some((keyword) => text.includes(normalizeText(keyword)))
    )) || null;
}

export function getUpcomingEventForRunContext(events = [], context = null) {
    if (!context) return null;
    return events.find((event) => isSameSlot(context, event)) || null;
}

// Stravaイベントの集合場所。定例ランなら決まった集合場所を、
// それ以外はStravaに登録された住所を返す。
export function getEventMeetingPlace(event) {
    const title = event?.title || '';
    const matchedByTitle = EVENT_TITLE_PATTERNS.find(({ pattern }) => pattern.test(title));
    const context = matchedByTitle
        ? BLOG_RUN_CONTEXTS.find(({ id }) => id === matchedByTitle.id)
        : BLOG_RUN_CONTEXTS.find((candidate) => isSameSlot(candidate, event));
    if (context) return context.meetingPlace;

    return event?.address?.trim() || '';
}
