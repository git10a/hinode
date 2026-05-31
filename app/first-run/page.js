import Image from 'next/image';
import Link from 'next/link';
import ParticipantPreview from '../../components/ParticipantPreview';
import PostBottomStrip from '../../components/PostBottomStrip';
import ShareScheduleButton from '../../components/ShareScheduleButton';
import { getUpcomingGroupEvents } from '../../lib/strava';
import styles from './first-run.module.css';

export const metadata = {
    title: 'HINODE初参加ガイド｜初めて朝ランに参加する方へ',
    description: 'HINODEの初参加ガイドです。おすすめの回、当日の流れ、集合場所での合流、ペース、服装、荷物、写真方針、Strava、雨天時の確認方法をまとめています。',
};

const STRAVA_CLUB_URL = 'https://www.strava.com/clubs/1772485';
const STRAVA_CLUB_ID = '1772485';
const NOTEBOOK_LM_URL = 'https://notebooklm.google.com/notebook/40deb023-33ff-4bf9-985a-08cbfe6df7aa';
const INSTAGRAM_URL = 'https://www.instagram.com/hinode_run/';

export const revalidate = 60;

const FIRST_CHOICE_RUN = {
    day: '日曜',
    dayOfWeek: 0,
    time: '07:10〜',
    timeRaw: '07:10',
    place: '代々木公園',
    location: '原宿時計塔前',
    image: '/assets/Yoyogi.png',
    href: '/schedule#yoyogi',
};

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

function getNextRegularEvent(item, now = new Date()) {
    const jstNow = getJstWallClockDate(now);
    const [hours, minutes] = item.timeRaw.split(':').map(Number);
    const currentMinutes = jstNow.getHours() * 60 + jstNow.getMinutes();
    const eventMinutes = hours * 60 + minutes;

    let daysUntil = item.dayOfWeek - jstNow.getDay();
    if (daysUntil < 0) {
        daysUntil += 7;
    } else if (daysUntil === 0 && currentMinutes >= eventMinutes + EVENT_DURATION_MINUTES) {
        daysUntil = 7;
    }

    const start = new Date(jstNow);
    start.setDate(start.getDate() + daysUntil);
    start.setHours(hours, minutes, 0, 0);

    return formatWallClockDate(start);
}

function stravaEventUrl(eventId) {
    return `https://www.strava.com/clubs/${STRAVA_CLUB_ID}/group_events/${eventId}`;
}

const FLOW_STEPS = [
    {
        title: '行けそうな回を選ぶ',
        text: '開催日程をご覧ください。初めてなら日曜の代々木公園ランがおすすめです。',
    },
    {
        title: '集合時間の少し前に着く',
        text: '走れる服装でお越しください。荷物がある方は、駅のロッカーやランステ利用がおすすめです。',
    },
    {
        title: '黄色いゴムバンドが目印',
        text: '手首に黄色いゴムバンドをつけている人が目印です。気さくなメンバーばかりなので、遠慮なくお声がけください。',
    },
    {
        title: 'ゆっくりめに走る',
        text: '会話できるくらいのペースで走ります。歩いても、途中離脱しても、その日の体調に合わせて大丈夫です。',
    },
    {
        title: '走り終わったら自由解散',
        text: '予定がある方はそのまま解散できます。時間があればカフェに行ったりします。',
    },
];

