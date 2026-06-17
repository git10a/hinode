import Link from '@/components/SiteLink';
import styles from '../app/blog/[slug]/post.module.css';

const STRAVA_CLUB_URL = 'https://www.strava.com/clubs/1772485';

export default function PostBottomStrip({ compact = false, runContext = null }) {
    return (
        <section className={`${styles.bottomStrip} ${compact ? styles.bottomStripCompact : ''}`}>
            <div className={styles.bottomStripInner}>
                <div className={styles.bottomStripText}>
                    <p className={styles.bottomStripHeadline}>
                        {runContext ? (
                            <>
                                {runContext.shortName}が気になったら、<br />次は集合場所へ。
                            </>
                        ) : (
                            <>
                                まずは一度、<br />朝の空気を見に来てください。
                            </>
                        )}
                    </p>
                    <p className={styles.bottomStripSub}>
                        {runContext
                            ? `${runContext.regularLabel}、${runContext.meetingPlace}集合。予約不要・参加無料です。`
                            : '予約不要・参加無料。手ぶらで大丈夫です。'}
                    </p>
                </div>
                <div className={styles.bottomStripCta}>
                    <Link href={runContext?.scheduleHref || '/schedule'} className={styles.bottomStripBtnPrimary}>
                        {runContext ? `${runContext.place}の開催日程を見る →` : '開催日程を見る →'}
                    </Link>
                    {runContext ? (
                        <>
                            <Link href="/first-run" className={styles.bottomStripBtnSecondary}>
                                初参加ガイドを見る
                            </Link>
                            <Link href={runContext.courseHref} className={styles.bottomStripBtnSecondary}>
                                コースガイドを見る
                            </Link>
                        </>
                    ) : (
                        <a
                            href={STRAVA_CLUB_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.bottomStripBtnSecondary}
                        >
                            Stravaクラブを見る
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}
