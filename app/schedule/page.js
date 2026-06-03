import Link from 'next/link';
import Image from 'next/image';
import styles from './schedule.module.css';
import NextRunDate from '../../components/NextRunDate';
import PostBottomStrip from '../../components/PostBottomStrip';
import ParticipantPreview from '../../components/ParticipantPreview';
import ShareScheduleButton from '../../components/ShareScheduleButton';
import { getUpcomingGroupEvents } from '../../lib/strava';

export const metadata = {
    title: 'HINODEのグループラン日程｜皇居・目黒川・代々木公園',
    description: 'HINODEの日の出ラン開催日程ページです。皇居・目黒川・代々木公園で毎週開催。土曜日は不定期の企画ランも開催。曜日、時間、集合場所、距離、Stravaイベントへの導線をまとめています。',
};

export const dynamic = 'force-dynamic';

const STRAVA_CLUB_ID = '1772485';
const STRAVA_CLUB_URL = `https://www.strava.com/clubs/${STRAVA_CLUB_ID}`;
const EVENT_DURATION_MINUTES = 60;
const SITE_URL = 'https://hinode-run.com';
const EVENT_PERFORMER = { "@type": "PerformingGroup", "name": "HINODE" };
const FIRST_RUN_GUIDE_URL = '/first-run';
const DAY_LABEL_JP = ['日', '月', '火', '水', '木', '金', '土'];

function stravaEventUrl(eventId) {
    return `https://www.strava.com/clubs/${STRAVA_CLUB_ID}/group_events/${eventId}`;
}

function getJstWallClockDate(date) {
    return new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
}

function pad2(value) {
    return String(value).padStart(2, '0');
}

function formatJstDateTime(date) {
    const year = date.getFullYear();
    const month = pad2(date.getMonth() + 1);
    const day = pad2(date.getDate());
    const hours = pad2(date.getHours());
    const minutes = pad2(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}:00+09:00`;
}

function getNextEventStart(dayOfWeek, time, now = new Date()) {
    const jstNow = getJstWallClockDate(now);
    const [hours, minutes] = time.split(':').map(Number);
    const currentMinutes = jstNow.getHours() * 60 + jstNow.getMinutes();
    const eventMinutes = hours * 60 + minutes;

    let daysUntil = dayOfWeek - jstNow.getDay();
    if (daysUntil < 0) {
        daysUntil += 7;
    } else if (daysUntil === 0 && currentMinutes >= eventMinutes + EVENT_DURATION_MINUTES) {
        daysUntil = 7;
    }

    const start = new Date(jstNow);
    start.setDate(start.getDate() + daysUntil);
    start.setHours(hours, minutes, 0, 0);

    return start;
}

function eventDateFields(dayOfWeek, time, now) {
    const start = getNextEventStart(dayOfWeek, time, now);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + EVENT_DURATION_MINUTES);

    return {
        startDate: formatJstDateTime(start),
        endDate: formatJstDateTime(end),
    };
}

function createFreeOffer(dayOfWeek, time, now, sectionId) {
    const validFrom = getNextEventStart(dayOfWeek, time, now);
    validFrom.setDate(validFrom.getDate() - 7);

    return {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "JPY",
        "availability": "https://schema.org/InStock",
        "url": `${SITE_URL}/schedule#${sectionId}`,
        "validFrom": formatJstDateTime(validFrom),
    };
}

function assetUrl(path) {
    return `${SITE_URL}${path}`;
}

