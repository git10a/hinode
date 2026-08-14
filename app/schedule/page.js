import Link from '@/components/SiteLink';
import styles from './schedule.module.css';
import PostBottomStrip from '../../components/PostBottomStrip';
import { getUpcomingGroupEvents } from '../../lib/strava';
import { getRegularRun } from '../../lib/regularRuns';

export const metadata = {
    title: 'HINODEのグループラン日程｜皇居・目黒川・代々木公園',
    description: 'HINODEの日の出ラン開催日程ページです。皇居・目黒川・代々木公園で毎週開催。土曜日は不定期の企画ランも開催。曜日、時間、集合場所、距離、Stravaイベントへの導線をまとめています。',
};

export const revalidate = 900;

const STRAVA_CLUB_ID = '1772485';
const STRAVA_CLUB_URL = `https://www.strava.com/clubs/${STRAVA_CLUB_ID}`;
const EVENT_DURATION_MINUTES = 60;
const SITE_URL = 'https://hinode-run.com';
const EVENT_PERFORMER = { "@type": "PerformingGroup", "name": "HINODE" };
const FIRST_RUN_GUIDE_URL = '/first-run';
const DAY_LABEL_JP = ['日', '月', '火', '水', '木', '金', '土'];
const KOKYO_RUN = getRegularRun('kokyo');
const MEGURO_RUN = getRegularRun('meguro');
const YOYOGI_RUN = getRegularRun('yoyogi');

function stravaEventUrl(eventId) {
    return `https://www.strava.com/clubs/${STRAVA_CLUB_ID}/group_events/${eventId}`;
}

function getJstWallClockDate(date) {
    return new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
}

