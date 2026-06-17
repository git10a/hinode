import Image from 'next/image';
import Link from '@/components/SiteLink';
import ParticipantPreview from '../../components/ParticipantPreview';
import { getUpcomingGroupEvents } from '../../lib/strava';
import styles from './event-runs.module.css';

const SITE_URL = 'https://hinode-run.com';
const STRAVA_CLUB_ID = '1772485';
const STRAVA_CLUB_URL = `https://www.strava.com/clubs/${STRAVA_CLUB_ID}`;
const INSTAGRAM_URL = 'https://www.instagram.com/hinode_run/';
const REGULAR_DAY_INDEXES = new Set([0, 3, 4]);
const DAY_LABEL_JP = ['日', '月', '火', '水', '木', '金', '土'];

export const metadata = {
    title: 'HINODEの企画ラン｜東京の朝ランコミュニティ',
    description: 'HINODEが土曜日に不定期で開催している企画ランの記録です。東京湾で初日の出を拝むラン、横浜で日の出を見るラン、東京マラソンEXPO 2026会場まで走るラン、おおたかの森ランなど、定例ランとは違う楽しみ方を紹介します。',
    alternates: {
        canonical: `${SITE_URL}/event-runs`,
    },
    openGraph: {
        title: 'HINODEの企画ラン｜東京の朝ランコミュニティ',
        description: '東京湾の初日の出、横浜の日の出、東京マラソンEXPO 2026、おおたかの森。HINODEの土曜企画ランの記録。',
        url: `${SITE_URL}/event-runs`,
        siteName: 'HINODE',
        locale: 'ja_JP',
        type: 'website',
        images: ['/assets/Takeshiba.jpg'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'HINODEの企画ラン｜東京の朝ランコミュニティ',
        description: 'HINODEの土曜企画ランの記録。定例ランとは違う、目的地のある朝ランです。',
        images: ['/assets/Takeshiba.jpg'],
    },
};

export const revalidate = 900;

function stravaEventUrl(eventId) {
    return `https://www.strava.com/clubs/${STRAVA_CLUB_ID}/group_events/${eventId}`;
}

function getJstWallClockDate(date) {
    return new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
}

function pad2(value) {
    return String(value).padStart(2, '0');
}

function formatEventStart(date) {
    const jstDate = getJstWallClockDate(date);
    return {
        date: `${jstDate.getMonth() + 1}/${jstDate.getDate()}（${DAY_LABEL_JP[jstDate.getDay()]}）`,
        time: `${pad2(jstDate.getHours())}:${pad2(jstDate.getMinutes())}`,
    };
}

const PAST_RUNS = [
    {
        title: '東京湾で初日の出を拝むラン',
        date: '2026.01.01',
        label: '初日の出',
        image: '/assets/Takeshiba.jpg',
        alt: '東京湾の朝焼けと水面',
        description: 'まだ暗い時間に集まり、東京湾まで走って海の向こうが明るくなるのを待つ元日の企画。走ること自体より、年のはじまりを一緒に迎える時間が主役です。',
        details: ['東京湾エリア', '早朝集合', '日の出を見る'],
    },
    {
        title: '横浜で日の出ラン',
        date: '2026.01.09',
        label: '横浜',
        image: '/assets/event-run-yokohama-sunrise.jpg',
        alt: '横浜の海辺から見える朝焼けと橋',
        description: '横浜の海辺まで走り、空が明るくなっていく時間をゆっくり眺める企画。東京の定例ランとは違う、広い空と水辺の朝を楽しむランです。',
        details: ['横浜', '日の出', '水辺を走る'],
        objectPosition: 'center 68%',
    },
    {
        title: '東京マラソンEXPO 2026会場まで走って、現地で爆買いラン',
        date: '2026.02.28',
        label: 'EXPO',
        image: '/assets/event-run-tokyo-marathon-expo-2026.png',
        alt: '東京マラソンEXPO 2026の会場',
        description: '東京マラソンEXPO 2026の会場まで走り、到着後はランニング用品を現地で楽しむ企画。目的地があるから、走る前から少しそわそわする朝です。',
        details: ['東京マラソンEXPO 2026', '会場まで走る', '現地で爆買い'],
        objectPosition: 'center 45%',
    },
    {
        title: 'おおたかの森ラン',
        date: '2026.05.09',
        label: 'おおたかの森',
        image: '/assets/event-run-otakanomori.png',
        alt: 'おおたかの森の緑と橋のある道',
        description: 'いつもの東京中心部を離れて、おおたかの森方面へ走りに行く企画。街と緑の距離が近く、定例ランとは違う空の広さを感じられるコースです。',
        details: ['おおたかの森', '緑のある道', '遠征ラン'],
        objectPosition: 'center 55%',
    },
];

const OTHER_LOCATIONS = [
    {
        name: '上野公園',
        text: '不忍池や公園内の道を使って、いつもの皇居・目黒川・代々木公園とは違う朝の空気を楽しみます。',
    },
    {
        name: '木場公園',
        text: '広い公園とフラットな道があり、ゆっくり走りたい日にも少し長めに走りたい日にも使いやすい場所です。',
    },
    {
        name: '勝どき',
        text: '水辺の道や橋の景色を楽しみながら走れるエリア。東京湾方面の企画とも相性がいい場所です。',
    },
    {
        name: '駒沢公園など',
        text: '定例開催地ではない公園や街にも出かけます。企画ごとに集合場所、距離、寄り道先を決めています。',
    },
];

function createJsonLd() {
    return [
        {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'HINODEの企画ラン',
            description: metadata.description,
            url: `${SITE_URL}/event-runs`,
            isPartOf: {
                '@type': 'WebSite',
                name: 'HINODE',
                url: SITE_URL,
            },
            about: {
                '@type': 'Thing',
                name: '企画ラン',
            },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'HINODEの過去の企画ラン',
            itemListElement: PAST_RUNS.map((run, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                    '@type': 'CreativeWork',
                    name: run.title,
                    description: run.description,
                    image: `${SITE_URL}${run.image}`,
                },
            })),
        },
    ];
}