function createEventsJsonLd(now = new Date()) {
    return [
        {
            "@context": "https://schema.org",
            "@type": "Event",
            "name": "皇居の日の出ラン｜HINODE",
            "url": `${SITE_URL}/schedule#kokyo`,
            "image": [
                assetUrl('/assets/kokyo-run-map.png'),
                assetUrl('/assets/Kokyo.jpg'),
            ],
            "description": "毎週水曜6:00から皇居で開催する日の出ラン。約5km、左回りで1周。参加無料・予約不要。",
            ...eventDateFields(3, '06:00', now),
            "eventSchedule": { "@type": "Schedule", "repeatFrequency": "P1W", "byDay": "https://schema.org/Wednesday", "startTime": "06:00", "scheduleTimezone": "Asia/Tokyo" },
            "location": { "@type": "Place", "name": "桔梗門前派出所", "address": { "@type": "PostalAddress", "addressLocality": "東京都千代田区", "addressCountry": "JP" } },
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "eventStatus": "https://schema.org/EventScheduled",
            "organizer": { "@type": "SportsClub", "name": "HINODE", "url": "https://hinode-run.com/" },
            "performer": EVENT_PERFORMER,
            "offers": createFreeOffer(3, '06:00', now, 'kokyo')
        },
        {
            "@context": "https://schema.org",
            "@type": "Event",
            "name": "目黒川の日の出ラン｜HINODE",
            "url": `${SITE_URL}/schedule#meguro`,
            "image": [
                assetUrl('/assets/meguro-run-map.png'),
                assetUrl('/assets/Meguro.png'),
            ],
            "description": "毎週木曜6:00から中目黒で開催する日の出ラン。約4km、目黒川沿いを1周。参加無料・予約不要。",
            ...eventDateFields(4, '06:00', now),
            "eventSchedule": { "@type": "Schedule", "repeatFrequency": "P1W", "byDay": "https://schema.org/Thursday", "startTime": "06:00", "scheduleTimezone": "Asia/Tokyo" },
            "location": { "@type": "Place", "name": "スターバックス 中目黒蔦屋書店前", "address": { "@type": "PostalAddress", "addressLocality": "東京都目黒区", "addressCountry": "JP" } },
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "eventStatus": "https://schema.org/EventScheduled",
            "organizer": { "@type": "SportsClub", "name": "HINODE", "url": "https://hinode-run.com/" },
            "performer": EVENT_PERFORMER,
            "offers": createFreeOffer(4, '06:00', now, 'meguro')
        },
        {
            "@context": "https://schema.org",
            "@type": "Event",
            "name": "代々木公園の日の出ラン｜HINODE",
            "url": `${SITE_URL}/schedule#yoyogi`,
            "image": [
                assetUrl('/assets/yoyogi-run-map.png'),
                assetUrl('/assets/Yoyogi.png'),
            ],
            "description": "毎週日曜7:10から代々木公園で開催する日の出ラン。約2〜4km、左回りで1、2周。参加無料・予約不要。",
            ...eventDateFields(0, '07:10', now),
            "eventSchedule": { "@type": "Schedule", "repeatFrequency": "P1W", "byDay": "https://schema.org/Sunday", "startTime": "07:10", "scheduleTimezone": "Asia/Tokyo" },
            "location": { "@type": "Place", "name": "原宿時計塔前", "address": { "@type": "PostalAddress", "addressLocality": "東京都渋谷区", "addressCountry": "JP" } },
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "eventStatus": "https://schema.org/EventScheduled",
            "organizer": { "@type": "SportsClub", "name": "HINODE", "url": "https://hinode-run.com/" },
            "performer": EVENT_PERFORMER,
            "offers": createFreeOffer(0, '07:10', now, 'yoyogi')
        }
    ];
}

function formatUpcomingRunStart(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayName = DAY_LABEL_JP[date.getDay()];
    const hours = pad2(date.getHours());
    const minutes = pad2(date.getMinutes());

    return {
        date: `${month}/${day}(${dayName})`,
        time: `${hours}:${minutes}`,
    };
}

function applyScheduledTime(date, time) {
    const [hours, minutes] = time.split(':').map(Number);
    const scheduled = new Date(date);
    scheduled.setHours(hours, minutes, 0, 0);
    return scheduled;
}

const faqItems = [
    {
        question: '1人で行っても大丈夫ですか？',
        answer: '大丈夫です。1人参加の方も多く、予約や事前連絡なしで参加できます。',
    },
    {
        question: '速く走れないとダメですか？',
        answer: '大丈夫です。会話しながら走れるくらいのペースで、無理なく走ります。',
    },
    {
        question: '参加費や予約は必要ですか？',
        answer: '参加無料・予約不要です。開催日程と集合場所を確認して、そのまま集合場所へ来てください。',
    },
    {
        question: 'Stravaをやっていなくても参加できますか？',
        answer: '参加できます。Stravaは参加表明や記録に使えますが、必須ではありません。',
    },
];

