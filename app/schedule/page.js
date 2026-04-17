import Image from 'next/image';
import styles from './schedule.module.css';
import NextRunDate from '../../components/NextRunDate';

export const metadata = {
    title: '東京の朝ラン開催日程｜皇居・目黒川・代々木公園で毎週開催',
    description: 'HINODEの朝ラン開催日程ページです。皇居・目黒川・代々木公園で毎週開催。集合場所、曜日、距離、参加しやすさ、初参加時の注意点をまとめています。最新情報はStravaとInstagramで確認できます。',
};

const EVENTS_JSON_LD = [
    {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": "皇居の朝ラン｜HINODE",
        "description": "毎週水曜6:30から皇居で開催する朝ラン。約5km、左回りで1周。参加無料・予約不要。",
        "eventSchedule": {
            "@type": "Schedule",
            "repeatFrequency": "P1W",
            "byDay": "https://schema.org/Wednesday",
            "startTime": "06:30",
            "scheduleTimezone": "Asia/Tokyo"
        },
        "location": {
            "@type": "Place",
            "name": "桔梗門前派出所",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "東京都千代田区",
                "addressCountry": "JP"
            }
        },
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "eventStatus": "https://schema.org/EventScheduled",
        "organizer": {
            "@type": "SportsClub",
            "name": "HINODE",
            "url": "https://hinode-run.com/"
        },
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "JPY",
            "availability": "https://schema.org/InStock",
            "url": "https://hinode-run.com/schedule"
        }
    },
    {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": "目黒川の朝ラン｜HINODE",
        "description": "毎週木曜6:30から中目黒で開催する朝ラン。約4km、目黒川沿いを1周。参加無料・予約不要。",
        "eventSchedule": {
            "@type": "Schedule",
            "repeatFrequency": "P1W",
            "byDay": "https://schema.org/Thursday",
            "startTime": "06:30",
            "scheduleTimezone": "Asia/Tokyo"
        },
        "location": {
            "@type": "Place",
            "name": "スターバックス 中目黒蔦屋書店前",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "東京都目黒区",
                "addressCountry": "JP"
            }
        },
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "eventStatus": "https://schema.org/EventScheduled",
        "organizer": {
            "@type": "SportsClub",
            "name": "HINODE",
            "url": "https://hinode-run.com/"
        },
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "JPY",
            "availability": "https://schema.org/InStock",
            "url": "https://hinode-run.com/schedule"
        }
    },
    {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": "代々木公園の朝ラン｜HINODE",
        "description": "毎週日曜7:30から代々木公園で開催する朝ラン。約3〜6km、左回りで1〜2周。参加無料・予約不要。",
        "eventSchedule": {
            "@type": "Schedule",
            "repeatFrequency": "P1W",
            "byDay": "https://schema.org/Sunday",
            "startTime": "07:30",
            "scheduleTimezone": "Asia/Tokyo"
        },
        "location": {
            "@type": "Place",
            "name": "原宿時計塔前",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "東京都渋谷区",
                "addressCountry": "JP"
            }
        },
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "eventStatus": "https://schema.org/EventScheduled",
        "organizer": {
            "@type": "SportsClub",
            "name": "HINODE",
            "url": "https://hinode-run.com/"
        },
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "JPY",
            "availability": "https://schema.org/InStock",
            "url": "https://hinode-run.com/schedule"
        }
    }
];

