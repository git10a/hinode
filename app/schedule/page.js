import Image from 'next/image';
import Link from 'next/link';
import styles from './schedule.module.css';
import NextRunDate from '../../components/NextRunDate';
import PostBottomStrip from '../../components/PostBottomStrip';

export const metadata = {
    title: '東京の日の出ラン開催日程｜皇居・目黒川・代々木公園で毎週開催',
    description: 'HINODEの日の出ラン開催日程ページです。皇居・目黒川・代々木公園で毎週開催。集合場所、曜日、距離、参加しやすさ、初参加時の流れをまとめています。最新情報はStravaとInstagramで確認できます。',
};

const STRAVA_CLUB_URL = 'https://www.strava.com/clubs/1772485';

const EVENTS_JSON_LD = [
    {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": "皇居の日の出ラン｜HINODE",
        "description": "毎週水曜6:30から皇居で開催する日の出ラン。約5km、左回りで1周。参加無料・予約不要。",
        "eventSchedule": { "@type": "Schedule", "repeatFrequency": "P1W", "byDay": "https://schema.org/Wednesday", "startTime": "06:30", "scheduleTimezone": "Asia/Tokyo" },
        "location": { "@type": "Place", "name": "桔梗門前派出所", "address": { "@type": "PostalAddress", "addressLocality": "東京都千代田区", "addressCountry": "JP" } },
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "eventStatus": "https://schema.org/EventScheduled",
        "organizer": { "@type": "SportsClub", "name": "HINODE", "url": "https://hinode-run.com/" },
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY", "availability": "https://schema.org/InStock", "url": "https://hinode-run.com/schedule" }
    },
    {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": "目黒川の日の出ラン｜HINODE",
        "description": "毎週木曜6:30から中目黒で開催する日の出ラン。約4km、目黒川沿いを1周。参加無料・予約不要。",
        "eventSchedule": { "@type": "Schedule", "repeatFrequency": "P1W", "byDay": "https://schema.org/Thursday", "startTime": "06:30", "scheduleTimezone": "Asia/Tokyo" },
        "location": { "@type": "Place", "name": "スターバックス 中目黒蔦屋書店前", "address": { "@type": "PostalAddress", "addressLocality": "東京都目黒区", "addressCountry": "JP" } },
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "eventStatus": "https://schema.org/EventScheduled",
        "organizer": { "@type": "SportsClub", "name": "HINODE", "url": "https://hinode-run.com/" },
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY", "availability": "https://schema.org/InStock", "url": "https://hinode-run.com/schedule" }
    },
    {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": "代々木公園の日の出ラン｜HINODE",
        "description": "毎週日曜7:30から代々木公園で開催する日の出ラン。約2〜4km、左回りで1、2周。参加無料・予約不要。",
        "eventSchedule": { "@type": "Schedule", "repeatFrequency": "P1W", "byDay": "https://schema.org/Sunday", "startTime": "07:30", "scheduleTimezone": "Asia/Tokyo" },
        "location": { "@type": "Place", "name": "原宿時計塔前", "address": { "@type": "PostalAddress", "addressLocality": "東京都渋谷区", "addressCountry": "JP" } },
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "eventStatus": "https://schema.org/EventScheduled",
        "organizer": { "@type": "SportsClub", "name": "HINODE", "url": "https://hinode-run.com/" },
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY", "availability": "https://schema.org/InStock", "url": "https://hinode-run.com/schedule" }
    }
];

const participationSteps = [
    {
        title: 'Stravaクラブに参加',
        description: 'まずはHINODEのStravaクラブへ。直近のイベントもここから確認できます。',
        href: STRAVA_CLUB_URL,
    },
    {
        title: '直近のイベントを確認',
        description: '開催場所と時間を見て、行けそうな朝を選んでください。',
    },
    {
        title: '集合場所に3分前くらいに来る',
        description: 'きっちり早く来なくても大丈夫です。走れる格好でそのままどうぞ。',
    },
    {
        title: 'みんなでゆっくり走る',
        description: '会話しながら走れるくらいのペースで、無理なく進みます。',
    },
    {
        title: '終わったら自由解散',
        description: '時間がある方はカフェへ。予定がある方はそのまま解散でOKです。',
    },
];

const faqItems = [
    {
        question: '1人で行っても大丈夫ですか？',
        answer: 'むしろ1人参加が多いです。はじめましての方も、その朝から自然に混ざれる雰囲気です。',
    },
    {
        question: '速く走れないとダメですか？',
        answer: 'そんなことまったくありません。HINODEは速く走る場所ではなく、早朝に走り続けるための場所です。',
    },
    {
        question: '途中で歩いてもいいですか？',
        answer: 'もちろん大丈夫です。その日の体調に合わせて、無理なく参加してください。',
    },
    {
        question: '参加費は？',
        answer: '無料です。',
    },
    {
        question: '事前連絡は必要？',
        answer: '基本はStravaイベントへの参加でOKです。行かない時も連絡はまったく必要ありません。気が向いたら来てください。',
    },
];