const RUNS = [
    {
        id: 'kokyo',
        name: '皇居ラン',
        place: '皇居',
        meetingPlace: '桔梗門前派出所',
        meetingShort: '桔梗門派出所前',
        day: '毎週水曜',
        time: '06:00〜',
        distance: '約5km',
        mapUrl: 'https://maps.app.goo.gl/E9HkSojyPZw6zo1b9',
        routeImage: '/assets/strava-route-kokyo.png',
        routeUrl: 'https://www.strava.com/routes/3425111489577090166',
        dayOfWeek: 3,
        timeRaw: '06:00',
        description: (
            <>桔梗門前派出所に集合。<br />皇居を左回りで1周。<br />和田倉噴水公園内にはSTARBUCKSも。</>
        ),
        forWhom: '皇居ランしたい方・仕事前に短時間でミディアムな刺激を得たい方',
    },
    {
        id: 'meguro',
        name: '目黒川ラン',
        place: '目黒川',
        meetingPlace: 'スターバックス 中目黒蔦屋書店前',
        meetingShort: '中目黒駅スタバ前',
        day: '毎週木曜',
        time: '06:00〜',
        distance: '約4km',
        mapUrl: 'https://maps.app.goo.gl/SKixyw53vfJnp1p36',
        routeImage: '/assets/strava-route-meguro.png',
        routeUrl: 'https://www.strava.com/routes/3471979912283975976',
        dayOfWeek: 4,
        timeRaw: '06:00',
        description: (
            <>中目黒駅のスターバックス蔦屋書店前に集合。<br />目黒川をぐるっと回るコース。</>
        ),
        forWhom: '中目黒周辺にお住まいで朝ラン仲間を探している方、短くても朝ランは継続したい方',
    },
    {
        id: 'yoyogi',
        name: '代々木公園ラン',
        place: '代々木公園',
        meetingPlace: '原宿時計塔前',
        meetingShort: '原宿時計塔前',
        day: '毎週日曜',
        time: '07:10〜',
        distance: '約2〜4km',
        recommendationLabel: '初参加におすすめ',
        isFirstChoice: true,
        mapUrl: 'https://maps.app.goo.gl/dB3L15dHByAoC4jw9',
        routeImage: '/assets/strava-route-yoyogi.png',
        routeUrl: 'https://www.strava.com/routes/3471970663805426564',
        dayOfWeek: 0,
        timeRaw: '07:10',
        description: (
            <>原宿時計塔に集合。<br />代々木公園を左回りで1、2周。<br />公園近くにはドトールやVERVE COFFEEがあります。</>
        ),
        forWhom: 'いきなり6時スタートは難しいから体を慣らしたい方、週末も朝から活動したい方',
    },
];

const SPECIAL_RUNS = [
    {
        title: '東京湾で初日の出を拝む',
        text: '元日の早朝に東京湾まで走り、海の向こうから明るくなる空を見に行く日があります。',
    },
    {
        title: '横浜で日の出を見る',
        text: '横浜の海辺まで走り、空が明るくなっていく時間をゆっくり眺める朝があります。',
    },
    {
        title: '東京マラソンEXPOへ走る',
        text: '東京マラソンEXPO 2026の会場まで走って、現地でランニング用品を見る企画もあります。',
    },
    {
        title: 'おおたかの森へ出かける',
        text: 'いつもの定例開催地を離れて、おおたかの森のような街と緑の近い場所にも出かけます。',
    },
];