export default function EventPage() {
    return (
        <div className={styles.container}>
            {EVENTS_JSON_LD.map((event, i) => (
                <script
                    key={i}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(event) }}
                />
            ))}
            <section className={styles.header}>
                <h1 className={`${styles.pageTitle} ${styles.pageTitleJp}`}>東京の朝ラン開催日程｜皇居・目黒川・代々木公園</h1>
                <div className={styles.subCopy}>
                    <p>皇居・目黒川・代々木公園で毎週開催。予約不要・参加費無料・1人参加OK。</p>
                </div>
                <a
                    href="https://www.strava.com/clubs/hinode"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.headerBtn}
                >
                    Stravaクラブで参加表明
                </a>
            </section>

            <section className={styles.scheduleSection}>
                {/* WED - Imperial Palace */}
                <div id="kokyo" className={styles.runRow}>
                    <div className={styles.runNumber}>01</div>
                    <div className={styles.runInfo}>
                        <h2 className={styles.runName}>皇居の朝ラン｜毎週水曜 06:30〜</h2>
                        <p className={styles.runMeta}>
                            <span className={styles.dayBadge}>毎週水曜</span>
                            <span className={styles.runDistance}>（約5km）</span>
                        </p>
                        <NextRunDate dayOfWeek={3} time="06:30" className={styles.nextDate} />
                    </div>
                    <div className={styles.runMapSection}>
                        <Image src="/assets/kokyo-run-map.png" alt="皇居ラン" width={200} height={140} sizes="(max-width: 768px) 280px, 200px" className={styles.runMapImage} />
                        <a href="https://maps.app.goo.gl/E9HkSojyPZw6zo1b9" target="_blank" rel="noopener noreferrer" className={styles.googleMapLink}>
                            📍 Google map
                        </a>
                    </div>
                    <div className={styles.runDescription}>
                        <p>桔梗門前派出所に集合。<br />皇居を左回りで1周。<br />和田倉噴水公園内にはSTARBUCKSも。</p>
                        <p className={styles.runForWhom}>皇居で朝ランしたい方・仕事前に短く走りたい方・初参加でも合流しやすい定番コースです。</p>
                    </div>
                </div>

                {/* THU - Meguro River */}
                <div id="meguro" className={styles.runRow}>
                    <div className={styles.runNumber}>02</div>
                    <div className={styles.runInfo}>
                        <h2 className={styles.runName}>目黒川の朝ラン｜毎週木曜 06:30〜</h2>
                        <p className={styles.runMeta}>
                            <span className={styles.dayBadge}>毎週木曜</span>
                            <span className={styles.runDistance}>（約4km）</span>
                        </p>
                        <NextRunDate dayOfWeek={4} time="06:30" className={styles.nextDate} />
                    </div>
                    <div className={styles.runMapSection}>
                        <Image src="/assets/meguro-run-map.png" alt="目黒川ラン" width={200} height={140} sizes="(max-width: 768px) 280px, 200px" className={styles.runMapImage} />
                        <a href="https://maps.app.goo.gl/SKixyw53vfJnp1p36" target="_blank" rel="noopener noreferrer" className={styles.googleMapLink}>
                            📍 Google map
                        </a>
                    </div>
                    <div className={styles.runDescription}>
                        <p>中目黒駅のスターバックス蔦屋書店前に集合。<br />目黒川をぐるっと回るコース。<br />走り終わったらスタバでコーヒーを。8時開店の「I&apos;m donut ?」にも並ばずに行けます。</p>
                        <p className={styles.runForWhom}>中目黒エリアで朝ランしたい方・平日朝に短く走りたい方・距離が短めで参加しやすい回です。</p>
                    </div>
                </div>

                {/* SUN - Yoyogi */}
                <div id="yoyogi" className={styles.runRow}>
                    <div className={styles.runNumber}>03</div>
                    <div className={styles.runInfo}>
                        <h2 className={styles.runName}>代々木公園の朝ラン｜毎週日曜 07:30〜</h2>
                        <p className={styles.runMeta}>
                            <span className={styles.dayBadge}>毎週日曜</span>
                            <span className={styles.runDistance}>（約3〜6km）</span>
                        </p>
                        <NextRunDate dayOfWeek={0} time="07:30" className={styles.nextDate} />
                    </div>
                    <div className={styles.runMapSection}>
                        <Image src="/assets/yoyogi-run-map.png" alt="代々木公園ラン" width={200} height={140} sizes="(max-width: 768px) 280px, 200px" className={styles.runMapImage} />
                        <a href="https://maps.app.goo.gl/dB3L15dHByAoC4jw9" target="_blank" rel="noopener noreferrer" className={styles.googleMapLink}>
                            📍 Google map
                        </a>
                    </div>
                    <div className={styles.runDescription}>
                        <p>原宿時計塔に集合。<br />代々木公園を左回りで1〜2周。<br />公園を降りて少し歩いたところにはVERVE COFFEEなど、カフェスポットあり。</p>
                        <p className={styles.openCampus}>
                            代々木公園の日曜7:30開始は、HINODEの入り口として位置付けています。「いきなり日の出前の皇居や中目黒は早すぎる」という方が、まずここで朝ランのリズムに慣れ、そこから平日の <a href="#kokyo">皇居（水曜6:30）</a> や <a href="#meguro">目黒川（木曜6:30）</a> に進む流れを想定しています。
                        </p>
                        <p className={styles.runForWhom}>代々木公園で朝ランしたい方・まず朝ランを始めてみたい方・初心者や会話しながら走りたい方に向いています。</p>
                    </div>
                </div>
            </section>

            <section className={styles.beginnersSection}>
                <h2 className={styles.sectionTitle}>初参加の方へ</h2>
                <ul className={styles.beginnersList}>
                    <li>手首に<strong>黄色いゴムバンド</strong>をつけている人がHINODEです。それを目印に合流してください</li>
                    <li>予約不要・参加費無料。走れる服装とシューズだけで大丈夫です</li>
                    <li>ペース・距離は自由、歩いても途中参加・途中離脱も問題なし</li>
                    <li>参加者の約3割はほぼ初めてのランニング。1人参加も多いです</li>
                    <li>雨天は基本中止。開催可否は当日の <a href="https://www.instagram.com/hinode_run/" target="_blank" rel="noopener noreferrer">Instagram</a> / <a href="https://strava.app.link/pQ0uMuWWj2b" target="_blank" rel="noopener noreferrer">Strava</a> で確認してください</li>
                </ul>
                <p className={styles.faqLink}>
                    <a href="/about#faq">よくある質問はこちら →</a>
                </p>
            </section>

            <section className={styles.linksSection}>
                <a href="https://www.strava.com/clubs/hinode" target="_blank" rel="noopener noreferrer" className={styles.linkBtn}>
                    Strava クラブを見る
                </a>
                <a href="https://www.instagram.com/hinode_run/" target="_blank" rel="noopener noreferrer" className={styles.linkBtn}>
                    Instagramを見る
                </a>
            </section>
        </div>
    );
}
