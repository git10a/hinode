import Link from 'next/link';
import styles from '../app/blog/[slug]/post.module.css';

const STRAVA_CLUB_URL = 'https://www.strava.com/clubs/1772485';

export default function PostBottomStrip() {
    return (
        <section className={styles.bottomStrip}>
            <div className={styles.bottomStripInner}>
                <div className={styles.bottomStripText}>
                    <p className={styles.bottomStripHeadline}>
                        まずは一度、<br />朝の空気を見に来てください。
                    </p>
                    <p className={styles.bottomStripSub}>
                        予約不要・参加無料。手ぶらで大丈夫です。
                    </p>
                </div>
                <div className={styles.bottomStripCta}>
                    <Link href="/schedule" className={styles.bottomStripBtnPrimary}>
                        開催日程を見る →
                    </Link>
                    <a
                        href={STRAVA_CLUB_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.bottomStripBtnSecondary}
                    >
                        Stravaクラブを見る
                    </a>
                </div>
            </div>
        </section>
    );
}
