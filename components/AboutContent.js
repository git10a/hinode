'use client';

import Image from 'next/image';
import Link from 'next/link';
import useFadeInOnScroll from '../lib/useFadeInOnScroll';
import PostBottomStrip from './PostBottomStrip';
import styles from '../app/about/about.module.css';

const SECTIONS = [
    {
        num: '01',
        title: 'HINODEはどんなコミュニティか',
        body: (
            <>
                <p className={styles.text}>週3回（水・木・日曜）のグループランを基本に、土曜日は不定期の企画ランも開催しています。上野公園へ行ったり、おいしいパン屋を目指したり、山手線一周ランをしたりする日もあります。ペースも距離も自由で、苦しくなったら歩いても問題ありません。速さではなく、走り続ける規律そのものを大事にしています。</p>
                <p className={styles.text}>競技志向のクラブではありません。ランキングやコーチング、練習メニューはなく、継続したい人のためのコミュニティです。中学生から50代まで、老若男女が参加しています。</p>
            </>
        ),
    },
    {
        num: '02',
        title: 'こんな人に向いています',
        body: (
            <ul className={styles.list}>
                <li>朝に走る習慣をつけたい人</li>
                <li>競争より継続を大事にしたい人</li>
                <li>1人だと続かない人</li>
                <li>速くなくても参加しやすい場を探している人</li>
            </ul>
        ),
    },
];

const STRAVA_CLUB_URL = 'https://www.strava.com/clubs/1772485';

const QUICK_FACTS = [
    {
        label: '予約不要',
        text: '予定が合えばそのまま集合場所へ',
    },
    {
        label: '参加無料',
        text: '走れる服装とシューズだけでOK',
    },
    {
        label: '初心者歓迎',
        text: '毎回、約3割がほぼ初めてのランニング',
    },
    {
        label: '1人参加OK',
        text: '黄色いゴムバンドを目印に合流',
    },
];

const FIRST_JOIN_STEPS = [
    {
        title: '日程を見る',
        text: '皇居・目黒川・代々木公園の開催日と集合場所を確認します。',
    },
    {
        title: '集合場所へ行く',
        text: '予約は不要です。開始数分前に、走れる服装で来てください。',
    },
    {
        title: '目印を探す',
        text: '手首に黄色いゴムバンドをつけている人を探してください。',
    },
    {
        title: '無理なく走る',
        text: 'ペースも距離も自由です。歩いても途中離脱しても大丈夫です。',
    },
];

const FAQ = [
    {
        q: '集合場所で誰もいなかったら？',
        a: (
            <>手首に黄色いゴムバンドをつけている人がいないか探してみてください。雨の日など開催できない場合は <a href="https://strava.app.link/pQ0uMuWWj2b" className={styles.link} target="_blank" rel="noopener noreferrer">Strava</a> / <a href="https://www.instagram.com/hinode_run/" className={styles.link} target="_blank" rel="noopener noreferrer">Instagram</a> で前もって告知します。</>
        ),
    },
    {
        q: 'どんな人が参加していますか？',
        a: '中学生から50代まで老若男女問わず参加しています。',
    },
    {
        q: '開始時間はいつですか？',
        a: '平日は6:30、日曜は7:30スタートです。太陽は待ってくれないので時間通りにスタートします。数分前には集合しておいてください。夏場は日の出が早く6:30だと少し日の出を過ぎますが、電車で来る方も参加しやすいよう通年同じ時刻に固定しています。',
    },
    {
        q: '何を持っていけばいいですか？',
        a: '走れる服装とシューズだけで大丈夫です。荷物がある場合は、駅のロッカーに預けてから来る方もいます。',
    },
    {
        q: 'Stravaへの参加表明は必要ですか？',
        a: (
            <>必須ではありませんが、<a href="https://strava.app.link/pQ0uMuWWj2b" className={styles.link} target="_blank" rel="noopener noreferrer">Strava</a> で「参加」を押してもらえると他の人も参加しやすくなります。</>
        ),
    },
    {
        q: '写真に写らなくても大丈夫ですか？',
        a: '大丈夫です。HINODEでは、基本的に集合写真は撮りません。日の出や街の景色がきれいなタイミングで、景色の写真を撮るために立ち止まることはありますが、参加者の顔出しやSNS掲載を前提にした場ではありません。',
    },
];