const RUNS = [
    {
        id: 'kokyo',
        num: '01',
        name: '皇居の日の出ラン',
        day: '毎週水曜',
        time: '06:30〜',
        distance: '約5km',
        recommendationLabel: 'おすすめ',
        recommendation: '平日朝にしっかり走りたい人向け',
        meet: '桔梗門前派出所',
        mapImage: '/assets/kokyo-run-map.png',
        mapAlt: '皇居ラン',
        mapUrl: 'https://maps.app.goo.gl/E9HkSojyPZw6zo1b9',
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
        day: '毎週木曜',
        time: '06:30〜',
        distance: '約4km',
        recommendationLabel: 'おすすめ',
        recommendation: '短めの距離で平日朝に走りたい人向け',
        meet: 'スターバックス 中目黒蔦屋書店前',
        mapImage: '/assets/meguro-run-map.png',
        mapAlt: '目黒川ラン',
        mapUrl: 'https://maps.app.goo.gl/SKixyw53vfJnp1p36',
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
        day: '毎週日曜',
        time: '07:30〜',
        distance: '約2〜4km',
        recommendationLabel: '初参加に一番おすすめ',
        isFirstChoice: true,
        meet: '原宿時計塔前',
        mapImage: '/assets/yoyogi-run-map.png',
        mapAlt: '代々木公園ラン',
        mapUrl: 'https://maps.app.goo.gl/dB3L15dHByAoC4jw9',
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

export default function EventPage() {
    return (
        <div className={styles.page}>
            {EVENTS_JSON_LD.map((event, i) => (
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
                    東京の日の出ラン開催日程<br />
                    <span className={styles.titleSub}>皇居・目黒川・代々木公園</span>
                </h1>
                <p className={styles.lead}>
                    HINODEは、朝の時間にゆっくり走るランニングコミュニティです。<br />
                    予約不要・参加費無料・1人参加OK。
                </p>
                <div className={styles.firstRunCallout}>
                    <h2>初参加なら日曜がおすすめ</h2>
                    <p>
                        初参加の方は、まず日曜7:30の代々木公園ランがおすすめです。
                        距離は2〜4km、会話できるペースで走ります。1人参加も多く、朝ランに慣れていない方でも参加しやすい回です。
                    </p>
                </div>
            </div>

            <section className={styles.guideSection} aria-labelledby="first-time-guide-title">
                <div className={styles.guideIntro}>
                    <p className={styles.guideKicker}>FIRST RUN GUIDE</p>
                    <h2 id="first-time-guide-title" className={styles.guideTitle}>HINODE初参加ガイド</h2>
                    <p className={styles.guideLead}>
                        はじめて朝ランの集まりに行く時は、少し緊張すると思います。
                        HINODEは、ソロ参加が多く、会話しながら走れるくらいのペースで進みます。
                    </p>
                    <p className={styles.guideText}>
                        予約や細かい連絡はいりません。気が向いた朝に、集合場所へふらっと来てください。
                    </p>
                    <div className={styles.guideActions}>
                        <a href={STRAVA_CLUB_URL} target="_blank" rel="noopener noreferrer" className={styles.primaryGuideLink}>
                            Stravaクラブに参加 →
                        </a>
                        <a href="https://www.instagram.com/hinode_run/" target="_blank" rel="noopener noreferrer" className={styles.secondaryGuideLink}>
                            Instagramで連絡する
                        </a>
                    </div>
                </div>

                <div className={styles.flowPanel}>
                    <h3 className={styles.flowTitle}>参加の流れ</h3>
                    <ol className={styles.flowList}>
                        {participationSteps.map((step, index) => (
                            <li key={step.title} className={styles.flowItem}>
                                <span className={styles.flowNumber}>{String(index + 1).padStart(2, '0')}</span>
                                <div>
                                    <h4>
                                        {step.href ? (
                                            <a href={step.href} target="_blank" rel="noopener noreferrer">
                                                {step.title} →
                                            </a>
                                        ) : (
                                            step.title
                                        )}
                                    </h4>
                                    <p>{step.description}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section className={styles.runs}>
                {RUNS.map((run) => (
                    <article key={run.id} id={run.id} className={styles.runCard}>
                        <div className={styles.runHead}>
                            <span className={styles.runNum}>{run.num}</span>
                            <div className={styles.runHeadText}>
                                <h2 className={styles.runName}>{run.name}</h2>
                                <p className={`${styles.runRecommendation} ${run.isFirstChoice ? styles.runRecommendationPrimary : ''}`}>
                                    <span>{run.recommendationLabel}</span>
                                    {run.recommendation && (
                                        <span>{run.recommendation}</span>
                                    )}
                                </p>
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
                            <div className={styles.runMapCol}>
                                <div className={styles.runMapWrap}>
                                    <Image
                                        src={run.mapImage}
                                        alt={run.mapAlt}
                                        width={400}
                                        height={280}
                                        sizes="(max-width: 768px) 100vw, 280px"
                                        className={styles.runMapImage}
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
                                    <p className={styles.runNote}>{run.note}</p>
                                )}
                                <div className={styles.runForWhom}>
                                    <span className={styles.runForWhomLabel}>こんな方に</span>
                                    <span className={styles.runForWhomText}>{run.forWhom}</span>
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </section>

            <section className={styles.faqSection} aria-labelledby="first-time-faq-title">
                <div className={styles.sectionHead}>
                    <span className={styles.sectionNum}>04</span>
                    <h2 id="first-time-faq-title" className={styles.sectionTitle}>よくある不安</h2>
                </div>
                <div className={styles.faqGrid}>
                    {faqItems.map((item) => (
                        <article key={item.question} className={styles.faqItem}>
                            <h3>Q. {item.question}</h3>
                            <p>A. {item.answer}</p>
                        </article>
                    ))}
                </div>
                <div className={styles.callout}>
                    <span className={styles.calloutIcon} aria-hidden="true">☼</span>
                    <div className={styles.calloutBody}>
                        <p className={styles.calloutTitle}>手首の<strong>黄色いゴムバンド</strong>が目印です</p>
                        <p className={styles.calloutSub}>集合場所では、それを目印に合流してください。ほかに聞きたいことがあればInstagramで気軽にご連絡ください。</p>
                    </div>
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
