'use client';

import Image from 'next/image';
import Link from '@/components/SiteLink';
import useFadeInOnScroll from '../lib/useFadeInOnScroll';
import PostBottomStrip from './PostBottomStrip';
import styles from '../app/about/about.module.css';

const SECTIONS = [
    {
        num: '01',
        title: 'HINODEはどんなコミュニティか',
        body: (
            <>
                <p className={styles.text}>皇居・目黒川・代々木公園などでのグループランを基本に、土曜日は不定期の企画ランも開催しています。上野公園や駒沢公園へ行ったり、おいしいパン屋を目指したり、山手線一周ランをしたりする日もあります。ペースも距離も自由で、苦しくなったら歩いても問題ありません。速さではなく、走り続ける規律そのものを大事にしています。</p>
                <p className={styles.text}>競技志向のクラブではありません。ランキングやコーチング、練習メニューはなく、朝ランを継続したい人のためのコミュニティです。中学生から50代まで、老若男女が参加しています。</p>
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

const FIRST_JOIN_STEPS = [
    {
        title: '日程を見る',
        text: '皇居・目黒川・代々木公園の開催日と集合場所を確認します。',
    },
    {
        title: '集合場所へ行く',
        text: 'Stravaで参加表明しておくと安心です。開始数分前に、走れる服装で来てください。',
    },
    {
        title: '目印を探す',
        text: '背中に「HINODE」と書かれた黒いTシャツを着ているメンバーを探してください。',
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
            <>中止の告知がないかぎり、必ず誰かがいます。背中に「HINODE」と書かれた黒いTシャツを着ているメンバーにお声がけください。雨の日など開催できない場合は <a href="https://strava.app.link/pQ0uMuWWj2b" className={styles.link} target="_blank" rel="noopener noreferrer">Strava</a> / <a href="https://www.instagram.com/hinode_run/" className={styles.link} target="_blank" rel="noopener noreferrer">Instagram</a> で前もって告知します。不安なことがあればいつでもご連絡ください。</>
        ),
    },
    {
        q: 'どんな人が参加していますか？',
        a: '25歳から35歳くらいのメンバーが5割ほどいらっしゃいますが、中学生から50代まで老若男女問わず参加しています。',
    },
    {
        q: '開始時間はいつですか？',
        a: '6月1日から、水曜の皇居ランと木曜の目黒川ランは6:00、日曜の代々木公園ランは7:15スタートです。時間通りにスタートしますので、2分前には集合しておいてください。',
    },
    {
        q: '日の出の時間はもっと早くありませんか？',
        a: 'はい、夏場は5時ごろに日の出を迎えます。6月1日からは1か月ほどサマータイムとして、水曜・木曜は6:00、日曜は7:15を試します。日曜は近くのRuntrip BASEが7:00オープンのため、7:15集合です。継続するかは参加状況や気温を見ながら判断します。',
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
            <div className={`${styles.hero} ${styles.fadeIn}`}>
                <h1 className={styles.title}>
                    東京で日の出とともに走る、<br />
                    朝ランコミュニティ
                </h1>
                <p className={styles.lead}>
                    HINODEは、日の出前に集まり、日の出とともに走る東京の朝ランコミュニティです。初心者でももちろん参加でき、参加は無料です。皇居・目黒川・代々木公園を中心に、1人参加でも来やすい場を目指しています。
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
                <div className={styles.guideCta}>
                    <div className={styles.guideCtaText}>
                        <p className={styles.guideCtaLabel}>詳しくは</p>
                        <p>集合場所、持ち物、当日の流れを初参加ガイドにまとめています。</p>
                    </div>
                    <Link href="/first-run" className={styles.guideCtaLink}>
                        初参加ガイドを見る <span aria-hidden="true">→</span>
                    </Link>
                </div>
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
                        <h2 className={styles.sectionTitle}>初めてでも参加しやすい理由</h2>
                    </div>
                    <div className={styles.sectionBody}>
                        <ul className={styles.list}>
                            <li>初参加歓迎 — 毎回、参加者の4割前後が初参加・ソロ参加です</li>
                            <li>参加費無料 — Stravaで参加表明しておくと、当日の人数感が分かって安心です</li>
                            <li>ペース・距離は自由 — 歩いても途中離脱・途中参加も問題なし</li>
                            <li>走ること自体にフォーカス — 写真や動画の撮影は基本なし</li>
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
                        <div className={styles.infoPanel}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>開催場所</span>
                                <p>皇居・目黒川・代々木公園で週3回（水・木・日曜）開催。土曜日は不定期で企画ランもあります。</p>
                                <Link href="/schedule" className={styles.infoLink}>
                                    開催日程と参加方法を見る <span aria-hidden="true">→</span>
                                </Link>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>最新情報</span>
                                <p>開催可否や当日の案内は Instagram と Strava で告知しています。</p>
                                <div className={styles.infoLinks}>
                                    <a href="https://www.instagram.com/hinode_run/" className={styles.infoLink} target="_blank" rel="noopener noreferrer">Instagram</a>
                                    <a href="https://strava.app.link/pQ0uMuWWj2b" className={styles.infoLink} target="_blank" rel="noopener noreferrer">Strava</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </article>

            <PostBottomStrip />
        </div>
    );
}
