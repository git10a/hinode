import Link from 'next/link';
import Image from 'next/image';
import { MEMBER_COUNT } from '../lib/stats';
import styles from './HomeContent.module.css';

const CHIPS = ['参加無料', '予約不要', '1人参加多め', '4km前後ゆっくり'];

const STRAVA_CLUB_ID = '1772485';

const WEEKLY_ITEMS = [
    {
        day: '水曜',
        dayIndex: 3,
        time: '06:30',
        place: '皇居',
        location: '桔梗門派出所前',
        image: '/assets/Kokyo.jpg',
        anchor: '/schedule#kokyo',
    },
    {
        day: '木曜',
        dayIndex: 4,
        time: '06:30',
        place: '目黒川',
        location: 'スタバ蔦屋書店前（中目黒）',
        image: '/assets/Meguro.png',
        anchor: '/schedule#meguro',
    },
    {
        day: '日曜',
        dayIndex: 0,
        time: '07:30',
        place: '代々木公園',
        location: '原宿時計塔前',
        image: '/assets/Yoyogi.png',
        anchor: '/schedule#yoyogi',
    },
];

const DAY_LABEL_JP = ['日', '月', '火', '水', '木', '金', '土'];

function formatEventDate(iso) {
    if (!iso) return null;
    const utc = new Date(iso);
    const jst = new Date(utc.getTime() + 9 * 60 * 60 * 1000);
    const m = jst.getUTCMonth() + 1;
    const d = jst.getUTCDate();
    const w = DAY_LABEL_JP[jst.getUTCDay()];
    return `${m}/${d}(${w})`;
}

function stravaEventUrl(eventId) {
    return `https://www.strava.com/clubs/${STRAVA_CLUB_ID}/group_events/${eventId}`;
}

const VALUES = [
    {
        title: '競争しない',
        desc: '速さではなく、朝の習慣を続けることを大切に。自分のペースでゆっくり走ります。',
        icon: (
            <svg viewBox="0 0 24 24" className={styles.valueIcon}>
                <circle cx="12" cy="5" r="2.2" />
                <path d="M9 10l2.5-1 2 2 2.5 0.5" />
                <path d="M10 13l-2 4" />
                <path d="M13.5 11.2l1 3.3 3 2.5" />
                <path d="M8 21l2-4" />
            </svg>
        ),
    },
    {
        title: '1人でも来やすい',
        desc: '初参加やソロ参加の方も毎回いらっしゃいますので、お気軽にお越しください。',
        icon: (
            <svg viewBox="0 0 24 24" className={styles.valueIcon}>
                <circle cx="8.5" cy="8.5" r="2.3" />
                <circle cx="15.5" cy="8.5" r="2.3" />
                <path d="M3.5 19c0-3 2.2-5 5-5s5 2 5 5" />
                <path d="M10.5 19c0-3 2.2-5 5-5s5 2 5 5" />
            </svg>
        ),
    },
    {
        title: '走った後も心地いい',
        desc: '走った後はコーヒーを飲んで帰る人も。急がず、朝の時間をそのまま楽しみます。',
        icon: (
            <svg viewBox="0 0 24 24" className={styles.valueIcon}>
                <path d="M5 9h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9z" />
                <path d="M16 11h2.5a2 2 0 0 1 0 4H16" />
                <path d="M8 4c0 1-1 1.5-1 2.5S8 8 8 9" />
                <path d="M12 4c0 1-1 1.5-1 2.5s1 1.5 1 2.5" />
            </svg>
        ),
    },
];

const STEPS = [
    {
        num: '1',
        head: '開催日の5分前に集合場所へ',
        desc: '当日予約不要・参加費無料。地図は開催日程ページから確認できます。',
    },
    {
        num: '2',
        head: '黄色いゴムバンドが目印',
        desc: '手首に黄色いゴムバンドをつけている人がHINODEです。「初めてです」と一声でも、無言で合流でも大丈夫です。',
    },
    {
        num: '3',
        head: '走った後は自由解散',
        desc: 'そのまま出勤する方、コーヒーを飲んで帰る方、それぞれです。',
    },
];

