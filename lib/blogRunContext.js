import SCHEDULE_ITEMS from './scheduleItems';

const SCHEDULE_BY_KEY = new Map(
    SCHEDULE_ITEMS.map((item) => [`${item.dayOfWeek}-${item.time}`, item])
);

const RUN_CONTEXTS = [
    {
        id: 'kokyo',
        place: '皇居',
        shortName: '皇居ラン',
        dayOfWeek: 3,
        time: '06:00',
        scheduleHref: '/schedule#kokyo',
        courseHref: '/courses/kokyo',
        distance: '約5km',
        note: '皇居を1周、会話できるくらいのペースで走ります。',
        keywords: ['皇居', '桔梗門', '二重橋', '半蔵門', 'hibiya ride', 'サクラカフェ神保町'],
    },
    {
        id: 'meguro',
        place: '目黒川',
        shortName: '目黒川ラン',
        dayOfWeek: 4,
        time: '06:00',
        scheduleHref: '/schedule#meguro',
        courseHref: '/courses/megurogawa',
        distance: '約4km',
        note: '中目黒から目黒川沿いを、ゆっくり往復します。',
        keywords: ['目黒川', '中目黒', '池尻大橋', '蔦屋書店', '蔦屋併設スタバ'],
    },
    {
        id: 'yoyogi',
        place: '代々木公園',
        shortName: '代々木公園ラン',
        dayOfWeek: 0,
        time: '07:15',
        scheduleHref: '/schedule#yoyogi',
        courseHref: '/courses/yoyogi-park',
        distance: '約3〜6km',
        note: '日曜朝に、初参加でも入りやすいペースで走ります。',
        keywords: ['代々木', '織田フィールド', '原宿時計塔', 'runtrip base', 'nike原宿'],
    },
];

function withSchedule(context) {
    const schedule = SCHEDULE_BY_KEY.get(`${context.dayOfWeek}-${context.time}`);
    const regularLabel = schedule?.label || `${context.time}｜${context.place}`;

    return {
        ...context,
        regularLabel,
        meetingPlace: schedule?.location || '',
    };
}

export const BLOG_RUN_CONTEXTS = RUN_CONTEXTS.map(withSchedule);

function normalizeText(value = '') {
    return value.toLowerCase();
}

export function getBlogRunContext(post = {}) {
    const text = normalizeText(`${post.title || ''} ${post.description || ''}`);
    return BLOG_RUN_CONTEXTS.find((context) => (
        context.keywords.some((keyword) => text.includes(normalizeText(keyword)))
    )) || null;
}

function formatEventTimeJst(iso) {
    const utc = new Date(iso);
    if (Number.isNaN(utc.getTime())) return '';
    const jst = new Date(utc.getTime() + 9 * 60 * 60 * 1000);
    const hh = String(jst.getUTCHours()).padStart(2, '0');
    const mm = String(jst.getUTCMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
}

export function getUpcomingEventForRunContext(events = [], context = null) {
    if (!context) return null;

    return events.find((event) => (
        event?.dayOfWeek === context.dayOfWeek
        && formatEventTimeJst(event.startAt) === context.time
    )) || null;
}
