import Image from 'next/image';
import Link from 'next/link';
import styles from './schedule.module.css';
import NextRunDate from '../../components/NextRunDate';
import PostBottomStrip from '../../components/PostBottomStrip';

export const metadata = {
    title: '東京の朝ラン開催日程｜皇居・目黒川・代々木公園で毎週開催',
    description: 'HINODEの朝ラン開催日程ページです。皇居・目黒川・代々木公園で毎週開催。集合場所、曜日、距離、参加しやすさ、初参加時の注意点をまとめています。最新情報はStravaとInstagramで確認できます。',
};

const STRAVA_CLUB_URL = 'https://www.strava.com/clubs/1772485';

const EVENTS_JSON_LD = [
    {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": "皇居の朝ラン｜HINODE",
        "description": "毎週水曜6:30から皇居で開催する朝ラン。約5km、左回りで1周。参加無料・予約不要。",
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
        "name": "目黒川の朝ラン｜HINODE",
        "description": "毎週木曜6:30から中目黒で開催する朝ラン。約4km、目黒川沿いを1周。参加無料・予約不要。",
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
        "name": "代々木公園の朝ラン｜HINODE",
        "description": "毎週日曜7:30から代々木公園で開催する朝ラン。約3〜6km、左回りで1〜2周。参加無料・予約不要。",
        "eventSchedule": { "@type": "Schedule", "repeatFrequency": "P1W", "byDay": "https://schema.org/Sunday", "startTime": "07:30", "scheduleTimezone": "Asia/Tokyo" },
        "location": { "@type": "Place", "name": "原宿時計塔前", "address": { "@type": "PostalAddress", "addressLocality": "東京都渋谷区", "addressCountry": "JP" } },
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "eventStatus": "https://schema.org/EventScheduled",
        "organizer": { "@type": "SportsClub", "name": "HINODE", "url": "https://hinode-run.com/" },
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "JPY", "availability": "https://schema.org/InStock", "url": "https://hinode-run.com/schedule" }
    }
];

const RUNS = [
    {
        id: 'kokyo',
        num: '01',
        name: '皇居の朝ラン',
        day: '毎週水曜',
        time: '06:30〜',
        distance: '約5km',
        meet: '桔梗門前派出所',
        mapImage: '/assets/kokyo-run-map.png',
        mapAlt: '皇居ラン',
        mapUrl: 'https://maps.app.goo.gl/E9HkSojyPZw6zo1b9',
        dayOfWeek: 3,
        timeRaw: '06:30',
        description: (
            <>桔梗門前派出所に集合。<br />皇居を左回りで1周。<br />和田倉噴水公園内にはSTARBUCKSも。</>
        ),
        forWhom: '皇居で朝ランしたい方・仕事前に短く走りたい方・初参加でも合流しやすい定番コースです。',
    },
    {
        id: 'meguro',
        num: '02',
        name: '目黒川の朝ラン',
        day: '毎週木曜',
        time: '06:30〜',
        distance: '約4km',
        meet: 'スターバックス 中目黒蔦屋書店前',
        mapImage: '/assets/meguro-run-map.png',
        mapAlt: '目黒川ラン',
        mapUrl: 'https://maps.app.goo.gl/SKixyw53vfJnp1p36',
        dayOfWeek: 4,
        timeRaw: '06:30',
        description: (
            <>中目黒駅のスターバックス蔦屋書店前に集合。<br />目黒川をぐるっと回るコース。<br />走り終わったらスタバでコーヒーを。8時開店の「I&apos;m donut ?」にも並ばずに行けます。</>
        ),
        forWhom: '中目黒エリアで朝ランしたい方・平日朝に短く走りたい方・距離が短めで参加しやすい回です。',
    },
    {
        id: 'yoyogi',
        num: '03',
        name: '代々木公園の朝ラン',
        day: '毎週日曜',
        time: '07:30〜',
        distance: '約3〜6km',
        meet: '原宿時計塔前',
        mapImage: '/assets/yoyogi-run-map.png',
        mapAlt: '代々木公園ラン',
        mapUrl: 'https://maps.app.goo.gl/dB3L15dHByAoC4jw9',
        dayOfWeek: 0,
        timeRaw: '07:30',
        description: (
            <>原宿時計塔に集合。<br />代々木公園を左回りで1〜2周。<br />公園を降りて少し歩いたところにはVERVE COFFEEなど、カフェスポットあり。</>
        ),
        forWhom: '代々木公園で朝ランしたい方・まず朝ランを始めてみたい方・初心者や会話しながら走りたい方に向いています。',
        note: (
            <>代々木公園の日曜7:30開始は、HINODEの入り口として位置付けています。「いきなり日の出前の皇居や中目黒は早すぎる」という方が、まずここで朝ランのリズムに慣れ、そこから平日の <a href="#kokyo" className={styles.noteLink}>皇居（水曜6:30）</a> や <a href="#meguro" className={styles.noteLink}>目黒川（木曜6:30）</a> に進む流れを想定しています。</>
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
                    東京の朝ラン開催日程<br />
                    <span className={styles.titleSub}>皇居・目黒川・代々木公園</span>
                </h1>
                <p className={styles.lead}>
                    皇居・目黒川・代々木公園で毎週開催。<br />
                    予約不要・参加費無料・1人参加OK。
                </p>
            </div>

            <section className={styles.runs}>
                {RUNS.map((run) => (
                    <article key={run.id} id={run.id} className={styles.runCard}>
                        <div className={styles.runHead}>
                            <span className={styles.runNum}>{run.num}</span>
                            <div className={styles.runHeadText}>
                                <h2 className={styles.runName}>{run.name}</h2>
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

            <section className={styles.beginners}>
                <div className={styles.sectionHead}>
                    <span className={styles.sectionNum}>04</span>
                    <h2 className={styles.sectionTitle}>初参加の方へ</h2>
                </div>
                <div className={styles.callout}>
                    <span className={styles.calloutIcon} aria-hidden="true">☼</span>
                    <div className={styles.calloutBody}>
                        <p className={styles.calloutTitle}>手首の<strong>黄色いゴムバンド</strong>が目印です</p>
                        <p className={styles.calloutSub}>集合場所では、それを目印に合流してください。</p>
                    </div>
                </div>
                <ul className={styles.list}>
                    <li>予約不要・参加費無料。走れる服装とシューズだけで大丈夫です</li>
                    <li>ペース・距離は自由、歩いても途中参加・途中離脱も問題なし</li>
                    <li>参加者の約3割はほぼ初めてのランニング。1人参加も多いです</li>
                    <li>雨天は基本中止。開催可否は当日の <a href="https://www.instagram.com/hinode_run/" target="_blank" rel="noopener noreferrer" className={styles.link}>Instagram</a> / <a href="https://strava.app.link/pQ0uMuWWj2b" target="_blank" rel="noopener noreferrer" className={styles.link}>Strava</a> で確認してください</li>
                </ul>
                <p className={styles.faqLink}>
                    <Link href="/about#faq" className={styles.link}>よくある質問はこちら →</Link>
                </p>
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