function getMonthCalendar(specialEvents, regularEventsByDay, now = new Date()) {
    const jstNow = getJstWallClockDate(now);
    const year = jstNow.getFullYear();
    const monthIndex = jstNow.getMonth();
    const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
    const firstDayOfWeek = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay();
    const specialEventsByDay = new Map();

    for (const event of specialEvents) {
        const eventDate = getJstWallClockDate(new Date(event.startAt));
        if (eventDate.getFullYear() !== year || eventDate.getMonth() !== monthIndex) continue;
        const day = eventDate.getDate();
        const existing = specialEventsByDay.get(day) || [];
        existing.push({
            ...event,
            time: `${pad2(eventDate.getHours())}:${pad2(eventDate.getMinutes())}`,
        });
        specialEventsByDay.set(day, existing);
    }

    const cells = Array.from({ length: firstDayOfWeek }, () => null);
    for (let day = 1; day <= daysInMonth; day += 1) {
        const dayOfWeek = new Date(Date.UTC(year, monthIndex, day)).getUTCDay();
        cells.push({
            day,
            isToday: day === jstNow.getDate(),
            regularRuns: RUNS
                .filter((run) => run.dayOfWeek === dayOfWeek)
                .map((run) => {
                    const stravaEvent = regularEventsByDay.get(run.dayOfWeek);
                    return {
                        ...run,
                        stravaHref: stravaEvent ? stravaEventUrl(stravaEvent.eventId) : STRAVA_CLUB_URL,
                    };
                }),
            specialEvents: specialEventsByDay.get(day) || [],
        });
    }
    while (cells.length % 7 !== 0) cells.push(null);

    return {
        year,
        month: monthIndex + 1,
        cells,
    };
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

function createFreeOffer(dayOfWeek, time, now, path) {
    const validFrom = getNextEventStart(dayOfWeek, time, now);
    validFrom.setDate(validFrom.getDate() - 7);

    return {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "JPY",
        "availability": "https://schema.org/InStock",
        "url": `${SITE_URL}${path}`,
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
            "url": `${SITE_URL}${KOKYO_RUN.detailHref}`,
            "image": [
                assetUrl('/assets/kokyo-run-map.png'),
                assetUrl('/assets/Kokyo.jpg'),
            ],
            "description": `${KOKYO_RUN.dayShort}${KOKYO_RUN.timeRaw}から皇居で開催する日の出ラン。約5km、左回りで1周。参加無料・予約不要。`,
            ...eventDateFields(KOKYO_RUN.dayOfWeek, KOKYO_RUN.timeRaw, now),
            "eventSchedule": { "@type": "Schedule", "repeatFrequency": "P1W", "byDay": "https://schema.org/Wednesday", "startTime": KOKYO_RUN.timeRaw, "scheduleTimezone": "Asia/Tokyo" },
            "location": { "@type": "Place", "name": "桔梗門前派出所", "address": { "@type": "PostalAddress", "addressLocality": "東京都千代田区", "addressCountry": "JP" } },
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "eventStatus": "https://schema.org/EventScheduled",
            "organizer": { "@type": "SportsClub", "name": "HINODE", "url": "https://hinode-run.com/" },
            "performer": EVENT_PERFORMER,
            "offers": createFreeOffer(KOKYO_RUN.dayOfWeek, KOKYO_RUN.timeRaw, now, KOKYO_RUN.detailHref)
        },
        {
            "@context": "https://schema.org",
            "@type": "Event",
            "name": "目黒川の日の出ラン｜HINODE",
            "url": `${SITE_URL}${MEGURO_RUN.detailHref}`,
            "image": [
                assetUrl('/assets/meguro-run-map.png'),
                assetUrl('/assets/Meguro.jpg'),
            ],
            "description": `${MEGURO_RUN.dayShort}${MEGURO_RUN.timeRaw}から中目黒で開催する日の出ラン。約4km、目黒川沿いを1周。参加無料・予約不要。`,
            ...eventDateFields(MEGURO_RUN.dayOfWeek, MEGURO_RUN.timeRaw, now),
            "eventSchedule": { "@type": "Schedule", "repeatFrequency": "P1W", "byDay": "https://schema.org/Thursday", "startTime": MEGURO_RUN.timeRaw, "scheduleTimezone": "Asia/Tokyo" },
            "location": { "@type": "Place", "name": "スターバックス 中目黒蔦屋書店前", "address": { "@type": "PostalAddress", "addressLocality": "東京都目黒区", "addressCountry": "JP" } },
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "eventStatus": "https://schema.org/EventScheduled",
            "organizer": { "@type": "SportsClub", "name": "HINODE", "url": "https://hinode-run.com/" },
            "performer": EVENT_PERFORMER,
            "offers": createFreeOffer(MEGURO_RUN.dayOfWeek, MEGURO_RUN.timeRaw, now, MEGURO_RUN.detailHref)
        },
        {
            "@context": "https://schema.org",
            "@type": "Event",
            "name": "代々木公園の日の出ラン｜HINODE",
            "url": `${SITE_URL}${YOYOGI_RUN.detailHref}`,
            "image": [
                assetUrl('/assets/yoyogi-run-map.png'),
                assetUrl('/assets/Yoyogi.jpg'),
            ],
            "description": `${YOYOGI_RUN.dayShort}${YOYOGI_RUN.timeRaw}から代々木公園で開催する日の出ラン。約2〜4km、左回りで1、2周。参加無料・予約不要。`,
            ...eventDateFields(YOYOGI_RUN.dayOfWeek, YOYOGI_RUN.timeRaw, now),
            "eventSchedule": { "@type": "Schedule", "repeatFrequency": "P1W", "byDay": "https://schema.org/Sunday", "startTime": YOYOGI_RUN.timeRaw, "scheduleTimezone": "Asia/Tokyo" },
            "location": { "@type": "Place", "name": "原宿時計塔前", "address": { "@type": "PostalAddress", "addressLocality": "東京都渋谷区", "addressCountry": "JP" } },
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "eventStatus": "https://schema.org/EventScheduled",
            "organizer": { "@type": "SportsClub", "name": "HINODE", "url": "https://hinode-run.com/" },
            "performer": EVENT_PERFORMER,
            "offers": createFreeOffer(YOYOGI_RUN.dayOfWeek, YOYOGI_RUN.timeRaw, now, YOYOGI_RUN.detailHref)
        }
    ];
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

const RUNS = [KOKYO_RUN, MEGURO_RUN, YOYOGI_RUN];

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
        .slice(0, 12);
    const monthCalendar = getMonthCalendar(specialEvents, regularEventsByDay);

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
                            曜日・スタート時間・集合場所をまとめました。各回とも開始5分前を目安にお集まりください。
                        </p>
                    </div>
                    <div className={styles.scheduleQuickCards}>
                        {RUNS.map((run) => (
                            <Link key={run.id} href={run.detailHref} className={styles.scheduleQuickCard}>
                                <div className={styles.scheduleQuickCardPrimary}>
                                    <span className={styles.scheduleQuickDay}>{run.dayShort.replace('曜', '')}</span>
                                    <span className={styles.scheduleQuickTime}>{run.timeRaw}</span>
                                </div>
                                <div className={styles.scheduleQuickCardBody}>
                                    <strong>{run.place}</strong>
                                    <span>{run.meetingShort} 集合</span>
                                </div>
                                <span className={styles.scheduleQuickDistance}>{run.distance}</span>
                            </Link>
                        ))}
                    </div>
                    <p className={styles.scheduleQuickViewNote}>
                        ※日曜はRuntrip BASEのオープンに合わせ、7:15スタートです。
                    </p>
                </div>

                <section id="monthly-calendar" className={styles.monthlyCalendar} aria-labelledby="monthly-calendar-title">
                    <div className={styles.monthlyCalendarHeader}>
                        <div>
                            <p className={styles.monthlyCalendarLabel}>MONTHLY SCHEDULE</p>
                            <h2 id="monthly-calendar-title">今月の日程</h2>
                        </div>
                        <p className={styles.monthlyCalendarMonth}>
                            <span>{monthCalendar.year}年</span>
                            <strong>{monthCalendar.month}月</strong>
                        </p>
                    </div>
                    <p className={styles.monthlyCalendarLead}>
                        水・木・日の定例ランに加えて、Stravaで公開中の土曜などの企画ランも表示しています。
                    </p>
                    <div className={styles.calendarFrame}>
                        <div className={styles.calendarWeekdays} aria-hidden="true">
                            {DAY_LABEL_JP.map((label) => (
                                <span key={label}>{label}</span>
                            ))}
                        </div>
                        <div className={styles.calendarGrid}>
                            {monthCalendar.cells.map((cell, index) => (
                                cell ? (
                                    <div
                                        key={cell.day}
                                        className={`${styles.calendarCell} ${cell.isToday ? styles.calendarCellToday : ''}`}
                                    >
                                        <span className={styles.calendarDate}>{cell.day}</span>
                                        <div className={styles.calendarEvents}>
                                            {cell.regularRuns.map((run) => (
                                                <a
                                                    key={run.id}
                                                    href={run.stravaHref}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={styles.calendarEvent}
                                                    aria-label={`${monthCalendar.month}月${cell.day}日 ${run.place} ${run.timeRaw}`}
                                                >
                                                    <span>{run.place.replace('公園', '').replace('川', '')}</span>
                                                    <small>{run.timeRaw}</small>
                                                </a>
                                            ))}
                                            {cell.specialEvents.map((event) => (
                                                <a
                                                    key={`${event.eventId}-${event.startAt}`}
                                                    href={stravaEventUrl(event.eventId)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`${styles.calendarEvent} ${styles.calendarEventSpecial}`}
                                                    aria-label={`${monthCalendar.month}月${cell.day}日 企画ラン ${event.title} ${event.time}`}
                                                    title={event.title}
                                                >
                                                    <span>企画ラン</span>
                                                    <small>{event.time}</small>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div key={`empty-${index}`} className={`${styles.calendarCell} ${styles.calendarCellEmpty}`} aria-hidden="true" />
                                )
                            ))}
                        </div>
                    </div>
                    <div className={styles.calendarLegend}>
                        {RUNS.map((run) => (
                            <span key={run.id}><i aria-hidden="true" />{run.place}（{run.dayShort}）</span>
                        ))}
                        <span className={styles.calendarLegendSpecial}><i aria-hidden="true" />企画ラン</span>
                    </div>
                    <p className={styles.calendarNote}>
                        雨天中止や企画の詳細は <a href={STRAVA_CLUB_URL} target="_blank" rel="noopener noreferrer">Strava</a> または <a href="https://www.instagram.com/hinode_run/" target="_blank" rel="noopener noreferrer">Instagram</a> でお知らせします。
                    </p>
                </section>

                <div className={styles.firstRunCallout}>
                    <h2>初めて参加する方へ</h2>
                    <p>
                        HINODEは、予約不要・参加無料・1人参加歓迎の朝ランコミュニティです。
                        初めての方は、日曜7:15の代々木公園ランが参加しやすいです。
                        当日の流れ、服装、荷物、写真方針、Stravaの使い方などは、初参加ガイドにまとめています。
                    </p>
                    <Link href={FIRST_RUN_GUIDE_URL} className={styles.firstRunCalloutLink}>
                        初参加ガイドを見る →
                    </Link>
                </div>
            </div>

            <section className={styles.faqSection} aria-labelledby="first-time-faq-title">
                <div className={styles.sectionHead}>
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
