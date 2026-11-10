import Link from '@/components/SiteLink';
import JsonLd from '@/components/JsonLd';
import PostBottomStrip from '@/components/PostBottomStrip';
import RunEventCards from '@/components/RunEventCards';
import { formatIsoJst } from '@/lib/jstDate';
import { getUpcomingLumaEvents, LUMA_CALENDAR_URL } from '@/lib/luma';
import { FIRST_CHOICE_RUN, REGULAR_RUNS, RUN_DURATION_MINUTES, getNextRunStart } from '@/lib/regularRuns';
import { INSTAGRAM_URL, SITE_NAME, SITE_URL, STRAVA_CLUB_URL, absoluteUrl } from '@/lib/site';
import styles from './schedule.module.css';

export const metadata = {
    title: 'HINODEのグループラン日程｜皇居・目黒川・代々木公園',
    description: 'HINODEの朝ラン開催日程。皇居・目黒川・代々木公園などの予定を確認できます。参加無料・登録なしでも参加OK。参加予定の登録はStrava・Lumaのどちらでも。',
};

export const revalidate = 300;

const MINUTE_MS = 60 * 1000;
const DAY_MS = 24 * 60 * MINUTE_MS;
const FIRST_RUN_GUIDE_URL = '/first-run';
const SCHEMA_DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// 構造化データ(Event)のうち、定例ランのデータからは組み立てられない文言
const EVENT_SCHEMA_DETAILS = {
    kokyo: {
        name: '皇居の日の出ラン｜HINODE',
        mapImage: '/assets/kokyo-run-map.png',
        summary: '皇居で開催する日の出ラン。約5km、左回りで1周。',
        locality: '東京都千代田区',
    },
    meguro: {
        name: '目黒川の日の出ラン｜HINODE',
        mapImage: '/assets/meguro-run-map.png',
        summary: '中目黒で開催する日の出ラン。約4km、目黒川沿いを1周。',
        locality: '東京都目黒区',
    },
    yoyogi: {
        name: '代々木公園の日の出ラン｜HINODE',
        mapImage: '/assets/yoyogi-run-map.png',
        summary: '代々木公園で開催する日の出ラン。約2〜4km、左回りで1、2周。',
        locality: '東京都渋谷区',
    },
};

// 次回開催日を startDate に持つ Event。日付は再検証のたびに次の回へ進む。
function createEventJsonLd(run, now) {
    const details = EVENT_SCHEMA_DETAILS[run.id];
    const start = getNextRunStart(run, now);
    const end = new Date(start.getTime() + RUN_DURATION_MINUTES * MINUTE_MS);
    const offerValidFrom = new Date(start.getTime() - 7 * DAY_MS);
    const url = absoluteUrl(run.detailHref);

    return {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: details.name,
        url,
        image: [absoluteUrl(details.mapImage), absoluteUrl(run.image)],
        description: `${run.dayShort}${run.timeRaw}から${details.summary}参加無料・予約不要。`,
        startDate: formatIsoJst(start),
        endDate: formatIsoJst(end),
        eventSchedule: {
            '@type': 'Schedule',
            repeatFrequency: 'P1W',
            byDay: `https://schema.org/${SCHEMA_DAY_NAMES[run.dayOfWeek]}`,
            startTime: run.timeRaw,
            scheduleTimezone: 'Asia/Tokyo',
        },
        location: {
            '@type': 'Place',
            name: run.meetingPlace,
            address: { '@type': 'PostalAddress', addressLocality: details.locality, addressCountry: 'JP' },
        },
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        organizer: { '@type': 'SportsClub', name: SITE_NAME, url: `${SITE_URL}/` },
        performer: { '@type': 'PerformingGroup', name: SITE_NAME },
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'JPY',
            availability: 'https://schema.org/InStock',
            url,
            validFrom: formatIsoJst(offerValidFrom),
        },
    };
}

const FAQ_ITEMS = [
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
        question: 'StravaやLumaへの登録は必要ですか？',
        answer: '登録なしでも参加できます。参加予定を登録する場合は、Strava・Lumaのどちらでも大丈夫です。登録すると、雨天中止などのお知らせを受け取りやすくなります。',
    },
];

export default async function EventPage() {
    const now = new Date();
    const upcomingEvents = await getUpcomingLumaEvents();

    return (
        <div className={styles.page}>
            <JsonLd data={REGULAR_RUNS.map((run) => createEventJsonLd(run, now))} />

            <div className={styles.hero}>
                    <p className="editorial-eyebrow">SCHEDULE</p>
                <h1 className={styles.title}>
                    HINODEのグループラン日程<br />
                    <span className={styles.titleSub}>皇居・目黒川・代々木公園</span>
                </h1>
                <p className={styles.lead}>
                    HINODEは、朝の時間にゆっくり走るランニングコミュニティです。<br />
                    参加無料・1人参加OK。登録なしで、そのまま参加できます。
                </p>

                <section id="event-calendar" className={styles.lumaSection} aria-labelledby="event-calendar-title">
                    <div className={styles.lumaHeader}>
                        <div>
                            <p className={styles.lumaLabel}>NEXT MORNING RUNS</p>
                            <h2 id="event-calendar-title">次の朝ラン</h2>
                        </div>
                        <a
                            href={LUMA_CALENDAR_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.lumaFollowLink}
                        >
                            Lumaですべて見る <span aria-hidden="true">↗</span>
                        </a>
                    </div>
                    {upcomingEvents?.length > 0 ? (
                        <RunEventCards events={upcomingEvents} />
                    ) : (
                        <p className={styles.eventEmpty}>
                            {upcomingEvents === null
                                ? '開催予定を読み込めませんでした。最新の予定はLuma・Stravaでご確認ください。'
                                : '次の開催予定は準備中です。Luma・Stravaでもご確認いただけます。'}
                        </p>
                    )}
                    <div className={styles.registrationNote}>
                        <p>登録なしで、そのまま参加できます。</p>
                        <p>
                            参加予定を登録するなら、Strava・Lumaのどちらでも。<br />
                            雨天中止などのお知らせを受け取りやすくなります。
                        </p>
                        <div className={styles.registrationLinks}>
                            <a href={STRAVA_CLUB_URL} target="_blank" rel="noopener noreferrer">Stravaで参加予定を登録 <span aria-hidden="true">↗</span></a>
                            <a href={LUMA_CALENDAR_URL} target="_blank" rel="noopener noreferrer">Lumaで参加予定を登録 <span aria-hidden="true">↗</span></a>
                        </div>
                    </div>
                </section>

                <div className={styles.firstRunCallout}>
                    <h2>初めて参加する方へ</h2>
                    <p>
                        HINODEは、予約不要・参加無料・1人参加歓迎の朝ランコミュニティです。
                        初めての方は、{FIRST_CHOICE_RUN.dayTimeLabel}の{FIRST_CHOICE_RUN.name}が参加しやすいです。
                        当日の流れ、服装、荷物、写真方針などは、初参加ガイドにまとめています。
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
                    {FAQ_ITEMS.map((item) => (
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
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={styles.linkBtnSecondary}>
                    Instagramを見る
                </a>
            </section>

            <PostBottomStrip />
        </div>
    );
}