const GUIDE_CARDS = [
    {
        title: 'どの回がおすすめ？',
        body: 'まずは日曜7:10の代々木公園ランがおすすめです。距離は約2〜4kmで、平日6:00の回より時間にも余裕があります。',
    },
    {
        title: '集合場所ではどう合流する？',
        body: '集合場所に着いたら、黄色いゴムバンドを手首につけている人を目印にしてください。',
    },
    {
        title: 'どんなペース？',
        body: '06:30/km〜07:00/kmくらいの会話しながら走れるペースです。歩いても途中離脱してもまったく問題ありません。',
    },
    {
        title: '事前連絡は必要？',
        body: '必要ありませんが、Stravaで参加表明してもらえると、他の人も参加しやすくなります。',
    },
    {
        title: 'どんな人が来る？',
        body: '中学生から50代まで、老若男女問わず参加しています。朝に走る習慣をつけたい人、1人では続きにくい人も来ています。',
    },
    {
        title: 'ひとり参加でも大丈夫？',
        body: '大丈夫です。毎回4割前後はソロ・初参加です。もちろんお友達などとお越しいただくのも大歓迎です。',
    },
    {
        title: '写真に写らなくても大丈夫？',
        body: 'HINODEでは、基本的に集合写真は撮りません。景色の写真を撮ることはありますが、参加者の顔出しやSNS掲載を前提にした場ではありません。',
    },
    {
        title: 'Stravaは必須？',
        body: '必須ではありませんが、使っている方は、参加表明やラン記録、ほかの参加者とのつながりに使えます。',
    },
    {
        title: '荷物・ランステ・服装はどうする？',
        body: (
            <>
                代々木公園で走る場合は、Runtrip BASEでHINODEのメンバーと伝えるとタオルが無料で使えます。
                <Link href="/blog/4n3rlaujfpd9" className={styles.inlineLink}>（詳しくはこちら）</Link>
            </>
        ),
        schemaText: '代々木公園で走る場合は、Runtrip BASEでHINODEのメンバーと伝えるとタオルが無料で使えます。詳しくはこちら: https://hinode-run.com/blog/4n3rlaujfpd9',
    },
    {
        title: '雨の日はどうなる？',
        body: '雨天は基本中止です。開催可否は当日のInstagramまたはStravaで案内するので、家を出る前に確認してください。',
    },
];

const FAQ_JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: GUIDE_CARDS.map((item) => ({
        '@type': 'Question',
        name: item.title,
        acceptedAnswer: {
            '@type': 'Answer',
            text: item.schemaText || item.body,
        },
    })),
};

