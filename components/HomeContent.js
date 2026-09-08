import Link from '@/components/SiteLink';
import Image from 'next/image';
import { formatPostDate, getPostDisplayDate } from '../lib/blogPosts';
import { REGULAR_RUNS } from '../lib/regularRuns';
import { COMMUNITY_PROMISES, COMMUNITY_SINCE } from '../lib/communityPolicy';
import ParticipantPreview from './ParticipantPreview';
import styles from './HomeContent.module.css';

const STRAVA_CLUB_ID = '1772485';
const FIRST_RUN_GUIDE_URL = '/first-run';

const WEEKLY_ITEMS = REGULAR_RUNS.map((run) => ({
    id: run.id,
    day: run.dayShort,
    dayIndex: run.dayOfWeek,
    time: run.timeRaw,
    place: run.place,
    location: run.meetingShort,
    image: run.image,
    anchor: run.scheduleHref,
    recommendedForFirstRun: run.isFirstChoice,
}));

const DAY_LABEL_JP = ['日', '月', '火', '水', '木', '金', '土'];
const EVENT_DURATION_MINUTES = 60;

function formatEventDate(iso) {
    if (!iso) return null;
    const utc = new Date(iso);
    const jst = new Date(utc.getTime() + 9 * 60 * 60 * 1000);
    const m = jst.getUTCMonth() + 1;
    const d = jst.getUTCDate();
    const w = DAY_LABEL_JP[jst.getUTCDay()];
    return `${m}/${d}(${w})`;
}

