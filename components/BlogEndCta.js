'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '../app/blog/[slug]/post.module.css';

const STRAVA_CLUB_URL = 'https://www.strava.com/clubs/hinode';

function detectLocation(post) {
    const hay = `${post.title || ''} ${post.description || ''}`.toLowerCase();
    if (hay.includes('皇居') || hay.includes('kokyo')) {
        return { name: '皇居', dayOfWeek: 3, dayLabel: '水曜', time: '6:30' };
    }
    if (hay.includes('目黒') || hay.includes('meguro')) {
        return { name: '目黒川', dayOfWeek: 4, dayLabel: '木曜', time: '6:30' };
    }
    if (hay.includes('代々木') || hay.includes('yoyogi')) {
        return { name: '代々木公園', dayOfWeek: 0, dayLabel: '日曜', time: '7:30' };
    }
    return null;
}

function nextDateText(dayOfWeek) {
    const now = new Date();
    const jst = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
    let daysUntil = dayOfWeek - jst.getDay();
    if (daysUntil < 0) daysUntil += 7;
    if (daysUntil === 0 && jst.getHours() >= 12) daysUntil = 7;
    const d = new Date(jst);
    d.setDate(d.getDate() + daysUntil);
    return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function BlogEndCta({ post }) {
    const [dateText, setDateText] = useState('');
    const loc = detectLocation(post);

    useEffect(() => {
        if (loc) setDateText(nextDateText(loc.dayOfWeek));
    }, [loc]);

    return (
        <aside className={styles.endCta}>
            {loc ? (
                <>
                    <p className={styles.endCtaLead}>
                        次の{loc.name}ランの開催は{' '}
                        <strong className={styles.endCtaDate}>
                            {dateText || '--/--'}（{loc.dayLabel}）{loc.time}
                        </strong>
                        。
                    </p>
                    <p className={styles.endCtaSub}>参加表明や詳細は Strava クラブから。</p>
                </>
            ) : (
                <>
                    <p className={styles.endCtaLead}>
                        HINODEは皇居（水曜）・目黒川（木曜）・代々木公園（日曜）で毎週開催しています。
                    </p>
                    <p className={styles.endCtaSub}>参加表明や詳細は Strava クラブから。</p>
                </>
            )}
            <div className={styles.endCtaActions}>
                <a
                    href={STRAVA_CLUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.endCtaBtnPrimary}
                >
                    Stravaクラブを見る
                </a>
                <Link href="/schedule" className={styles.endCtaBtnSecondary}>
                    開催日程を見る →
                </Link>
            </div>
        </aside>
    );
}
