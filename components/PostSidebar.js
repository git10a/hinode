import Link from '@/components/SiteLink';
import SCHEDULE_ITEMS from '../lib/scheduleItems';
import styles from '../app/blog/[slug]/post.module.css';

const STRAVA_CLUB_URL = 'https://www.strava.com/clubs/1772485';
const FIRST_RUN_GUIDE_URL = '/first-run';
const DAY_LABEL_JP = ['日', '月', '火', '水', '木', '金', '土'];
const SCHEDULE_LOCATION_BY_KEY = new Map(
    SCHEDULE_ITEMS.map((item) => [`${item.dayOfWeek}-${item.time}`, item.location])
);
const FIXED_LOCATION_BY_TITLE = [
    { pattern: /代々木/, location: '原宿時計塔前' },
    { pattern: /目黒|中目黒/, location: '中目黒駅 蔦屋併設スタバ前' },
    { pattern: /皇居/, location: '桔梗門派出所前' },
];

function formatNext(iso) {
    const utc = new Date(iso);
    const jst = new Date(utc.getTime() + 9 * 60 * 60 * 1000);
    const m = jst.getUTCMonth() + 1;
    const d = jst.getUTCDate();
    const w = DAY_LABEL_JP[jst.getUTCDay()];
    const hh = String(jst.getUTCHours()).padStart(2, '0');
    const mm = String(jst.getUTCMinutes()).padStart(2, '0');
    return { date: `${m}/${d}(${w})`, time: `${hh}:${mm}` };
}

function getEventLocation(event, formattedTime) {
    const title = event?.title || '';
    const fixedByTitle = FIXED_LOCATION_BY_TITLE.find(({ pattern }) => pattern.test(title));
    if (fixedByTitle) return fixedByTitle.location;

    const fixedBySchedule = SCHEDULE_LOCATION_BY_KEY.get(`${event?.dayOfWeek}-${formattedTime}`);
    if (fixedBySchedule) return fixedBySchedule;

    const address = event?.address?.trim();
    if (address) return address;
    return '';
}

function stravaEventUrl(eventId) {
    return `${STRAVA_CLUB_URL}/group_events/${eventId}`;
}

function SidebarParticipants({ count, participants = [] }) {
    if (!count) return null;
    const overflowCount = Math.max(0, count - participants.length);

    return (
        <div className={styles.sidebarParticipants} aria-label={`${count}人が参加予定`}>
            {participants.length > 0 && (
                <span className={styles.sidebarParticipantAvatars} aria-hidden="true">
                    {participants.map((participant) => (
                        <img
                            key={participant.id}
                            src={participant.image}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className={styles.sidebarParticipantAvatar}
                        />
                    ))}
                    {overflowCount > 0 && (
                        <span className={styles.sidebarParticipantOverflow}>+{overflowCount}</span>
                    )}
                </span>
            )}
            <span className={styles.sidebarParticipantText}>{count}人が参加予定</span>
        </div>
    );
}

export default function PostSidebar({ nextEvent, runContext = null, contextEvent = null }) {
    const displayEvent = contextEvent || (!runContext ? nextEvent : null);
    const next = displayEvent ? formatNext(displayEvent.startAt) : null;
    const nextLocation = runContext?.meetingPlace || (next ? getEventLocation(displayEvent, next.time) : '');
    const nextEventHref = displayEvent?.eventId ? stravaEventUrl(displayEvent.eventId) : null;
    const scheduleText = next ? `${next.date} ${next.time}` : runContext?.regularLabel;
    const sidebarTitle = runContext
        ? `次回の${runContext.shortName}日程`
        : '次のHINODEグループラン';

    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarCard}>
                <div className={styles.sidebarHead}>
                    <svg viewBox="0 0 24 24" className={styles.sidebarIcon} aria-hidden="true">
                        <circle cx="12" cy="12" r="3.6" fill="currentColor" />
                        <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                            <line x1="12" y1="3" x2="12" y2="5.5" />
                            <line x1="12" y1="18.5" x2="12" y2="21" />
                            <line x1="3" y1="12" x2="5.5" y2="12" />
                            <line x1="18.5" y1="12" x2="21" y2="12" />
                            <line x1="5.6" y1="5.6" x2="7.4" y2="7.4" />
                            <line x1="16.6" y1="16.6" x2="18.4" y2="18.4" />
                            <line x1="5.6" y1="18.4" x2="7.4" y2="16.6" />
                            <line x1="16.6" y1="7.4" x2="18.4" y2="5.6" />
                        </g>
                    </svg>
                    <h2 className={styles.sidebarTitle}>{sidebarTitle}</h2>
                </div>

                {scheduleText ? (
                    <p className={styles.sidebarLead}>
                        <span className={styles.sidebarEventMeta}>
                            <strong>{scheduleText}</strong>
                            <Link href={runContext?.scheduleHref || '/schedule'} className={styles.sidebarScheduleLink}>
                                他の日程↗
                            </Link>
                        </span>
                        {nextLocation && (
                            <span className={styles.sidebarLocation}>
                                <svg viewBox="0 0 24 24" className={styles.sidebarLocationIcon} aria-hidden="true">
                                    <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" />
                                    <circle cx="12" cy="9" r="2.5" />
                                </svg>
                                <span className={styles.sidebarLocationText}>{nextLocation}</span>
                            </span>
                        )}
                        <span className={styles.sidebarSubLine}>
                            {runContext ? runContext.note : '一緒に、気持ちのいい朝を過ごしましょう。'}
                        </span>
                    </p>
                ) : (
                    <p className={styles.sidebarLead}>
                        一緒に、気持ちのいい朝を過ごしましょう。
                    </p>
                )}

                <SidebarParticipants
                    count={displayEvent?.participantCount}
                    participants={displayEvent?.participants}
                />

                {nextEventHref && (
                    <a
                        href={nextEventHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.sidebarJoinEvent}
                    >
                        <img src="/assets/strava.png" alt="" loading="lazy" decoding="async" className={styles.sidebarJoinLogo} />
                        Stravaで参加する
                        <span className={styles.sidebarBtnArrow} aria-hidden="true">›</span>
                    </a>
                )}

                {!runContext && (
                    <div className={styles.sidebarActions}>
                        <Link href={FIRST_RUN_GUIDE_URL} className={styles.sidebarBtnSecondary}>
                            <svg viewBox="0 0 24 24" className={styles.sidebarBtnIcon} aria-hidden="true">
                                <path d="M6 20V5" />
                                <path d="M6 6.5c2.8-1.7 5.1 1.2 8 0 1.1-.5 2-.9 3.5-.5v7.2c-1.5-.4-2.4 0-3.5.5-2.9 1.2-5.2-1.7-8 0" />
                            </svg>
                            初参加ガイドを見る
                            <span className={styles.sidebarBtnArrow} aria-hidden="true">›</span>
                        </Link>
                        <a
                            href={STRAVA_CLUB_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.sidebarBtnTertiary}
                        >
                            <img src="/assets/strava.png" alt="" loading="lazy" decoding="async" className={styles.sidebarBtnLogo} />
                            Stravaクラブを見る
                            <span className={styles.sidebarBtnArrow} aria-hidden="true">›</span>
                        </a>
                    </div>
                )}
            </div>
        </aside>
    );
}
