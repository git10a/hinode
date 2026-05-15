import Link from 'next/link';
import styles from '../app/blog/[slug]/post.module.css';

const STRAVA_CLUB_URL = 'https://www.strava.com/clubs/1772485';
const DAY_LABEL_JP = ['日', '月', '火', '水', '木', '金', '土'];

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

export default function PostSidebar({ nextEvent }) {
    const next = nextEvent ? formatNext(nextEvent.startAt) : null;

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
                    <h2 className={styles.sidebarTitle}>次のHINODEグループラン</h2>
                </div>

                {next ? (
                    <p className={styles.sidebarLead}>
                        <strong>{next.date} {next.time}</strong>
                        <span className={styles.sidebarSubLine}>一緒に、気持ちのいい朝を過ごしましょう。</span>
                    </p>
                ) : (
                    <p className={styles.sidebarLead}>
                        一緒に、気持ちのいい朝を過ごしましょう。
                    </p>
                )}

                <SidebarParticipants
                    count={nextEvent?.participantCount}
                    participants={nextEvent?.participants}
                />

                <div className={styles.sidebarActions}>
                    <Link href="/schedule" className={styles.sidebarBtnPrimary}>
                        <svg viewBox="0 0 24 24" className={styles.sidebarBtnIcon} aria-hidden="true">
                            <rect x="4" y="5" width="16" height="15" rx="2" />
                            <line x1="4" y1="9.5" x2="20" y2="9.5" />
                            <line x1="8" y1="3.5" x2="8" y2="6.5" />
                            <line x1="16" y1="3.5" x2="16" y2="6.5" />
                        </svg>
                        開催日程を見る
                        <span className={styles.sidebarBtnArrow} aria-hidden="true">›</span>
                    </Link>
                    <a
                        href={STRAVA_CLUB_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.sidebarBtnSecondary}
                    >
                        <svg viewBox="0 0 24 24" className={styles.sidebarBtnIcon} aria-hidden="true">
                            <path d="M9 4l5 10h-3l-2-4-2 4H4z" fill="currentColor" stroke="none" />
                            <path d="M14 14l3 6 3-6h-2l-1 2-1-2z" fill="currentColor" stroke="none" />
                        </svg>
                        Stravaクラブを見る
                        <span className={styles.sidebarBtnArrow} aria-hidden="true">›</span>
                    </a>
                </div>
            </div>
        </aside>
    );
}
