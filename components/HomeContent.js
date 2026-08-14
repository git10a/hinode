import Link from '@/components/SiteLink';
import Image from 'next/image';
import { formatPostDate, getPostDisplayDate } from '../lib/blogPosts';
import { REGULAR_RUNS } from '../lib/regularRuns';
import { CITIES, getCityRuns } from '../lib/cities';
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
        image: '/assets/hinodekyoto1.jpg',
        alt: '京都での朝ラン',
    },
    {
        title: '1人でも来やすい',
        desc: '初参加やソロ参加の方も毎回いらっしゃいますので、お気軽にお越しください。',
        image: '/assets/hinodeyoyogi.jpg',
        alt: '代々木公園で走るHINODEメンバー',
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
            nextDate: next ? formatEventDate(next.startAt) : fallback.nextDate,
            nextTimestamp: next ? new Date(next.startAt).getTime() : fallback.nextTimestamp,
            detailsHref: item.anchor,
            stravaHref: next ? stravaEventUrl(next.eventId) : null,
            participantCount: next?.participantCount,
            participants: next?.participants || [],
        };
    })
        .sort((a, b) => a.nextTimestamp - b.nextTimestamp)
        .map((item, index) => ({
            ...item,
            isNext: index === 0,
        }));
    const adhocEvents = upcomingEvents
        .filter((e) => !regularDays.has(e.dayOfWeek))
        .slice(0, 2);
    const nextRun = regularCards[0];

    return (
        <div className={styles.page}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.heroImageWrapper}>
                    <Image
                        src="/assets/komazawa.jpg"
                        alt=""
                        fill
                        priority
                        sizes="100vw"
                        className={styles.heroImage}
                    />
                    <div className={styles.heroOverlay} aria-hidden="true" />
                </div>

                <div className={styles.heroInner}>
                    <div className={styles.heroLayout}>
                        <div className={styles.heroCopy}>
                            <p className={styles.heroBrand}>HINODE</p>
                            <h1 className={styles.heroHeadline}>
                                東京の朝ランコミュニティ
                            </h1>
                            <p className={styles.heroSub}>
                                皇居や代々木公園を中心に、毎朝だれかと気軽に走り続けられる場所をつくっています。
                            </p>

                            <a
                                href="https://www.bs-tvtokyo.co.jp/runners_salon/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.heroMediaMention}
                            >
                                BSテレ東「ランナーズサロン」で紹介されました ↗
                            </a>

                            <div className={styles.heroMeta}>
                                <span>{runCount !== null ? `累計 ${runCount}回開催` : '雨天を除き毎週開催'}</span>
                                <span>{CITIES.length}都市</span>
                                <span>{COMMUNITY_SINCE}から継続</span>
                            </div>
                            <a
                                href="https://www.strava.com/clubs/hinode"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.heroStravaLink}
                            >
                                Stravaでコミュニティを見る ↗
                            </a>
                        </div>

                        <aside className={styles.heroNextCard} aria-labelledby="next-run-title">
                            <p id="next-run-title" className={styles.heroNextLabel}>次の開催</p>
                            <div className={styles.heroNextDateRow}>
                                <span className={styles.heroNextDate}>{nextRun.nextDate}</span>
                                <span className={styles.heroNextTime}>{nextRun.time}</span>
                            </div>
                            <p className={styles.heroNextPlace}>{nextRun.place}</p>
                            <p className={styles.heroNextLocation}>
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" />
                                    <circle cx="12" cy="9" r="2.5" />
                                </svg>
                                {nextRun.location}
                            </p>
                            <div className={styles.heroFacts} aria-label="参加条件">
                                {COMMUNITY_PROMISES.map((promise) => <span key={promise}>{promise}</span>)}
                            </div>
                            <ParticipantPreview
                                count={nextRun.participantCount}
                                participants={nextRun.participants}
                                className={styles.heroParticipants}
                            />
                            <Link href={nextRun.detailsHref} className={styles.heroNextCta}>
                                参加方法を確認する
                                <span aria-hidden="true">→</span>
                            </Link>
                            {nextRun.stravaHref && (
                                <a
                                    href={nextRun.stravaHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.heroNextStrava}
                                >
                                    この開催をStravaで見る
                                </a>
                            )}
                        </aside>
                    </div>
                </div>
            </section>

            <section className={styles.cities} aria-labelledby="cities-title">
                <div className={styles.citiesInner}>
                    <div className={styles.sectionHeader}>
                        <div>
                            <p className={styles.citiesEyebrow}>ACTIVE CITIES</p>
                            <h2 id="cities-title" className={styles.sectionTitle}>HINODEの開催都市</h2>
                        </div>
                        <Link href="/cities" className={styles.sectionMore}>都市一覧を見る →</Link>
                    </div>
                    <div className={styles.cityGrid}>
                        {CITIES.map((city) => {
                            const cityRuns = getCityRuns(city.slug);
                            return (
                                <article key={city.slug} className={styles.cityCard}>
                                    <div className={styles.cityCardHead}>
                                        <h3>{city.label}</h3>
                                        <span>{city.status}</span>
                                    </div>
                                    <p>{city.description}</p>
                                    {cityRuns.length > 0 && (
                                        <ul className={styles.cityLocations}>
                                            {cityRuns.map((run) => (
                                                <li key={run.id}>
                                                    <Link href={run.detailHref}>
                                                        <span>{run.dayShort} {run.timeRaw}</span>
                                                        <strong>{run.place}</strong>
                                                        <small>{run.distance}・撮影なし</small>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    <Link href={`/cities/${city.slug}`} className={styles.cityMore}>{city.name}を見る →</Link>
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

            {/* Weekly schedule */}
            <section id="schedule" className={styles.weekly}>
                <div className={styles.weeklyInner}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>今週の開催</h2>
                    <Link href="/schedule" className={styles.sectionMore}>
                        すべての開催日程を見る →
                    </Link>
                </div>
                <div className={styles.weeklyGrid}>
                    {regularCards.map((item) => {
                        return (
                            <article
                                key={item.place}
                                className={`${styles.weeklyCard} ${item.isNext ? styles.weeklyCardNext : ''}`}
                            >
                                <Link href={item.detailsHref} className={styles.weeklyCardMain}>
                                    <div className={styles.weeklyMedia}>
                                        <div className={styles.weeklyThumb}>
                                            <Image
                                                src={item.image}
                                                alt={item.place}
                                                fill
                                                sizes="96px"
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
                                    <div className={styles.weeklyBody}>
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

                {adhocEvents.length > 0 && (
                    <div className={styles.adhocBlock}>
                        <div className={styles.adhocHeader}>
                            <div>
                                <h3 className={styles.adhocLabel}>土曜の企画ラン</h3>
                                <p className={styles.adhocLead}>
                                    土曜日は不定期で、目的地を決めたり、少し長めに走ったりする日があります。
                                </p>
                            </div>
                            <Link href="/schedule#monthly-calendar" className={styles.adhocHeaderLink}>
                                今月の日程を見る →
                            </Link>
                        </div>
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
                                        <ParticipantPreview
                                            count={e.participantCount}
                                            participants={e.participants}
                                            className={styles.adhocParticipants}
                                        />
                                        <span className={styles.adhocArrow} aria-hidden="true">→</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {adhocEvents.length === 0 && (
                    <div className={styles.occasionalTeaser}>
                        <p>
                            土曜日は不定期で、上野公園・木場公園・勝どきへ行ったり、横浜の日の出や東京マラソンEXPOを目的地にするランも開催しています。
                        </p>
                        <Link href="/schedule#monthly-calendar" className={styles.occasionalTeaserLink}>
                            今月の日程を見る →
                        </Link>
                    </div>
                )}
                </div>
            </section>

            {/* Values */}
            <section className={styles.values}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>HINODEとは</h2>
                </div>
                <p className={styles.valuesLead}>
                    HINODEは、速さや人数を競うためではなく、朝に走る習慣を続けるためのコミュニティです。東京と京都で、それぞれの街に合った形で活動しています。
                </p>
                <div className={styles.valuesGrid}>
                    {VALUES.map((v) => (
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
                <div className={styles.firstTimeCta}>
                    <Link href={FIRST_RUN_GUIDE_URL} className={styles.firstTimeCtaLink}>
                        初参加ガイドを見る
                        <span className={styles.firstTimeCtaArrow} aria-hidden="true">→</span>
                    </Link>
                    <Link href="/schedule" className={styles.firstTimeSubLink}>
                        次回の開催日程を見る
                    </Link>
                </div>
            </section>

            {/* Running services */}
            <section id="services" className={styles.services}>
                <div className={styles.servicesIntro}>
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
