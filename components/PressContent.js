'use client';

import Link from '@/components/SiteLink';
import { useEffect, useState } from 'react';
import useFadeInOnScroll from '../lib/useFadeInOnScroll';
import { getRunCount, MEMBER_COUNT } from '../lib/stats';
import styles from '../app/press/press.module.css';

const FAQ = [
    {
        q: 'なぜ普段の活動では顔出しをしないのか',
        a: 'HINODEは「誰が主宰か」「誰が参加しているか」よりも「何を続けているか」を優先しています。そのため普段のSNSでは、参加者の顔出しを前提にしていません。取材時の撮影・出演については、内容に応じて個別に相談できます。'
    },
    {
        q: '初心者でも参加できるか',
        a: '毎回、参加者の4割前後が初参加・ソロ参加です。歩いても、途中離脱しても、途中参加しても問題ありません。'
    },
    {
        q: 'なぜ朝にこだわるのか',
        a: '朝は誰からも要求されていない時間であり、走ることが「自分のための選択」以外になり得ない時間帯だからです。'
    }
];

// 運営の沿革（個人名・顔は出さず、活動の履歴として記載）
const TIMELINE = [
    {
        date: '2025年11月',
        text: 'HINODE始動。皇居・代々木公園を中心に、日の出の時刻に合わせた朝ランを、雨天を除き毎週開催しはじめる。'
    },
    {
        date: '2026年3月',
        text: '木曜の目黒川ランを定期開催に追加。皇居・目黒川・代々木公園の週3回体制に。'
    },
    {
        date: '2026年',
        text: 'HINODE KYOTO(京都)が始動。Runtrip BASE(代々木)と提携し、参加者向けのタオル特典を開始。'
    }
];

// ダウンロード可能な写真素材（クレジット表記: Photo: HINODE）
const PRESS_PHOTOS = [
    { src: '/assets/about-hero-yokohama-sunrise.jpg', download: 'hinode-sunrise.jpg', label: '横浜の日の出', size: '2000×902' },
    { src: '/assets/Kokyo.jpg', download: 'hinode-kokyo.jpg', label: '皇居', size: '1296×1728' },
    { src: '/assets/Meguro.jpg', download: 'hinode-meguro.jpg', label: '目黒川', size: '1298×1730' },
    { src: '/assets/Yoyogi.jpg', download: 'hinode-yoyogi.jpg', label: '代々木公園', size: '1672×941' },
    { src: '/assets/hinodet.jpeg', download: 'hinode-tshirt.jpg', label: '目印の黒いTシャツ(背中)', size: '1448×1086' }
];

// ダウンロード可能なロゴ（クレジット表記: Logo: HINODE）
const PRESS_LOGOS = [
    { src: '/assets/logo-black.png', download: 'hinode-logo-black.png', label: '黒ロゴ(明るい背景用)' },
    { src: '/assets/logo-white.png', download: 'hinode-logo-white.png', label: '白ロゴ(暗い背景用)', dark: true }
];

