import Link from 'next/link';
import Script from 'next/script';
import styles from './schedule.module.css';
import NextRunDate from '../../components/NextRunDate';
import PostBottomStrip from '../../components/PostBottomStrip';
import ParticipantPreview from '../../components/ParticipantPreview';
import ShareScheduleButton from '../../components/ShareScheduleButton';
import { getUpcomingGroupEvents } from '../../lib/strava';

export const metadata = {
    title: 'HINODEのグループラン日程｜皇居・目黒川・代々木公園',
    description: 'HINODEの日の出ラン開催日程ページです。皇居・目黒川・代々木公園で毎週開催。曜日、時間、集合場所、距離、Stravaイベントへの導線と最小限のFAQをまとめています。',
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
            "description": "毎週水曜6:30から皇居で開催する日の出ラン。約5km、左回りで1周。参加無料・予約不要。",
            ...eventDateFields(3, '06:30', now),
            "eventSchedule": { "@type": "Schedule", "repeatFrequency": "P1W", "byDay": "https://schema.org/Wednesday", "startTime": "06:30", "scheduleTimezone": "Asia/Tokyo" },
            "location": { "@type": "Place", "name": "桔梗門前派出所", "address": { "@type": "PostalAddress", "addressLocality": "東京都千代田区", "addressCountry": "JP" } },
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "eventStatus": "https://schema.org/EventScheduled",
            "organizer": { "@type": "SportsClub", "name": "HINODE", "url": "https://hinode-run.com/" },
            "performer": EVENT_PERFORMER,
            "offers": createFreeOffer(3, '06:30', now, 'kokyo')
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
            "description": "毎週木曜6:30から中目黒で開催する日の出ラン。約4km、目黒川沿いを1周。参加無料・予約不要。",
            ...eventDateFields(4, '06:30', now),
            "eventSchedule": { "@type": "Schedule", "repeatFrequency": "P1W", "byDay": "https://schema.org/Thursday", "startTime": "06:30", "scheduleTimezone": "Asia/Tokyo" },
            "location": { "@type": "Place", "name": "スターバックス 中目黒蔦屋書店前", "address": { "@type": "PostalAddress", "addressLocality": "東京都目黒区", "addressCountry": "JP" } },
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "eventStatus": "https://schema.org/EventScheduled",
            "organizer": { "@type": "SportsClub", "name": "HINODE", "url": "https://hinode-run.com/" },
            "performer": EVENT_PERFORMER,
            "offers": createFreeOffer(4, '06:30', now, 'meguro')
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
            "description": "毎週日曜7:30から代々木公園で開催する日の出ラン。約2〜4km、左回りで1、2周。参加無料・予約不要。",
            ...eventDateFields(0, '07:30', now),
            "eventSchedule": { "@type": "Schedule", "repeatFrequency": "P1W", "byDay": "https://schema.org/Sunday", "startTime": "07:30", "scheduleTimezone": "Asia/Tokyo" },
            "location": { "@type": "Place", "name": "原宿時計塔前", "address": { "@type": "PostalAddress", "addressLocality": "東京都渋谷区", "addressCountry": "JP" } },
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "eventStatus": "https://schema.org/EventScheduled",
            "organizer": { "@type": "SportsClub", "name": "HINODE", "url": "https://hinode-run.com/" },
            "performer": EVENT_PERFORMER,
            "offers": createFreeOffer(0, '07:30', now, 'yoyogi')
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
        num: '01',
        name: '皇居の日の出ラン',
        place: '皇居',
        meetingPlace: '桔梗門前派出所',
        day: '毎週水曜',
        time: '06:30〜',
        distance: '約5km',
        mapUrl: 'https://maps.app.goo.gl/E9HkSojyPZw6zo1b9',
        routeEmbed: {
            embedId: '3425111489577090166',
            mapHash: '13.24/35.68375/139.75284',
            fromEmbed: 'true',
            token: '3YSa6yh87lxuCt0mzvhY9UdGrvz2HsXJkxn3pK7dbag',
        },
        dayOfWeek: 3,
        timeRaw: '06:30',
        description: (
            <>桔梗門前派出所に集合。<br />皇居を左回りで1周。<br />和田倉噴水公園内にはSTARBUCKSも。</>
        ),
        forWhom: '皇居ランしたい方・仕事前に短時間でミディアムな刺激を得たい方',
    },
    {
        id: 'meguro',
        num: '02',
        name: '目黒川の日の出ラン',
        place: '目黒川',
        meetingPlace: 'スターバックス 中目黒蔦屋書店前',
        day: '毎週木曜',
        time: '06:30〜',
        distance: '約4km',
        mapUrl: 'https://maps.app.goo.gl/SKixyw53vfJnp1p36',
        routeEmbed: {
            embedId: '3471979912283975976',
            mapHash: '13.55/35.63905/139.70505',
            fromEmbed: 'false',
            token: 'sN752PL7E92oUeMlAq18khZvZ7wOebJp2bFaM2myM5s',
        },
        dayOfWeek: 4,
        timeRaw: '06:30',
        description: (
            <>中目黒駅のスターバックス蔦屋書店前に集合。<br />目黒川をぐるっと回るコース。</>
        ),
        forWhom: '中目黒周辺にお住まいで朝ラン仲間を探している方、短くても朝ランは継続したい方',
    },
    {
        id: 'yoyogi',
        num: '03',
        name: '代々木公園の日の出ラン',
        place: '代々木公園',
        meetingPlace: '原宿時計塔前',
        day: '毎週日曜',
        time: '07:30〜',
        distance: '約2〜4km',
        recommendationLabel: '初参加に一番おすすめ',
        isFirstChoice: true,
        mapUrl: 'https://maps.app.goo.gl/dB3L15dHByAoC4jw9',
        routeEmbed: {
            embedId: '3471970663805426564',
            mapHash: '14.88/35.6713/139.69663',
            fromEmbed: 'true',
            token: '-xVAs3bI3zddvxv_pjpAHUQmaurOqidqJl5C_VJ5i7c',
        },
        dayOfWeek: 0,
        timeRaw: '07:30',
        description: (
            <>原宿時計塔に集合。<br />代々木公園を左回りで1、2周。<br />公園近くにはドトールやVERVE COFFEEがあります。</>
        ),
        forWhom: 'いきなり6時半スタートは難しいから体を慣らしたい方、週末も朝から活動したい方',
        note: (
            <>ここで朝ランのリズムに慣れ、そこから平日の <a href="#kokyo" className={styles.noteLink}>皇居（水曜6:30）</a> や <a href="#meguro" className={styles.noteLink}>目黒川（木曜6:30）</a> にお越しになるのもウェルカムです。</>
        ),
    },
];