function formatEventTime(iso) {
    if (!iso) return null;
    return new Intl.DateTimeFormat('ja-JP', {
        timeZone: 'Asia/Tokyo',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(new Date(iso));
}

function formatWallClockDate(date) {
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const w = DAY_LABEL_JP[date.getDay()];
    return `${m}/${d}(${w})`;
}

function getJstWallClockDate(date) {
    return new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
}

function getJstTimestamp(date) {
    return Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours() - 9,
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
    );
}

function getNextRegularEvent(item, now = new Date()) {
    const jstNow = getJstWallClockDate(now);
    const [hours, minutes] = item.time.split(':').map(Number);
    const currentMinutes = jstNow.getHours() * 60 + jstNow.getMinutes();
    const eventMinutes = hours * 60 + minutes;

    let daysUntil = item.dayIndex - jstNow.getDay();
    if (daysUntil < 0) {
        daysUntil += 7;
    } else if (daysUntil === 0 && currentMinutes >= eventMinutes + EVENT_DURATION_MINUTES) {
        daysUntil = 7;
    }

    const start = new Date(jstNow);
    start.setDate(start.getDate() + daysUntil);
    start.setHours(hours, minutes, 0, 0);

    return {
        nextDate: formatWallClockDate(start),
        nextTimestamp: getJstTimestamp(start),
    };
}

function stravaEventUrl(eventId) {
    return `https://www.strava.com/clubs/${STRAVA_CLUB_ID}/group_events/${eventId}`;
}

const VALUES = [
    {
        title: '競争しない',
        desc: '速さではなく、朝の習慣を続けることを大切に。自分のペースでゆっくり走ります。',
        image: '/assets/Yoyogi.jpg',
        alt: '朝の代々木公園の並木道',
    },
    {
        title: '1人でも来やすい',
        desc: '初参加やソロ参加の方も毎回いらっしゃいますので、お気軽にお越しください。',
        image: '/assets/hinodecoffee.jpg',
        alt: '朝の光が差すテーブルとコーヒー',
    },
    {
        title: '撮影しない',
        desc: '通常開催では参加者を撮影しません。誰かに見せるためではなく、朝の時間そのものを大切にします。',
        image: '/assets/about-hero-yokohama-sunrise.jpg',
        alt: '日の出前の朝の風景',
    },
];

const RUNNING_SERVICES = [
    {
        name: 'シューズマッチ',
        description: '質問に答えて、自分に合うランニングシューズを探せるサービス。',
        href: 'https://shoes-match.com/',
        label: 'シューズ選び',
    },
    {
        name: 'どこラン',
        description: '旅先でも、出張先でも、知らない土地で走れるコースが地図つきで見つかるサービス。',
        href: 'https://dokorun.com/',
        label: 'コース探し',
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
        head: '黒いHINODE Tシャツが目印',
        desc: '背中に「HINODE」と書かれた黒いTシャツを着た運営メンバーが目印です。「初めてです」と一声でも、無言で合流でも大丈夫です。',
    },
    {
        num: '3',
        head: '走った後は自由解散',
        desc: 'そのまま出勤する方、コーヒーを飲んで帰る方、それぞれです。',
    },
];

export default async function HomeContent({ latestPosts = [], upcomingEvents = [], runCount = null }) {
    const regularDays = new Set(WEEKLY_ITEMS.map((i) => i.dayIndex));
    const regularCards = WEEKLY_ITEMS.map((item) => {
        const next = upcomingEvents.find((e) => e.dayOfWeek === item.dayIndex);
        const fallback = getNextRegularEvent(item);
        return {
            ...item,
            type: 'regular',
            nextDate: next ? formatEventDate(next.startAt) : fallback.nextDate,
            nextTimestamp: next ? new Date(next.startAt).getTime() : fallback.nextTimestamp,
            detailsHref: item.anchor,
            stravaHref: next ? stravaEventUrl(next.eventId) : null,
            participantCount: next?.participantCount,
            participants: next?.participants || [],
        };
    }).sort((a, b) => a.nextTimestamp - b.nextTimestamp);
    const adhocEvents = upcomingEvents
        .filter((e) => !regularDays.has(e.dayOfWeek))
        .slice(0, 2)
        .map((event) => ({
            ...event,
            type: 'event',
            nextDate: formatEventDate(event.startAt),
            time: formatEventTime(event.startAt),
            nextTimestamp: new Date(event.startAt).getTime(),
            stravaHref: stravaEventUrl(event.eventId),
        }));
    const scheduleCards = [...regularCards, ...adhocEvents]
        .sort((a, b) => a.nextTimestamp - b.nextTimestamp)
        .map((item, index) => ({
            ...item,
            isNext: index === 0,
        }));
    const nextRun = regularCards[0];

    return (
        <div className={styles.page}>
            <section aria-labelledby="home-title">
                <div className={styles.heroIntro}>
                    <div>
                        <p className={styles.eyebrow}><span className={styles.sunDot} /> MORNING RUNNING COMMUNITY</p>
                        <h1 id="home-title" className={styles.heroHeadline}>東京の<br />朝ランコミュニティ<br />HINODE</h1>
                    </div>
                    <div className={styles.heroDescription}>
                        <p className={styles.heroSub}>いつもより早く起きて、だれかと走る。<br />それだけで、今日がずっと充実した日になる。</p>
                        <p className={styles.heroDetail}>皇居や代々木公園を中心に活動する、<br />東京の朝ランコミュニティ、HINODE。</p>
                        <Link href="/first-run" className={styles.textLink}>初めての方へ <span aria-hidden="true">↗</span></Link>
                    </div>
                </div>
                <div className={styles.heroLandscape}>
                    <Image src="/assets/komazawa.jpg" alt="静かな朝の公園に広がる朝焼け" fill priority sizes="100vw" className={styles.heroImage} />
                    <div className={styles.heroPhotoNote}><span>A NEW DAY, TOGETHER.</span></div>
                </div>
                <div className={styles.heroBottom}>
                    <aside className={styles.nextRun} aria-labelledby="next-run-title">
                        <p id="next-run-title" className={styles.nextLabel}><span className={styles.sunDot} /> NEXT RUN<span>次の定例ラン</span></p>
                        <div className={styles.nextDate}><span>{nextRun.nextDate}</span><span>{nextRun.time}</span></div>
                        <div className={styles.nextPlace}><strong>{nextRun.place}</strong><span>{nextRun.location}</span></div>
                        <ParticipantPreview count={nextRun.participantCount} participants={nextRun.participants} />
                        <Link href={nextRun.detailsHref} className={styles.nextLink}>参加方法を見る <span aria-hidden="true">↗</span></Link>
                    </aside>
                    <div className={styles.promiseStrip}>
                        <div>{COMMUNITY_PROMISES.map((promise) => <span key={promise}>{promise}</span>)}</div>
                        <span>SINCE {COMMUNITY_SINCE}</span>
                    </div>
                </div>
            </section>

            {/* Weekly schedule */}
            <section id="schedule" className={styles.weekly}>
                <div>
                <div className={styles.sectionHeader}>
                    <div><p className={styles.eyebrow}>01 / RUN WITH US</p><h2 className={styles.sectionTitle}>今週、どこで走ろう。</h2></div>
                    <Link href="/schedule" className={styles.sectionMore}>
                        すべての開催日程を見る →
                    </Link>
                </div>
                <div className={styles.weeklyGrid}>
                    {scheduleCards.map((item) => {
                        if (item.type === 'event') {
                            return (
                                <article
                                    key={`event-${item.eventId}-${item.startAt}`}
                                    className={styles.weeklyCard}
                                >
                                    <a
                                        href={item.stravaHref}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.weeklyCardMain}
                                    >
                                        <div className={styles.weeklyEventBody}>
                                            <div className={styles.weeklyDay}>
                                                <span className={styles.weeklyDate}>{item.nextDate}</span>
                                                <span className={styles.weeklyTime}>{item.time}</span>
                                            </div>
                                            <h3 className={styles.weeklyEventTitle}>{item.title}</h3>
                                            {item.address && (
                                                <p className={styles.weeklyLocation}>
                                                    <svg viewBox="0 0 24 24" className={styles.weeklyLocationIcon} aria-hidden="true">
                                                        <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" />
                                                        <circle cx="12" cy="9" r="2.5" />
                                                    </svg>
                                                    {item.address}
                                                </p>
                                            )}
                                            <ParticipantPreview
                                                count={item.participantCount}
                                                participants={item.participants}
                                                className={styles.weeklyParticipants}
                                            />
                                        </div>
                                    </a>
                                    <div className={styles.weeklyCardActions}>
                                        <div className={styles.weeklySecondaryActions}>
                                            <a
                                                href={item.stravaHref}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.weeklyStravaButton}
                                            >
                                                Stravaで詳細を見る
                                            </a>
                                            <Link href={FIRST_RUN_GUIDE_URL} className={styles.weeklyGuideButton}>
                                                初参加ガイドを見る
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            );
                        }

                        return (
                            <article
                                key={`regular-${item.id}`}
                                className={styles.weeklyCard}
                            >
                                <Link href={item.detailsHref} className={styles.weeklyCardMain}>
                                    <div className={styles.weeklyMedia}>
                                        <div className={styles.weeklyThumb}>
                                            <Image
                                                src={item.image}
                                                alt={item.place}
                                                fill
                                                sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 33vw"
                                            />
                                        </div>
                                        {(item.isNext || item.recommendedForFirstRun) && (
                                            <div className={styles.weeklyBadges}>
                                                {item.isNext && (
                                                    <span className={styles.weeklyNextBadge}>次の開催</span>
                                                )}
                                                {item.recommendedForFirstRun && (
                                                    <span className={styles.weeklyRecommendBadge}>初参加におすすめ</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className={styles.weeklyDay}>
                                            {item.nextDate && (
                                                <span className={styles.weeklyDate}>{item.nextDate}</span>
                                            )}
                                            <span className={styles.weeklyTime}>{item.time}</span>
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
                                        <ParticipantPreview
                                            count={item.participantCount}
                                            participants={item.participants}
                                            className={styles.weeklyParticipants}
                                        />
                                    </div>
                                </Link>
                                <div className={styles.weeklyCardActions}>
                                    <div className={styles.weeklySecondaryActions}>
                                        {item.stravaHref && (
                                            <a
                                                href={item.stravaHref}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.weeklyStravaButton}
                                            >
                                                Stravaで詳細を見る
                                            </a>
                                        )}
                                        <Link href={FIRST_RUN_GUIDE_URL} className={styles.weeklyGuideButton}>
                                            初参加ガイドを見る
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
                    <div className={styles.startCityCta}>
                        <div>
                            <p className={styles.startCityLabel}>START IN YOUR CITY</p>
                            <h3>自分の街でHINODEを始める</h3>
                            <p>参加したい方も、ホストしたい方も。エリアと希望曜日から知らせてください。</p>
                        </div>
                        <Link href="/start" className={styles.startCityLink}>募集ページを見る →</Link>
                    </div>
                </div>
            </section>

            <div className={styles.communityNote}>
                <span>{runCount !== null ? `これまでに ${runCount} 回、朝をともに。` : '雨天を除き、毎週開催しています。'}</span>
                <a href="https://www.bs-tvtokyo.co.jp/runners_salon/" target="_blank" rel="noopener noreferrer">BSテレ東「ランナーズサロン」で紹介されました ↗</a>
            </div>

            {/* Values */}
            <section className={styles.values}>
                <div className={styles.sectionHeader}>
                    <div><p className={styles.eyebrow}>02 / OUR PHILOSOPHY</p><h2 className={styles.sectionTitle}>いい朝を、続けよう。</h2></div><Link href="/about" className={styles.sectionMore}>HINODEとは ↗</Link>
                </div>
                <p className={styles.valuesLead}>
                    HINODEは、速さや人数を競うためではなく、朝に走る習慣を続けるためのコミュニティです。東京と京都で、それぞれの街に合った形で活動しています。
                </p>
                <div className={styles.valuesGrid}>
                    {VALUES.map((v, index) => (
                        <div key={v.title} className={styles.valueItem}>
                            <div className={styles.valueImageWrap}>
                                <Image
                                    src={v.image}
                                    alt={v.alt}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 380px"
                                    className={styles.valueImage}
                                />
                            </div>
                            <span className={styles.valueNumber}>0{index + 1}</span><h3 className={styles.valueTitle}>{v.title}</h3>
                            <p className={styles.valueDesc}>{v.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* First-timer steps */}
            <section className={styles.firstTime}>
                <div className={styles.sectionHeader}>
                    <div><p className={styles.eyebrow}>03 / YOUR FIRST MORNING</p><h2 className={styles.sectionTitle}>いつもの靴で、<br />いつもと違う朝へ。</h2></div>
                </div>
                <div className={styles.stepsGrid}>
                    {STEPS.map((s, idx) => (
                        <div key={s.num} className={styles.stepCard}>
                            <span className={styles.stepNum}>0{s.num}</span>
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
                <div className={styles.firstTimeCta}>
                    <Link href={FIRST_RUN_GUIDE_URL} className={styles.firstTimeCtaLink}>
                        初参加ガイドを見る
                        <span aria-hidden="true">→</span>
                    </Link>
                    <Link href="/schedule" className={styles.firstTimeSubLink}>
                        次回の開催日程を見る
                    </Link>
                </div>
            </section>

            {/* Running services */}
            <section id="services" className={styles.services}>
                <div>
                    <p className={styles.servicesEyebrow}>OTHER PROJECTS</p>
                    <h2 className={styles.servicesTitle}>ランニングに関する取り組み</h2>
                    <p className={styles.servicesLead}>HINODE Communityとは別に運営しているサービスです。</p>
                </div>
                <div className={styles.servicesGrid}>
                    {RUNNING_SERVICES.map((service) => (
                        <a key={service.name} href={service.href} target="_blank" rel="noopener noreferrer" className={styles.serviceCard}>
                            <span className={styles.serviceLabel}>{service.label}</span>
                            <h3 className={styles.serviceName}>{service.name}</h3>
                            <p className={styles.serviceDescription}>{service.description}</p>
                            <span className={styles.serviceLink}>サービスを見る <span aria-hidden="true">↗</span></span>
                        </a>
                    ))}
                </div>
            </section>

            {/* Latest posts */}
            {latestPosts.length > 0 && (
                <section className={styles.posts}>
                    <div className={styles.sectionHeader}>
                        <div><p className={styles.eyebrow}>JOURNAL</p><h2 className={styles.sectionTitle}>朝の読みもの。</h2></div>
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
                                <time className={styles.postDate} dateTime={getPostDisplayDate(post)}>
                                    {formatPostDate(getPostDisplayDate(post))}
                                </time>
                                <h3 className={styles.postTitle}>{post.title}</h3>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Closing CTA */}
            <section className={styles.closing}>
                <div className={styles.closingInner}>
                    <div>
                        <p className={styles.eyebrow}>SEE YOU IN THE MORNING</p><p className={styles.closingHeadline}>
                            次の朝、<br />お会いしましょう。
                        </p>
                        <p className={styles.closingSub}>
                            予約不要・参加無料。いつものランニングの準備で。
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
                        <a
                            href="https://www.strava.com/clubs/hinode"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${styles.closingBtn} ${styles.closingBtnSecondary}`}
                        >
                            Strava
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
