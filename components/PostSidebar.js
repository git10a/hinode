import Link from '@/components/SiteLink';
import LocationPinIcon from '@/components/LocationPinIcon';
import ParticipantPreview from '@/components/ParticipantPreview';
import { getEventMeetingPlace } from '@/lib/blogRunContext';
import { formatMonthDayJst, formatTimeJst } from '@/lib/jstDate';
import { STRAVA_CLUB_URL, stravaEventUrl } from '@/lib/site';
import styles from '@/app/blog/[slug]/post.module.css';

const PARTICIPANT_CLASSES = {
    root: styles.sidebarParticipants,
    avatars: styles.sidebarParticipantAvatars,
    avatar: styles.sidebarParticipantAvatar,
    overflow: styles.sidebarParticipantOverflow,
    text: styles.sidebarParticipantText,
};

// runContext（記事が特定の定例ランの話題）があればその回を、無ければ直近のイベントを案内する
export default function PostSidebar({ nextEvent, runContext = null, contextEvent = null }) {
    const scheduleEvent = contextEvent || (!runContext ? nextEvent : null);
    const stravaEvent = contextEvent || nextEvent;
    const nextLocation = runContext?.meetingPlace || (scheduleEvent ? getEventMeetingPlace(scheduleEvent) : '');
    const nextEventHref = stravaEvent?.eventId ? stravaEventUrl(stravaEvent.eventId) : null;
    const scheduleText = scheduleEvent
        ? `${formatMonthDayJst(scheduleEvent.startAt)} ${formatTimeJst(scheduleEvent.startAt)}`
        : runContext?.regularLabel;
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
                                <LocationPinIcon className={styles.sidebarLocationIcon} />
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

                <ParticipantPreview
                    count={stravaEvent?.participantCount}
                    participants={stravaEvent?.participants}
                    classes={PARTICIPANT_CLASSES}
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
                        <Link href="/first-run" className={styles.sidebarBtnSecondary}>
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