function formatDate(iso) {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}.${m}.${day}`;
}

export default function HomeContent({ latestPosts = [], upcomingEvents = [], memberCount = null }) {
    const displayedMemberCount = memberCount ?? MEMBER_COUNT;
    const regularDays = new Set(WEEKLY_ITEMS.map((i) => i.dayIndex));
    const regularCards = WEEKLY_ITEMS.map((item) => {
        const next = upcomingEvents.find((e) => e.dayOfWeek === item.dayIndex);
        return {
            ...item,
            nextDate: next ? formatEventDate(next.startAt) : null,
            href: next ? stravaEventUrl(next.eventId) : item.anchor,
            external: !!next,
        };
    });
    const adhocEvents = upcomingEvents
        .filter((e) => !regularDays.has(e.dayOfWeek))
        .slice(0, 2);

    return (
        <div className={styles.page}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.heroImageWrapper}>
                    <Image
                        src="/assets/Takeshiba.jpg"
                        alt=""
                        fill
                        priority
                        sizes="100vw"
                        className={styles.heroImage}
                    />
                    <div className={styles.heroOverlay} aria-hidden="true" />
                </div>

                <div className={styles.heroInner}>
                    <div className={styles.heroCopy}>
                        <p className={styles.heroBrand}>HINODE</p>
                        <h1 className={styles.heroHeadline}>
                            東京の朝を、<br />ひとりで終わらせない。
                        </h1>
                        <p className={styles.heroSub}>
                            人との競争ではなく、自分との約束を守り続けるためのコミュニティ。
                        </p>

                        <div className={styles.heroChips}>
                            {CHIPS.map((label) => (
                                <span key={label} className={styles.chip}>
                                    <span className={styles.chipDot} aria-hidden="true" />
                                    {label}
                                </span>
                            ))}
                        </div>

                        <div className={styles.heroCta}>
                            <Link href="/schedule" className={styles.ctaPrimary}>
                                開催日程・参加方法を見る
                                <span className={styles.ctaArrow} aria-hidden="true">→</span>
                            </Link>
                            <a
                                href="https://www.strava.com/clubs/hinode"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.ctaSecondary}
                            >
                                Stravaクラブを見る
                            </a>
                        </div>

                        <div className={styles.heroMeta}>
                            <svg viewBox="0 0 24 24" className={styles.heroMetaIcon} aria-hidden="true">
                                <circle cx="9" cy="9" r="3.2" />
                                <circle cx="16" cy="10" r="2.5" />
                                <path d="M3 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
                                <path d="M13 19c0-2.8 2.2-4.5 5-4.5s3.5 1.7 3.5 4.5" />
                            </svg>
                            <span>{displayedMemberCount} クラブメンバー</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Weekly schedule */}
            <section className={styles.weekly}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>今週の開催</h2>
                    <Link href="/schedule" className={styles.sectionMore}>
                        すべての開催日程を見る →
                    </Link>
                </div>
                <div className={styles.weeklyGrid}>
                    {regularCards.map((item) => {
                        const cardProps = item.external
                            ? { href: item.href, target: '_blank', rel: 'noopener noreferrer' }
                            : { href: item.href };
                        const Tag = item.external ? 'a' : Link;
                        return (
                            <Tag {...cardProps} key={item.place} className={styles.weeklyCard}>
                                <div className={styles.weeklyThumb}>
                                    <Image
                                        src={item.image}
                                        alt={item.place}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 380px"
                                    />
                                </div>
                                <div className={styles.weeklyBody}>
                                    <div className={styles.weeklyDay}>
                                        {item.nextDate && (
                                            <span className={styles.weeklyDate}>{item.nextDate}</span>
                                        )}
                                        <span className={styles.weeklyDayName}>{item.day} {item.time}</span>
                                        <span className={styles.weeklyDivider}>｜</span>
                                        <span className={styles.weeklyPlace}>{item.place}</span>
                                    </div>
                                    <p className={styles.weeklyLocation}>
                                        <svg viewBox="0 0 24 24" className={styles.weeklyLocationIcon} aria-hidden="true">
                                            <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" />
                                            <circle cx="12" cy="9" r="2.5" />
                                        </svg>
                                        {item.location}
                                    </p>
                                </div>
                            </Tag>
                        );
                    })}
                </div>

                {adhocEvents.length > 0 && (
                    <div className={styles.adhocBlock}>
                        <p className={styles.adhocLabel}>その他の開催</p>
                        <ul className={styles.adhocList}>
                            {adhocEvents.map((e) => (
                                <li key={e.eventId} className={styles.adhocItem}>
                                    <a
                                        href={stravaEventUrl(e.eventId)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.adhocLink}
                                    >
                                        <span className={styles.adhocDate}>{formatEventDate(e.startAt)}</span>
                                        <span className={styles.adhocTitle}>{e.title}</span>
                                        {e.address && (
                                            <span className={styles.adhocAddress}>{e.address}</span>
                                        )}
                                        <span className={styles.adhocArrow} aria-hidden="true">→</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </section>

            {/* Values */}
            <section className={styles.values}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>HINODEとは</h2>
                </div>
                <div className={styles.valuesGrid}>
                    {VALUES.map((v) => (
                        <div key={v.title} className={styles.valueItem}>
                            <div className={styles.valueIconWrap}>{v.icon}</div>
                            <h3 className={styles.valueTitle}>{v.title}</h3>
                            <p className={styles.valueDesc}>{v.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* First-timer steps */}
            <section className={styles.firstTime}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>初めて参加する方へ</h2>
                </div>
                <div className={styles.stepsGrid}>
                    {STEPS.map((s, idx) => (
                        <div key={s.num} className={styles.stepCard}>
                            <span className={styles.stepNum}>{s.num}</span>
                            <h3 className={styles.stepHead}>{s.head}</h3>
                            <p className={styles.stepDesc}>{s.desc}</p>
                            {idx < STEPS.length - 1 && (
                                <svg
                                    viewBox="0 0 24 24"
                                    width="22"
                                    height="22"
                                    className={styles.stepChevron}
                                    aria-hidden="true"
                                >
                                    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Latest posts */}
            {latestPosts.length > 0 && (
                <section className={styles.posts}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>朝の読みもの</h2>
                        <Link href="/blog" className={styles.sectionMore}>
                            すべてのブログを見る →
                        </Link>
                    </div>
                    <div className={styles.postsGrid}>
                        {latestPosts.map((post) => (
                            <Link href={`/blog/${post.id}`} key={post.id} className={styles.postCard}>
                                {post.thumbnail && (
                                    <div className={styles.postThumb}>
                                        <Image
                                            src={post.thumbnail.url}
                                            alt={post.title}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 380px"
                                        />
                                    </div>
                                )}
                                <time className={styles.postDate}>{formatDate(post.publishedAt)}</time>
                                <h3 className={styles.postTitle}>{post.title}</h3>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Closing CTA */}
            <section className={styles.closing}>
                <div className={styles.closingInner}>
                    <div className={styles.closingText}>
                        <p className={styles.closingHeadline}>
                            まずは一度、朝の空気を見に来てください。
                        </p>
                        <p className={styles.closingSub}>
                            予約不要・参加無料。手ぶらで大丈夫です。
                        </p>
                    </div>
                    <div className={styles.closingCta}>
                        <Link href="/schedule" className={`${styles.closingBtn} ${styles.closingBtnPrimary}`}>
                            開催日程を見る →
                        </Link>
                        <a
                            href="https://www.instagram.com/hinode_run/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${styles.closingBtn} ${styles.closingBtnSecondary}`}
                        >
                            Instagram
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
