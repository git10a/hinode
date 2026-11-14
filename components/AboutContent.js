'use client';

import Image from 'next/image';
import Link from '@/components/SiteLink';
import PostBottomStrip from '@/components/PostBottomStrip';
import { ABOUT_FAQ } from '@/lib/aboutFaq';
import { INSTAGRAM_URL, RUNNERS_SALON_URL, STRAVA_APP_LINK, STRAVA_CLUB_URL } from '@/lib/site';
import { COMMUNITY_STATS } from '@/lib/stats';
import useFadeInOnScroll from '@/lib/useFadeInOnScroll';
import styles from '@/app/about/about.module.css';

const SECTIONS = [
    {
        num: '01',
        title: 'HINODEはどんなコミュニティか',
        body: (
            <>
                <p className={styles.text}>皇居・目黒川・代々木公園・駒沢公園でのグループランが活動の中心です。ペースも距離も自由で、苦しくなったら歩いても問題ありません。速さではなく、走り続ける規律そのものを大事にしています。</p>
                <p className={styles.text}>競技経験や走力を問わず、朝ランを続けたい人が参加できるコミュニティです。{COMMUNITY_STATS.ageRange}まで、幅広い方が参加しています。</p>
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

const FIRST_JOIN_STEPS = [
    {
        title: '日程を見る',
        text: '皇居・目黒川・代々木公園・駒沢公園の開催日と集合場所を確認します。',
    },
    {
        title: '集合場所へ行く',
        text: 'Stravaでの参加表明は任意です。開始数分前に、走れる服装で来てください。',
    },
    {
        title: '目印を探す',
        text: '背中に「HINODE」と書かれた黒いTシャツを着た運営メンバーを探してください。',
    },
    {
        title: '無理なく走る',
        text: 'ペースも距離も自由です。歩いても途中離脱しても大丈夫です。',
    },
];

// リンクを含む回答（文字列と { text, href } の配列）をそのまま描画する
function FaqAnswer({ answer }) {
    if (typeof answer === 'string') return answer;
    return answer.map((part, index) => (
        typeof part === 'string'
            ? part
            : <a key={index} href={part.href} className={styles.link} target="_blank" rel="noopener noreferrer">{part.text}</a>
    ));
}

export default function AboutContent() {
    useFadeInOnScroll({
        selector: `.${styles.fadeIn}`,
        visibleClass: styles.visible
    });

    return (
        <div className={styles.page}>
            <div className={`${styles.hero} ${styles.fadeIn}`}>
                <p className="editorial-eyebrow">ABOUT HINODE</p>
                <h1 className={styles.title}>
                    日の出とともに、<br />
                    競争しない朝をつづける
                </h1>
                <p className={styles.lead}>
                    HINODEは、日の出前後の朝に集まり、会話できるペースで走るコミュニティです。東京で活動し、参加無料・予約不要。速さや経験を問わず、1人でも来やすい場を目指しています。
                </p>
                <p className={styles.mediaMention}>
                    <a
                        href={RUNNERS_SALON_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        BSテレ東「ランナーズサロン」で紹介されました <span aria-hidden="true">↗</span>
                    </a>
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
                    src="/assets/about-hero-yokohama-sunrise.jpg"
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
                            <li>初参加歓迎 — 毎回、参加者の{COMMUNITY_STATS.firstOrSoloRatio}が初参加・ソロ参加です</li>
                            <li>参加費無料・予約不要 — Stravaでの参加表明は任意です</li>
                            <li>ペース・距離は自由 — 歩いても途中離脱・途中参加も問題なし</li>
                            <li>走ること自体にフォーカス — 通常開催では運営による参加者の撮影なし</li>
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
                            {ABOUT_FAQ.map((item) => (
                                <div key={item.question} className={styles.faqItem}>
                                    <dt className={styles.faqQuestion}>
                                        <span className={styles.faqQMark} aria-hidden="true">Q.</span>
                                        {item.question}
                                    </dt>
                                    <dd className={styles.faqAnswer}><FaqAnswer answer={item.answer} /></dd>
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
                                <p>皇居・目黒川・代々木公園・駒沢公園で週3日（水・木・日曜）開催。</p>
                                <Link href="/schedule" className={styles.infoLink}>
                                    開催日程と参加方法を見る <span aria-hidden="true">→</span>
                                </Link>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>最新情報</span>
                                <p>開催可否や当日の案内は Instagram と Strava で告知しています。</p>
                                <div className={styles.infoLinks}>
                                    <a href={INSTAGRAM_URL} className={styles.infoLink} target="_blank" rel="noopener noreferrer">Instagram</a>
                                    <a href={STRAVA_APP_LINK} className={styles.infoLink} target="_blank" rel="noopener noreferrer">Strava</a>
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