export default async function EventPage() {
    const eventsJsonLd = createEventsJsonLd();
    const upcomingEvents = await getUpcomingGroupEvents();
    const regularEventsByDay = new Map();
    for (const event of upcomingEvents) {
        if (!regularEventsByDay.has(event.dayOfWeek)) {
            regularEventsByDay.set(event.dayOfWeek, event);
        }
    }
    const nextRunCards = RUNS.map((run) => {
        const stravaEvent = regularEventsByDay.get(run.dayOfWeek);
        const start = stravaEvent
            ? getJstWallClockDate(new Date(stravaEvent.startAt))
            : getNextEventStart(run.dayOfWeek, run.timeRaw);
        const next = formatUpcomingRunStart(start);

        return {
            ...run,
            nextDate: next.date,
            nextTime: next.time,
            nextTimestamp: stravaEvent ? new Date(stravaEvent.startAt).getTime() : start.getTime(),
            stravaEvent,
        };
    })
        .sort((a, b) => a.nextTimestamp - b.nextTimestamp)
        .slice(0, 2);

    return (
        <div className={styles.page}>
            <Script src="https://strava-embeds.com/embed.js" strategy="afterInteractive" />
            {eventsJsonLd.map((event, i) => (
                <script
                    key={i}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(event) }}
                />
            ))}

            <nav className={styles.breadcrumb} aria-label="breadcrumb">
                <Link href="/" className={styles.breadcrumbLink}>HOME</Link>
                <span className={styles.breadcrumbSep}>›</span>
                <span className={styles.breadcrumbCurrent}>SCHEDULE</span>
            </nav>

            <div className={styles.hero}>
                <p className={styles.eyebrow}>SCHEDULE</p>
                <h1 className={styles.title}>
                    HINODEのグループラン日程<br />
                    <span className={styles.titleSub}>皇居・目黒川・代々木公園</span>
                </h1>
                <p className={styles.lead}>
                    HINODEは、朝の時間にゆっくり走るランニングコミュニティです。<br />
                    予約不要・参加費無料・1人参加OK。
                </p>
                <div className={styles.firstRunCallout}>
                    <h2>初めて参加する方へ</h2>
                    <p>
                        HINODEは、予約不要・参加無料・1人参加歓迎の朝ランコミュニティです。
                        初めての方は、日曜7:30の代々木公園ランが参加しやすいです。
                        当日の流れ、服装、荷物、写真方針、Stravaの使い方などは、初参加ガイドにまとめています。
                    </p>
                    <Link href={FIRST_RUN_GUIDE_URL} className={styles.firstRunCalloutLink}>
                        初参加ガイドを見る →
                    </Link>
                </div>
            </div>

            <section className={styles.nextRunsSection} aria-labelledby="next-runs-title">
                <div className={styles.nextRunsHeader}>
                    <p className={styles.nextRunsKicker}>NEXT RUNS</p>
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

            <section id="regular-runs" className={styles.runsSection} aria-labelledby="regular-runs-title">
                <div className={styles.runsInner}>
                    <div className={styles.runsHeader}>
                        <p className={styles.runsKicker}>GROUP RUNS</p>
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
                                        <span className={styles.runNum}>{run.num}</span>
                                        <div className={styles.runHeadText}>
                                            <h3 className={styles.runName}>{run.name}</h3>
                                            {run.recommendationLabel && (
                                                <p className={`${styles.runRecommendation} ${run.isFirstChoice ? styles.runRecommendationPrimary : ''}`}>
                                                    <span>{run.recommendationLabel}</span>
                                                    {run.recommendation && (
                                                        <span>{run.recommendation}</span>
                                                    )}
                                                </p>
                                            )}
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
                                                <div
                                                    className={`strava-embed-placeholder ${styles.stravaRouteEmbed}`}
                                                    data-embed-type="route"
                                                    data-embed-id={run.routeEmbed.embedId}
                                                    data-units="metric"
                                                    data-style="standard"
                                                    data-map-hash={run.routeEmbed.mapHash}
                                                    data-from-embed={run.routeEmbed.fromEmbed}
                                                    data-token={run.routeEmbed.token}
                                                />
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
                                            {run.note && (
                                                <p className={styles.runDescription}>{run.note}</p>
                                            )}
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