export default function AboutContent() {
    useFadeInOnScroll({
        selector: `.${styles.fadeIn}`,
        visibleClass: styles.visible
    });

    return (
        <div className={styles.page}>
            <nav className={styles.breadcrumb} aria-label="breadcrumb">
                <Link href="/" className={styles.breadcrumbLink}>HOME</Link>
                <span className={styles.breadcrumbSep}>›</span>
                <span className={styles.breadcrumbCurrent}>ABOUT</span>
            </nav>

            <div className={`${styles.hero} ${styles.fadeIn}`}>
                <p className={styles.eyebrow}>ABOUT HINODE</p>
                <h1 className={styles.title}>
                    東京で日の出とともに走る、<br />
                    朝ランコミュニティ
                </h1>
                <p className={styles.lead}>
                    HINODEは、日の出前に集まり、日の出とともに走る東京の朝ランコミュニティです。初心者でも参加でき、参加費無料、予約不要。皇居・目黒川・代々木公園を中心に、1人参加でも来やすい場を目指しています。
                </p>
                <div className={styles.heroActions}>
                    <Link href="/schedule" className={styles.primaryCta}>
                        開催日程を見る <span aria-hidden="true">→</span>
                    </Link>
                    <a
                        href={STRAVA_CLUB_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.secondaryCta}
                    >
                        Stravaで参加表明
                    </a>
                </div>
                <dl className={styles.quickFacts} aria-label="HINODEの参加しやすさ">
                    {QUICK_FACTS.map((fact) => (
                        <div key={fact.label} className={styles.quickFact}>
                            <dt>{fact.label}</dt>
                            <dd>{fact.text}</dd>
                        </div>
                    ))}
                </dl>
            </div>

            <div className={`${styles.heroImageWrap} ${styles.fadeIn}`}>
                <Image
                    src="/assets/about-hero-yokohama-sunrise.png"
                    alt="日の出前の横浜の水辺と橋の風景"
                    width={2282}
                    height={1030}
                    sizes="(max-width: 900px) 100vw, 860px"
                    priority
                    className={styles.heroImage}
                />
            </div>

            <section className={`${styles.startGuide} ${styles.fadeIn}`} aria-labelledby="first-join-title">
                <div className={styles.startGuideHeader}>
                    <p className={styles.guideEyebrow}>FIRST JOIN</p>
                    <h2 id="first-join-title" className={styles.guideTitle}>
                        初めての参加は、この順番で大丈夫です
                    </h2>
                    <p className={styles.guideLead}>
                        申込フォームも会員登録もありません。集合場所に来て、目印を見つけて、走れる範囲で一緒に走ります。
                    </p>
                </div>
                <ol className={styles.stepList}>
                    {FIRST_JOIN_STEPS.map((step, index) => (
                        <li key={step.title} className={styles.stepItem}>
                            <span className={styles.stepNum}>{String(index + 1).padStart(2, '0')}</span>
                            <h3>{step.title}</h3>
                            <p>{step.text}</p>
                        </li>
                    ))}
                </ol>
            </section>

            <article className={styles.body}>
                {SECTIONS.map((s) => (
                    <section key={s.num} className={`${styles.numberedSection} ${styles.fadeIn}`}>
                        <div className={styles.sectionHead}>
                            <span className={styles.sectionNum}>{s.num}</span>
                            <h2 className={styles.sectionTitle}>{s.title}</h2>
                        </div>
                        <div className={styles.sectionBody}>{s.body}</div>
                    </section>
                ))}

                <section className={`${styles.numberedSection} ${styles.fadeIn}`}>
                    <div className={styles.sectionHead}>
                        <span className={styles.sectionNum}>03</span>
                        <h2 className={styles.sectionTitle}>初めてでも参加できる理由</h2>
                    </div>
                    <div className={styles.sectionBody}>
                        <div className={styles.callout}>
                            <span className={styles.calloutIcon} aria-hidden="true">☼</span>
                            <div className={styles.calloutBody}>
                                <p className={styles.calloutTitle}>手首の<strong>黄色いゴムバンド</strong>が目印です</p>
                                <p className={styles.calloutSub}>集合場所では、それを目印に合流してください。</p>
                            </div>
                        </div>
                        <ul className={styles.list}>
                            <li>初心者歓迎 — 毎回、参加者の約3割はほぼ初めてのランニングです</li>
                            <li>参加費無料・予約不要 — 集合場所へ来るだけで参加できます</li>
                            <li>ペース・距離は自由 — 歩いても途中離脱・途中参加も問題なし</li>
                            <li>雨天は基本中止 — 開催可否は当日の <a href="https://www.instagram.com/hinode_run/" className={styles.link} target="_blank" rel="noopener noreferrer">Instagram</a> / <a href="https://strava.app.link/pQ0uMuWWj2b" className={styles.link} target="_blank" rel="noopener noreferrer">Strava</a> で確認できます</li>
                        </ul>
                    </div>
                </section>

                <section id="faq" className={`${styles.numberedSection} ${styles.fadeIn}`}>
                    <div className={styles.sectionHead}>
                        <span className={styles.sectionNum}>04</span>
                        <h2 className={styles.sectionTitle}>よくある質問</h2>
                    </div>
                    <div className={styles.sectionBody}>
                        <dl className={styles.faqList}>
                            {FAQ.map((item, i) => (
                                <div key={i} className={styles.faqItem}>
                                    <dt className={styles.faqQuestion}>
                                        <span className={styles.faqQMark} aria-hidden="true">Q.</span>
                                        {item.q}
                                    </dt>
                                    <dd className={styles.faqAnswer}>{item.a}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </section>

                <section className={`${styles.numberedSection} ${styles.fadeIn}`}>
                    <div className={styles.sectionHead}>
                        <span className={styles.sectionNum}>05</span>
                        <h2 className={styles.sectionTitle}>開催と最新情報</h2>
                    </div>
                    <div className={styles.sectionBody}>
                        <p className={styles.text}>皇居・目黒川・代々木公園で週3回（水・木・日曜）開催。<a href="/schedule" className={styles.link}>開催日程と参加方法を見る →</a></p>
                        <p className={styles.text}>開催可否やその他の案内は <a href="https://www.instagram.com/hinode_run/" className={styles.link} target="_blank" rel="noopener noreferrer">Instagram</a> と <a href="https://strava.app.link/pQ0uMuWWj2b" className={styles.link} target="_blank" rel="noopener noreferrer">Strava</a> で告知しています。</p>
                    </div>
                </section>
            </article>

            <PostBottomStrip />
        </div>
    );
}