export default async function EventPage() {
    const eventsJsonLd = createEventsJsonLd();
    const upcomingEvents = await getUpcomingGroupEvents();
    const regularDayIndexes = new Set(RUNS.map((run) => run.dayOfWeek));
    const regularEventsByDay = new Map();
    for (const event of upcomingEvents) {
        if (regularDayIndexes.has(event.dayOfWeek) && !regularEventsByDay.has(event.dayOfWeek)) {
            regularEventsByDay.set(event.dayOfWeek, event);
        }
    }
    const specialEvents = upcomingEvents
        .filter((event) => !regularDayIndexes.has(event.dayOfWeek))
        .slice(0, 3);
    const nextRunCards = RUNS.map((run) => {
        const stravaEvent = regularEventsByDay.get(run.dayOfWeek);
        const start = stravaEvent
            ? applyScheduledTime(getJstWallClockDate(new Date(stravaEvent.startAt)), run.timeRaw)
            : getNextEventStart(run.dayOfWeek, run.timeRaw);
        const next = formatUpcomingRunStart(start);

        return {
            ...run,
            nextDate: next.date,
            nextTime: next.time,
            nextTimestamp: start.getTime(),
            stravaEvent,
        };
    })
        .sort((a, b) => a.nextTimestamp - b.nextTimestamp)
        .slice(0, 2);

    return (
        <div className={styles.page}>
            {eventsJsonLd.map((event, i) => (
                <script
                    key={i}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(event) }}
                />
            ))}

            <div className={styles.hero}>
                <h1 className={styles.title}>
                    HINODEのグループラン日程<br />
                    <span className={styles.titleSub}>皇居・目黒川・代々木公園</span>
                </h1>
                <p className={styles.lead}>
                    HINODEは、朝の時間にゆっくり走るランニングコミュニティです。<br />
                    予約不要・参加費無料・1人参加OK。
                </p>
                <div className={styles.scheduleQuickView}>
                    <div className={styles.scheduleQuickViewHead}>
                        <div className={styles.scheduleQuickViewTitleRow}>
                            <p className={styles.scheduleQuickViewLabel}>定例ラン早見表</p>
                            <a
                                href={STRAVA_CLUB_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.scheduleQuickViewStrava}
                            >
                                詳細はStravaで
                            </a>
                        </div>
                        <p className={styles.scheduleQuickViewLead}>
                            6月1日からサマータイムをお試ししています。対象は、水曜・木曜・日曜のグループランです。
                        </p>
                    </div>
                    <div className={styles.scheduleTableWrap}>
                        <table className={styles.scheduleTable}>
                            <thead>
                                <tr>
                                    <th scope="col">曜日</th>
                                    <th scope="col">場所</th>
                                    <th scope="col">集合</th>
                                    <th scope="col">集合時間</th>
                                    <th scope="col">距離</th>
                                </tr>
                            </thead>
                            <tbody>
                                {RUNS.map((run) => (
                                    <tr key={run.id}>
                                        <td data-label="曜日">{run.day}</td>
                                        <td data-label="場所">
                                            <a href={`#${run.id}`}>{run.place}</a>
                                        </td>
                                        <td data-label="集合">{run.meetingShort}</td>
                                        <td data-label="集合時間">{run.time.replace('〜', '')}</td>
                                        <td data-label="距離">{run.distance}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className={styles.scheduleQuickViewNote}>
                        日曜は7:00ではなく7:10集合です。Runtrip BASEが7:00にオープンするため、この時間にしています。
                        まずは1か月ほど運用し、参加状況や気温を見ながら継続するか判断します。
                    </p>
                </div>
                <div className={styles.firstRunCallout}>
                    <h2>初めて参加する方へ</h2>
                    <p>
                        HINODEは、予約不要・参加無料・1人参加歓迎の朝ランコミュニティです。
                        初めての方は、日曜7:10の代々木公園ランが参加しやすいです。
                        当日の流れ、服装、荷物、写真方針、Stravaの使い方などは、初参加ガイドにまとめています。
                    </p>
                    <Link href={FIRST_RUN_GUIDE_URL} className={styles.firstRunCalloutLink}>
                        初参加ガイドを見る →
                    </Link>
                </div>
            </div>

            <section className={styles.nextRunsSection} aria-labelledby="next-runs-title">
                <div className={styles.nextRunsHeader}>
                    <h2 id="next-runs-title" className={styles.nextRunsTitle}>直近の日程</h2>
                </div>
                <div className={styles.nextRunsGrid}>
                    {nextRunCards.map((run, index) => (
                        <article key={run.id} className={styles.nextRunCard}>
                            <div className={styles.nextRunTop}>
                                <span className={styles.nextRunBadge}>{index === 0 ? '最直近' : '次の候補'}</span>
                                {run.isFirstChoice && (
                                    <span className={styles.nextRunGuideBadge}>初参加向け</span>
                                )}
                            </div>
                            <p className={styles.nextRunDate}>
                                <span>{run.nextDate}</span>
                                <span>{run.nextTime}</span>
                            </p>
                            <h3 className={styles.nextRunName}>{run.name}</h3>
                            <p className={styles.nextRunMeta}>
                                <span>{run.place}</span>
                                <span>距離 {run.distance}</span>
                            </p>
                            <p className={styles.nextRunLocation}>
                                <svg viewBox="0 0 24 24" className={styles.nextRunLocationIcon} aria-hidden="true">
                                    <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" />
                                    <circle cx="12" cy="9" r="2.5" />
                                </svg>
                                {run.meetingPlace}
                            </p>
                            <ParticipantPreview
                                count={run.stravaEvent?.participantCount}
                                participants={run.stravaEvent?.participants}
                                className={styles.nextRunParticipants}
                            />
                            <div className={styles.nextRunActions}>
                                <Link href={`#${run.id}`} className={styles.nextRunDetailsLink}>
                                    初参加ガイドや集合場所はこちら
                                </Link>
                                <div className={styles.nextRunButtonActions}>
                                    {run.stravaEvent && (
                                        <a
                                            href={stravaEventUrl(run.stravaEvent.eventId)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.nextRunSubAction}
                                        >
                                            Stravaページを見る
                                        </a>
                                    )}
                                    <ShareScheduleButton
                                        path={`/schedule#${run.id}`}
                                        className={styles.nextRunShare}
                                    />
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section id="special-runs" className={styles.specialRunsSection} aria-labelledby="special-runs-title">
                <div className={styles.specialRunsHeader}>
                    <h2 id="special-runs-title" className={styles.specialRunsTitle}>
                        土曜の企画ラン
                    </h2>
                    <p className={styles.specialRunsLead}>
                        水曜・木曜・日曜の定例ランとは別に、土曜日は不定期の企画ランも開催しています。街へ出たり、目的地を決めたり、少し長めに走ったりする日です。
                    </p>
                </div>
                <div className={styles.specialExamplesBox}>
                    <div className={styles.specialExamplesIntro}>
                        <span>たとえば...</span>
                    </div>
                    <ul className={styles.specialExamples}>
                        {SPECIAL_RUNS.map((item) => (
                            <li key={item.title} className={styles.specialExample}>
                                <h3>{item.title}</h3>
                                <p>{item.text}</p>
                            </li>
                        ))}
                    </ul>
                </div>
                <Link href="/event-runs" className={styles.specialRunsAction}>
                    これまでの企画ランを見る →
                </Link>
                {specialEvents.length > 0 && (
                    <div className={styles.specialUpcoming}>
                        <h3 className={styles.specialUpcomingTitle}>直近の企画</h3>
                        <ul className={styles.specialUpcomingList}>
                            {specialEvents.map((event) => {
                                const start = formatUpcomingRunStart(getJstWallClockDate(new Date(event.startAt)));

                                return (
                                    <li key={event.eventId} className={styles.specialUpcomingItem}>
                                        <a
                                            href={stravaEventUrl(event.eventId)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.specialUpcomingLink}
                                        >
                                            <span className={styles.specialUpcomingDate}>
                                                {start.date} {start.time}
                                            </span>
                                            <span className={styles.specialUpcomingName}>{event.title}</span>
                                            {event.address && (
                                                <span className={styles.specialUpcomingAddress}>{event.address}</span>
                                            )}
                                            <ParticipantPreview
                                                count={event.participantCount}
                                                participants={event.participants}
                                                className={styles.specialUpcomingParticipants}
                                            />
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
                <p className={styles.specialRunsNote}>
                    最新の企画は <a href={STRAVA_CLUB_URL} target="_blank" rel="noopener noreferrer">Strava</a> と <a href="https://www.instagram.com/hinode_run/" target="_blank" rel="noopener noreferrer">Instagram</a> で告知しています。
                </p>
            </section>

            <section id="regular-runs" className={styles.runsSection} aria-labelledby="regular-runs-title">
                <div className={styles.runsInner}>
                    <div className={styles.runsHeader}>
                        <h2 id="regular-runs-title" className={styles.runsTitle}>開催場所ごとの日程・集合場所</h2>
                        <p className={styles.runsLead}>
                            皇居・目黒川・代々木公園それぞれの曜日、距離、集合場所をまとめています。
                        </p>
                    </div>

                    <div className={styles.runs}>
                        {RUNS.map((run) => {
                            const stravaEvent = regularEventsByDay.get(run.dayOfWeek);

                            return (
                                <article key={run.id} id={run.id} className={styles.runCard}>
                                    <div className={styles.runHead}>
                                        <div className={styles.runHeadText}>
                                            <div className={styles.runTitleRow}>
                                                <h3 className={styles.runName}>{run.name}</h3>
                                                {run.recommendationLabel && (
                                                    <span className={`${styles.runRecommendationBadge} ${run.isFirstChoice ? styles.runRecommendationBadgePrimary : ''}`}>
                                                        {run.recommendationLabel}
                                                    </span>
                                                )}
                                            </div>
                                            <p className={styles.runMeta}>
                                                <span className={styles.runDay}>{run.day}</span>
                                                <span className={styles.runDot} aria-hidden="true">·</span>
                                                <span className={styles.runTime}>{run.time}</span>
                                                <span className={styles.runDot} aria-hidden="true">·</span>
                                                <span className={styles.runDistance}>{run.distance}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className={styles.runBody}>
                                        <div className={styles.runRouteCol}>
                                            <div className={styles.runRouteFrame}>
                                                <a
                                                    href={run.routeUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={styles.routeImageLink}
                                                    aria-label={`${run.name}のStravaルートを見る`}
                                                >
                                                    <Image
                                                        src={run.routeImage}
                                                        alt={`${run.name}のStravaルートマップ`}
                                                        fill
                                                        sizes="(max-width: 768px) calc(100vw - 5rem), (max-width: 900px) calc(100vw - 7rem), 420px"
                                                        className={styles.routeImage}
                                                    />
                                                </a>
                                            </div>
                                            <a
                                                href={run.mapUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.googleMapLink}
                                            >
                                                Google mapで集合場所を見る →
                                            </a>
                                        </div>

                                        <div className={styles.runDescCol}>
                                            <NextRunDate dayOfWeek={run.dayOfWeek} time={run.timeRaw} className={styles.nextDate} />
                                            <p className={styles.runDescription}>{run.description}</p>
                                            <div className={styles.runForWhom}>
                                                <span className={styles.runForWhomLabel}>こんな方に</span>
                                                <span className={styles.runForWhomText}>{run.forWhom}</span>
                                            </div>
                                            <div className={styles.runActions}>
                                                {stravaEvent && (
                                                    <a
                                                        href={stravaEventUrl(stravaEvent.eventId)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={styles.stravaRunLink}
                                                    >
                                                        Stravaページを見る
                                                    </a>
                                                )}
                                                <ShareScheduleButton
                                                    path={`/schedule#${run.id}`}
                                                    className={styles.shareRunButton}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className={styles.faqSection} aria-labelledby="first-time-faq-title">
                <div className={styles.sectionHead}>
                    <span className={styles.sectionNum}>02</span>
                    <h2 id="first-time-faq-title" className={styles.sectionTitle}>よくある質問</h2>
                </div>
                <div className={styles.faqGrid}>
                    {faqItems.map((item) => (
                        <article key={item.question} className={styles.faqItem}>
                            <h3>Q. {item.question}</h3>
                            <p>A. {item.answer}</p>
                        </article>
                    ))}
                </div>
                <div className={styles.faqGuideLinkWrap}>
                    <Link href={FIRST_RUN_GUIDE_URL} className={styles.faqGuideLink}>
                        初参加の詳しい流れを見る →
                    </Link>
                </div>
            </section>

            <section className={styles.linksSection}>
                <a href={STRAVA_CLUB_URL} target="_blank" rel="noopener noreferrer" className={styles.linkBtnPrimary}>
                    Stravaクラブを見る
                </a>
                <a href="https://www.instagram.com/hinode_run/" target="_blank" rel="noopener noreferrer" className={styles.linkBtnSecondary}>
                    Instagramを見る
                </a>
            </section>

            <PostBottomStrip />
        </div>
    );
}