export default async function EventRunsPage() {
    const upcomingEvents = await getUpcomingGroupEvents();
    const specialEvents = upcomingEvents
        .filter((event) => !REGULAR_DAY_INDEXES.has(event.dayOfWeek))
        .slice(0, 3);
    const jsonLd = createJsonLd();

    return (
        <div className={styles.page}>
            {jsonLd.map((entry, index) => (
                <script
                    key={index}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
                />
            ))}

            <section className={styles.hero} aria-labelledby="event-runs-title">
                <div className={styles.heroPoster}>
                    <div className={styles.heroCopy}>
                        <p className={styles.kicker}>Event Runs</p>
                        <h1 id="event-runs-title" className={styles.title}>
                            土曜日の、<br />
                            特別な朝。
                        </h1>
                        <p className={styles.lead}>
                            定例ランとは違う、目的のある走り。街を抜け、景色を見に行き、走ったあとの銭湯や朝ごはんまで楽しむHINODEの企画ランです。
                        </p>
                        <div className={styles.heroActions}>
                            <Link href="#upcoming-event-runs-title" className={styles.primaryLink}>
                                直近の企画を見る
                            </Link>
                            <a
                                href={STRAVA_CLUB_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.secondaryLink}
                            >
                                Stravaで見る
                            </a>
                        </div>
                        <ul className={styles.heroFacts} aria-label="企画ランの特徴">
                            <li>土曜不定期</li>
                            <li>1人参加OK</li>
                            <li>途中参加・途中離脱OK</li>
                        </ul>
                    </div>
                    <div className={styles.heroMedia}>
                        <div className={styles.heroImageFrame}>
                            <Image
                                src="/assets/Takeshiba.jpg"
                                alt="東京湾の朝焼け"
                                fill
                                sizes="(max-width: 760px) 100vw, 46vw"
                                priority
                            />
                        </div>
                        <div className={styles.heroStamp}>
                            <span>{PAST_RUNS[0].date}</span>
                            <strong>東京湾へ、初日の出を見に行く</strong>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.upcomingSection} aria-labelledby="upcoming-event-runs-title">
                <div className={styles.sectionHeader}>
                    <p className={styles.sectionLabel}>Upcoming</p>
                    <h2 id="upcoming-event-runs-title" className={styles.sectionTitle}>次の企画ラン</h2>
                    <p className={styles.sectionLead}>
                        Stravaに登録されている土曜などの不定期イベントを表示しています。最新の参加表明や集合場所はStravaで確認してください。
                    </p>
                </div>

                {specialEvents.length > 0 ? (
                    <ul className={styles.upcomingList}>
                        {specialEvents.map((event) => {
                            const start = formatEventStart(new Date(event.startAt));

                            return (
                                <li key={event.eventId} className={styles.upcomingItem}>
                                    <a
                                        href={stravaEventUrl(event.eventId)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.upcomingLink}
                                    >
                                        <span className={styles.upcomingDate}>
                                            <span>{start.date}</span>
                                            <span>{start.time}</span>
                                        </span>
                                        <span className={styles.upcomingBody}>
                                            <span className={styles.upcomingName}>{event.title}</span>
                                            {event.address && (
                                                <span className={styles.upcomingAddress}>{event.address}</span>
                                            )}
                                            <ParticipantPreview
                                                count={event.participantCount}
                                                participants={event.participants}
                                                className={styles.upcomingParticipants}
                                            />
                                        </span>
                                        <span className={styles.upcomingArrow} aria-hidden="true">Strava</span>
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className={styles.emptyUpcoming}>
                        <p>
                            いま表示できる直近の企画はありません。企画ランは不定期開催なので、
                            最新情報はStravaまたはInstagramで告知しています。
                        </p>
                        <div className={styles.emptyActions}>
                            <a href={STRAVA_CLUB_URL} target="_blank" rel="noopener noreferrer">
                                Stravaを見る
                            </a>
                            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                                Instagramを見る
                            </a>
                        </div>
                    </div>
                )}
            </section>

            <section id="past-runs" className={styles.archiveSection} aria-labelledby="past-event-runs-title">
                <div className={styles.sectionHeader}>
                    <p className={styles.sectionLabel}>Archive</p>
                    <h2 id="past-event-runs-title" className={styles.sectionTitle}>これまでの企画ラン</h2>
                    <p className={styles.sectionLead}>
                        定例ランでは行かない場所へ出かけたり、走ったあとに銭湯や朝ごはんへ寄ったり。
                        HINODEでは、こういう企画もゆっくり続けています。
                    </p>
                </div>

                <div className={styles.archiveGrid}>
                    {PAST_RUNS.map((run, index) => (
                        <article key={run.title} className={`${styles.archiveCard} ${index === 0 ? styles.archiveCardFeature : ''}`}>
                            <div className={styles.archiveImage}>
                                <Image
                                    src={run.image}
                                    alt={run.alt}
                                    fill
                                    sizes={index === 0 ? '(max-width: 760px) 100vw, 58vw' : '(max-width: 760px) 100vw, 36vw'}
                                    style={{ objectPosition: run.objectPosition || 'center' }}
                                />
                                <span className={styles.archiveLabel}>{run.label}</span>
                            </div>
                            <div className={styles.archiveBody}>
                                <span className={styles.archiveNumber}>{run.date}</span>
                                <h3>{run.title}</h3>
                                <p>{run.description}</p>
                                <ul className={styles.detailList} aria-label={`${run.title}の特徴`}>
                                    {run.details.map((detail) => (
                                        <li key={detail}>{detail}</li>
                                    ))}
                                </ul>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className={styles.locationsSection} aria-labelledby="other-locations-title">
                <div className={styles.locationsInner}>
                    <div className={styles.locationsHeader}>
                        <p className={styles.sectionLabel}>Places</p>
                        <h2 id="other-locations-title" className={styles.sectionTitle}>
                            いつもと違う場所、<br />いつもと違う空。
                        </h2>
                    </div>
                    <div className={styles.locationGrid}>
                        {OTHER_LOCATIONS.map((location) => (
                            <article key={location.name} className={styles.locationItem}>
                                <h3>{location.name}</h3>
                                <p>{location.text}</p>
                            </article>
                        ))}
                        <article className={`${styles.locationItem} ${styles.locationRequest}`}>
                            <h3>走ってみたい場所、募集中</h3>
                            <p>
                                開催してほしい場所や、みんなで走ったら気持ちよさそうな街・公園があれば、
                                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={styles.locationLink}>
                                    Instagram
                                </a>
                                などで気軽にメッセージください。次の企画のきっかけになるかもしれません。
                            </p>
                        </article>
                    </div>
                </div>
            </section>

            <section className={styles.guideSection} aria-labelledby="join-event-runs-title">
                <div className={styles.guideText}>
                    <p className={styles.sectionLabel}>Join</p>
                    <h2 id="join-event-runs-title" className={styles.sectionTitle}>企画ランも、初参加歓迎です</h2>
                    <p>
                        距離が長い企画でも、すべてを走り切る必要はありません。途中参加、途中離脱、歩きながらの合流も大丈夫です。
                        不安な方は、まず日曜の代々木公園ランで雰囲気を見てから企画ランに来るのもおすすめです。
                    </p>
                </div>
                <div className={styles.guideActions}>
                    <Link href="/first-run" className={styles.primaryLink}>
                        初参加ガイドを見る
                    </Link>
                    <Link href="/schedule" className={styles.secondaryLink}>
                        定例ランの日程を見る
                    </Link>
                </div>
            </section>
        </div>
    );
}