export default async function FirstRunPage() {
    const upcomingEvents = await getUpcomingGroupEvents();
    const firstChoiceEvent = upcomingEvents.find((event) => event.dayOfWeek === FIRST_CHOICE_RUN.dayOfWeek);
    const firstChoiceDate = firstChoiceEvent ? formatEventDate(firstChoiceEvent.startAt) : getNextRegularEvent(FIRST_CHOICE_RUN);
    const firstChoiceStravaHref = firstChoiceEvent ? stravaEventUrl(firstChoiceEvent.eventId) : null;

    return (
        <div className={styles.page}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
            />

            <div className={styles.pageInner}>
                <section className={styles.hero}>
                    <div className={styles.heroCopy}>
                        <h1 className={styles.title}>
                            初めてHINODEに参加する方へ
                        </h1>
                        <p className={styles.lead}>
                            HINODEは、予約不要・参加無料・1人参加歓迎の朝ランコミュニティです。
                            初参加前に気になる、当日の流れ、集合場所での合流、服装、荷物、写真方針、Stravaの使い方をまとめました。
                        </p>
                        <div className={styles.heroActions}>
                            <Link href="/schedule" className={styles.primaryCta}>
                                開催スケジュールを見る →
                            </Link>
                            <a href={STRAVA_CLUB_URL} target="_blank" rel="noopener noreferrer" className={styles.secondaryCta}>
                                Stravaクラブを見る
                            </a>
                        </div>
                    </div>
                    <div className={styles.heroImageWrap}>
                        <Image
                            src="/assets/PXL_20260108_221045036.jpg"
                            alt="朝の光の中で走るHINODEメンバー"
                            width={1294}
                            height={1726}
                            sizes="(max-width: 900px) 100vw, 520px"
                            priority
                            className={styles.heroImage}
                        />
                    </div>
                </section>
            </div>

            <section className={`${styles.sectionBand} ${styles.sectionBandWarm}`} aria-labelledby="flow-title">
                <div className={styles.sectionInner}>
                    <div className={styles.sectionHead}>
                        <h2 id="flow-title" className={styles.sectionTitle}>当日の流れ</h2>
                    </div>
                    <ol className={styles.flowList}>
                        {FLOW_STEPS.map((step, index) => (
                            <li key={step.title} className={styles.flowItem}>
                                <span className={styles.flowNumber}>{String(index + 1).padStart(2, '0')}</span>
                                <div>
                                    <h3>{step.title}</h3>
                                    <p>{step.text}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section className={`${styles.sectionBand} ${styles.sectionBandChoice}`} aria-labelledby="quick-title">
                <div className={styles.sectionInner}>
                    <div className={styles.sectionHead}>
                        <h2 id="quick-title" className={styles.sectionTitle}>最初は日曜7:10の代々木公園ランがおすすめです</h2>
                        <p className={styles.sectionLead}>
                            平日6:00の回より時間に余裕があり、距離も約2〜4km。初めての方が入りやすい回です。
                        </p>
                    </div>
                    <article className={styles.firstChoiceCard}>
                        <div className={styles.firstChoiceThumb}>
                            <Image
                                src={FIRST_CHOICE_RUN.image}
                                alt={FIRST_CHOICE_RUN.place}
                                fill
                                sizes="(max-width: 768px) 100vw, 300px"
                            />
                        </div>
                        <div className={styles.firstChoiceBody}>
                            <p className={styles.firstChoiceMeta}>
                                {firstChoiceDate && (
                                    <span className={styles.firstChoiceDate}>{firstChoiceDate}</span>
                                )}
                                <span className={styles.firstChoiceDayTime}>{FIRST_CHOICE_RUN.day} {FIRST_CHOICE_RUN.timeRaw}</span>
                            </p>
                            <h3 className={styles.firstChoicePlace}>{FIRST_CHOICE_RUN.place}</h3>
                            <p className={styles.firstChoiceLocation}>
                                <svg viewBox="0 0 24 24" className={styles.firstChoiceLocationIcon} aria-hidden="true">
                                    <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" />
                                    <circle cx="12" cy="9" r="2.5" />
                                </svg>
                                {FIRST_CHOICE_RUN.location}
                            </p>
                            <ParticipantPreview
                                count={firstChoiceEvent?.participantCount}
                                participants={firstChoiceEvent?.participants || []}
                                className={styles.firstChoiceParticipants}
                            />
                            <div className={styles.firstChoiceActions}>
                                <Link href={FIRST_CHOICE_RUN.href} className={styles.firstChoicePrimaryButton}>
                                    集合場所と参加方法を見る
                                </Link>
                                {firstChoiceStravaHref && (
                                    <a
                                        href={firstChoiceStravaHref}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.firstChoiceSubButton}
                                    >
                                        Stravaページを見る
                                    </a>
                                )}
                                <ShareScheduleButton
                                    path={FIRST_CHOICE_RUN.href}
                                    className={styles.firstChoiceShareButton}
                                />
                            </div>
                        </div>
                    </article>
                </div>
            </section>

            <section className={`${styles.sectionBand} ${styles.sectionBandGreen}`} aria-labelledby="guide-title">
                <div className={styles.sectionInner}>
                    <div className={styles.sectionHead}>
                        <h2 id="guide-title" className={styles.sectionTitle}>初参加前に気になること</h2>
                    </div>
                    <div className={styles.questionList}>
                        {GUIDE_CARDS.map((item) => (
                            <details key={item.title} className={styles.questionItem}>
                                <summary>
                                    <span>{item.title}</span>
                                </summary>
                                <p>{item.body}</p>
                            </details>
                        ))}
                    </div>
                    <aside className={styles.aiGuideCard} aria-labelledby="ai-guide-title">
                        <div className={styles.aiGuideText}>
                            <p className={styles.aiGuideKicker}>HINODE案内所</p>
                            <h3 id="ai-guide-title" className={styles.aiGuideTitle}>まだ不安なことがあれば</h3>
                            <p className={styles.aiGuideLead}>
                                初参加・持ち物・集合場所など、HINODEのことをAIに質問できます。
                                回答にないことはInstagram DMでも遠慮なく聞いてください。
                            </p>
                        </div>
                        <div className={styles.aiGuideActions}>
                            <a
                                href={NOTEBOOK_LM_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.aiGuidePrimary}
                            >
                                HINODE案内所で質問する
                            </a>
                            <a
                                href={INSTAGRAM_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.aiGuideSecondary}
                            >
                                Instagramで聞く
                            </a>
                        </div>
                    </aside>
                </div>
            </section>

            <PostBottomStrip compact />
        </div>
    );
}
