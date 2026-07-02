'use client';

import Link from '@/components/SiteLink';
import { useEffect, useState } from 'react';
import useFadeInOnScroll from '../lib/useFadeInOnScroll';
import { getRunCount, MEMBER_COUNT } from '../lib/stats';
import styles from '../app/press/press.module.css';

const FAQ = [
    {
        q: 'なぜ顔出しをしないのか',
        a: 'HINODEは「誰が主宰か」「誰が参加しているか」よりも「何を続けているか」を優先しています。顔を出さないことで、特定の個人のブランディングではなく、習慣としてのランニングそのものに焦点を置くためです。'
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

export default function PressContent() {
    const [runCount, setRunCount] = useState(null);

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
                    HINODEは、日の出前に集まり日の出とともに走る、東京の朝ランコミュニティ。週3回、皇居・目黒川・代々木公園で無料開催。予約不要、背中に「HINODE」と書かれた黒いTシャツが目印。「競争しない」「自分との約束を守り続ける」ことを中心に据えた、非競争型ランニングコミュニティ。
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
                            <tr><td>日</td><td>7:15〜</td><td>代々木公園</td><td>原宿時計塔</td><td>約3〜6km</td></tr>
                        </tbody>
                    </table>
                    <p className={styles.body}>雨天のみ中止。開催可否は当日Instagram / Stravaで告知。</p>

                    <h3 className={styles.subTitle}>規模感(本日時点)</h3>
                    <ul className={styles.list}>
                        <li>Stravaクラブメンバー: <strong>{MEMBER_COUNT}名</strong></li>
                        <li>グループラン累計開催回数: <strong>{runCount !== null ? `${runCount}回` : '---'}</strong></li>
                        <li>累計延べ参加人数: <strong>約350名</strong>(2026年4月時点・概数)</li>
                        <li>平均参加人数: 平日4名前後 / 日曜10名弱</li>
                        <li>参加者層: 中学生から50代まで。学生・会社員・経営者など職業は多様</li>
                        <li>初参加・ソロ参加比率: 毎回4割前後</li>
                    </ul>
                </div>

                {/* 2. 3つの特徴 */}
                <div className={styles.fadeIn}>
                    <p className={styles.sectionNum}>02</p>
                    <h2 className={styles.sectionTitle}>HINODEを定義する3つの特徴</h2>

                    <h3 className={styles.subTitle}>競争しない</h3>
                    <p className={styles.body}>速さや経験を参加条件にせず、それぞれのペースで走る。</p>

                    <h3 className={styles.subTitle}>朝にこだわる</h3>
                    <p className={styles.body}>日の出の時刻を基準に集合時間を固定。太陽は待ってくれないので、参加者のほうが時間に合わせる。</p>

                    <h3 className={styles.subTitle}>自己との約束を守る</h3>
                    <p className={styles.body}>「今日走ったかどうか」だけを問う。他人との勝ち負けではなく、昨日の自分との約束の履行を中心に据える。</p>
                </div>

                {/* 3. 取材対応 */}
                <div className={styles.fadeIn}>
                    <p className={styles.sectionNum}>03</p>
                    <h2 className={styles.sectionTitle}>取材対応について</h2>
                    <table className={styles.table}>
                        <tbody>
                            <tr><th>窓口</th><td><Link className={styles.link} href="/work-contact">お仕事・取材のご相談フォーム</Link></td></tr>
                            <tr><th>対応可能時間</th><td>随時(早朝含む)</td></tr>
                            <tr><th>ラン帯同取材</th><td>歓迎。事前にご連絡いただき、開催地の集合場所までお越しください</td></tr>
                            <tr><th>顔出し</th><td><strong>NG</strong>(代表・参加者ともに)</td></tr>
                            <tr><th>後ろ姿・シルエット・足元</th><td><strong>OK</strong></td></tr>
                            <tr><th>音声のみ出演・匿名インタビュー</th><td>相談可</td></tr>
                        </tbody>
                    </table>
                </div>

                {/* 4. 利用可能な素材 */}
                <div className={styles.fadeIn}>
                    <p className={styles.sectionNum}>04</p>
                    <h2 className={styles.sectionTitle}>利用可能な素材</h2>

                    <h3 className={styles.subTitle}>写真</h3>
                    <p className={styles.body}>
                        風景(日の出 / 皇居・目黒川・代々木公園)、足元、ランナーの後ろ姿など。
                    </p>
                    <ul className={styles.list}>
                        <li>クレジット表記: <code>Photo: HINODE</code></li>
                        <li>提供希望の場合は取材窓口までご連絡ください</li>
                    </ul>

                    <h3 className={styles.subTitle}>ロゴ</h3>
                    <p className={styles.body}>黒背景用・白背景用の2種(PNG)。配布可。</p>
                    <ul className={styles.list}>
                        <li>クレジット表記: <code>Logo: HINODE</code></li>
                    </ul>

                    <h3 className={styles.subTitle}>引用可能なテキスト</h3>
                    <ul className={styles.list}>
                        <li><a className={styles.link} href="/manifesto">マニフェスト</a></li>
                        <li><a className={styles.link} href="/blog">公式ブログ</a></li>
                        <li>HP掲載のコピー・FAQはすべて引用可</li>
                    </ul>
                </div>

                {/* 5. 過去の掲載実績 */}
                <div className={styles.fadeIn}>
                    <p className={styles.sectionNum}>05</p>
                    <h2 className={styles.sectionTitle}>過去の掲載実績</h2>
                    <p className={styles.body}>現時点でメディア掲載実績はありません。取材一号枠を歓迎します。</p>
                </div>

                {/* 6. FAQ */}
                <div className={styles.fadeIn}>
                    <p className={styles.sectionNum}>06</p>
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