export default function PressContent({ memberCount = null }) {
    const [runCount, setRunCount] = useState(null);
    const displayedMemberCount = memberCount ?? MEMBER_COUNT;

    useEffect(() => {
        setRunCount(getRunCount());
    }, []);

    useFadeInOnScroll({
        selector: `.${styles.fadeIn}`,
        visibleClass: styles.visible
    });

    return (
        <section className={styles.pressPage}>
            <div className={styles.container}>
                <h1 className={`${styles.title} ${styles.fadeIn}`}>
                    HINODE プレスキット
                </h1>
                <p className={`${styles.meta} ${styles.fadeIn}`}>
                    メディア・記者・編集者の方へ
                </p>

                <div className={`${styles.lead} ${styles.fadeIn}`}>
                    HINODEは、日の出前に集まり日の出とともに走る、東京の朝ランコミュニティ。週3回、皇居・目黒川・代々木公園で予約不要・参加無料で開催しています。背中に「HINODE」と書かれた黒いTシャツが目印です。速さや経験を問わず、「人と競争するのではなく、自分との約束を守り続ける」ことを中心に据えたランニングコミュニティです。
                </div>

                {/* 取材サマリー */}
                <div className={`${styles.atGlance} ${styles.fadeIn}`}>
                    <p className={styles.atGlanceTitle}>取材をご検討中の方へ</p>
                    <ul className={styles.atGlanceList}>
                        <li><strong>ラン帯同取材 歓迎</strong><span>週3回開催(水・木・日)。早朝の撮影・同行に対応できます</span></li>
                        <li><strong>写真・ロゴ 即日使用可</strong><span>このページから直接ダウンロードできます</span></li>
                        <li><strong>連絡窓口</strong><span><Link className={styles.link} href="/work-contact">取材のご相談フォーム</Link>で随時受付(早朝含む)</span></li>
                    </ul>
                </div>

                {/* 1. 基本情報 */}
                <div className={styles.fadeIn}>
                    <p className={styles.sectionNum}>01</p>
                    <h2 className={styles.sectionTitle}>基本情報</h2>
                    <table className={styles.table}>
                        <tbody>
                            <tr><th>設立</th><td>2025年11月</td></tr>
                            <tr><th>参加費</th><td>無料</td></tr>
                            <tr><th>参加方法</th><td>予約不要。集合時間の5分前に集合場所へ来るだけ</td></tr>
                            <tr><th>目印</th><td>背中に「HINODE」と書かれた黒いTシャツ</td></tr>
                            <tr><th>姉妹コミュニティ</th><td>HINODE KYOTO(京都)</td></tr>
                        </tbody>
                    </table>

                    <h3 className={styles.subTitle}>開催スケジュール</h3>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>曜日</th>
                                <th>時間</th>
                                <th>場所</th>
                                <th>集合地点</th>
                                <th>距離</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>水</td><td>6:00〜</td><td>皇居</td><td>桔梗門前派出所</td><td>約5km</td></tr>
                            <tr><td>木</td><td>6:00〜</td><td>目黒川</td><td>中目黒駅 スターバックス蔦屋書店前</td><td>約4km</td></tr>
                            <tr><td>日</td><td>7:15〜</td><td>代々木公園</td><td>原宿時計塔</td><td>約2〜4km</td></tr>
                        </tbody>
                    </table>
                    <p className={styles.body}>
                        雨天のみ中止。開催可否は当日Instagram / Stravaで告知。
                        集合は開始5分前です。時間通りに出発します。
                    </p>

                    <h3 className={styles.subTitle}>規模感(本日時点)</h3>
                    <ul className={styles.list}>
                        <li>Stravaクラブメンバー: <strong>{displayedMemberCount}名</strong></li>
                        <li>グループラン累計開催回数: <strong>{runCount !== null ? `${runCount}回` : '---'}</strong></li>
                        <li>累計延べ参加人数: <strong>約800名</strong>(2026年7月時点・概数)</li>
                        <li>平均参加人数: 平日5名前後 / 日曜15名前後</li>
                        <li>参加者層: 中学生から60代まで。学生・会社員・経営者、海外の方など多様</li>
                        <li>初参加・ソロ参加比率: 毎回4割前後</li>
                    </ul>
                </div>

                {/* 2. 3つの特徴 */}
                <div className={styles.fadeIn}>
                    <p className={styles.sectionNum}>02</p>
                    <h2 className={styles.sectionTitle}>HINODEを定義する3つの特徴</h2>

                    <h3 className={styles.subTitle}>競争しない</h3>
                    <p className={styles.body}>速さや経験を参加条件にせず、誰でも走りやすいゆったりしたペースで、長くない距離を走る。</p>

                    <h3 className={styles.subTitle}>朝にこだわる</h3>
                    <p className={styles.body}>誰にも何にも邪魔されることのない早朝にこそ、走ることを選ぶ。</p>

                    <h3 className={styles.subTitle}>自分との約束を守る場所</h3>
                    <p className={styles.body}>他人との勝ち負けではなく、走ると決めた自分との約束を守り続けるための場所。</p>
                </div>

                {/* 3. 運営・沿革 */}
                <div className={styles.fadeIn}>
                    <p className={styles.sectionNum}>03</p>
                    <h2 className={styles.sectionTitle}>運営・沿革</h2>
                    <p className={styles.body}>
                        HINODEは、特定の主宰者を前面に出さず、「誰がやっているか」よりも「何を続けているか」を大切にする方針で運営しています。普段のSNSでは参加者の顔出しを前提とせず、個人のブランディングではなく、朝に走るという習慣そのものに焦点を置いています。取材時の撮影・出演については、内容に応じて個別に相談できます。日々の開催・告知・運営は有志のメンバーが担っています。
                    </p>
                    <ol className={styles.timeline}>
                        {TIMELINE.map(item => (
                            <li key={item.date} className={styles.timelineItem}>
                                <span className={styles.timelineDate}>{item.date}</span>
                                <p className={styles.timelineText}>{item.text}</p>
                            </li>
                        ))}
                    </ol>
                    <p className={styles.body}>
                        現在の規模感(Stravaクラブ {displayedMemberCount}名、累計延べ参加人数 約800名)は、上記「基本情報」に記載のとおりです。
                    </p>
                </div>

                {/* 4. 取材対応 */}
                <div className={styles.fadeIn}>
                    <p className={styles.sectionNum}>04</p>
                    <h2 className={styles.sectionTitle}>取材対応について</h2>
                    <table className={styles.table}>
                        <tbody>
                            <tr><th>窓口</th><td><Link className={styles.link} href="/work-contact">お仕事・取材のご相談フォーム</Link></td></tr>
                            <tr><th>対応可能時間</th><td>随時(早朝含む)</td></tr>
                            <tr><th>ラン帯同取材</th><td>歓迎。事前にご連絡いただき、開催地の集合場所までお越しください</td></tr>
                            <tr><th>顔出し・撮影</th><td>取材内容に応じて相談可。参加者の撮影は本人の同意を前提に個別に調整します</td></tr>
                            <tr><th>後ろ姿・シルエット・足元</th><td>撮影可</td></tr>
                            <tr><th>音声のみ出演・匿名インタビュー</th><td>相談可</td></tr>
                        </tbody>
                    </table>
                </div>

                {/* 5. 利用可能な素材 */}
                <div className={styles.fadeIn}>
                    <p className={styles.sectionNum}>05</p>
                    <h2 className={styles.sectionTitle}>利用可能な素材</h2>
                    <p className={styles.body}>
                        以下の写真・ロゴは、そのままダウンロードして掲載にご利用いただけます。画像をクリックすると保存できます。人物は後ろ姿・シルエット・足元のみで、顔が特定できる写真は含まれていません。
                    </p>

                    <h3 className={styles.subTitle}>写真</h3>
                    <p className={styles.body}>クレジット表記: <code>Photo: HINODE</code></p>
                    <div className={styles.assetGrid}>
                        {PRESS_PHOTOS.map(photo => (
                            <a
                                key={photo.src}
                                className={styles.assetCard}
                                href={photo.src}
                                download={photo.download}
                            >
                                <span className={styles.assetThumb}>
                                    {/* 原本をそのまま配布するため next/image ではなく素の img を使用 */}
                                    <img src={photo.src} alt={photo.label} loading="lazy" />
                                </span>
                                <span className={styles.assetMeta}>
                                    <span className={styles.assetLabel}>{photo.label}</span>
                                    <span className={styles.assetSub}>JPG・{photo.size} <span className={styles.assetDownload}>↓ ダウンロード</span></span>
                                </span>
                            </a>
                        ))}
                    </div>

                    <h3 className={styles.subTitle}>ロゴ</h3>
                    <p className={styles.body}>クレジット表記: <code>Logo: HINODE</code></p>
                    <div className={styles.assetGrid}>
                        {PRESS_LOGOS.map(logo => (
                            <a
                                key={logo.src}
                                className={styles.assetCard}
                                href={logo.src}
                                download={logo.download}
                            >
                                <span className={`${styles.assetThumb} ${styles.assetThumbLogo} ${logo.dark ? styles.assetThumbDark : ''}`}>
                                    <img src={logo.src} alt={logo.label} loading="lazy" />
                                </span>
                                <span className={styles.assetMeta}>
                                    <span className={styles.assetLabel}>{logo.label}</span>
                                    <span className={styles.assetSub}>PNG <span className={styles.assetDownload}>↓ ダウンロード</span></span>
                                </span>
                            </a>
                        ))}
                    </div>

                    <h3 className={styles.subTitle}>プレスキット(テキスト版)</h3>
                    <p className={styles.body}>
                        基本情報・規模感・取材対応方針・素材一覧をまとめた資料です。
                        <a className={styles.link} href="/hinode-press-kit.md" download="hinode-press-kit.md">プレスキットをダウンロード(.md)</a>
                    </p>

                    <h3 className={styles.subTitle}>引用可能なテキスト</h3>
                    <ul className={styles.list}>
                        <li><a className={styles.link} href="/manifesto">マニフェスト</a></li>
                        <li><a className={styles.link} href="/blog">公式ブログ</a></li>
                        <li>HP掲載のコピー・FAQはすべて引用可</li>
                    </ul>
                </div>

                {/* 6. 過去の掲載実績 */}
                <div className={styles.fadeIn}>
                    <p className={styles.sectionNum}>06</p>
                    <h2 className={styles.sectionTitle}>過去の掲載実績</h2>
                    <p className={styles.body}>現時点でメディア掲載実績はありません。取材一号枠を歓迎します。</p>
                </div>

                {/* 7. FAQ */}
                <div className={styles.fadeIn}>
                    <p className={styles.sectionNum}>07</p>
                    <h2 className={styles.sectionTitle}>よくある質問</h2>
                    {FAQ.map(item => (
                        <div key={item.q} className={styles.faqItem}>
                            <p className={styles.faqQ}>Q. {item.q}</p>
                            <p className={styles.faqA}>A. {item.a}</p>
                        </div>
                    ))}
                </div>

                {/* Contact block */}
                <div className={`${styles.contactBlock} ${styles.fadeIn}`}>
                    <h3>お仕事・取材のご相談</h3>
                    <p><Link href="/work-contact">専用フォームからご連絡ください</Link></p>
                    <p>早朝取材・ラン帯同歓迎</p>
                </div>
            </div>
        </section>
    );
}
