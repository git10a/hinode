'use client';

import { useEffect, useState } from 'react';
import useFadeInOnScroll from '../lib/useFadeInOnScroll';
import { getRunCount, MEMBER_COUNT } from '../lib/stats';
import styles from '../app/press/press.module.css';

const MEDIA_HOOKS = [
    {
        title: '① 会話を前提としないサードプレイス',
        body: '職場でも家でもない第三の場所を、飲食や交流ではなく「4kmを黙って走る」で設計している事例。会話強制ゼロの都市型サードプレイスという切り口。'
    },
    {
        title: '② 非競争型ランニングコミュニティの台頭',
        body: '速さ・距離をSNSで誇るランナー像とは逆方向の潮流。数字で比べない走り方を選ぶ層が、20〜30代都市部に一定数存在することの可視化。'
    },
    {
        title: '③ 「静かな退職」世代の自己投資',
        body: '仕事の成果最大化から距離を置く世代が、朝という「誰にも要求されていない時間」に健康と規律を積む、という選択の形。'
    },
    {
        title: '④ 孤独のインフラ化',
        body: '一人参加歓迎、会話不要、黄色いゴムバンドの誰かが必ずいる。孤立は避けたいが社交は要らない、という層に向けた最低限の接点設計。'
    },
    {
        title: '⑤ Z世代のウェルビーイングと朝時間',
        body: '夜の飲み会ではなく朝のランで生活を組み立てる20代のライフスタイル。HINODE参加者の中心層がこの価値観と重なる。'
    },
    {
        title: '⑥ AGI時代への「身体性」ヘッジ',
        body: 'ホワイトカラー労働の自動化が現実味を帯びる中、知的作業から意識的に距離を取り、早朝に肉体を動かす選択をする個人が現れている。HINODE主宰の発起動機にも「AGI時代を見据えた基礎体力づくり」「動物性を取り戻す」という問題意識が含まれる。'
    }
];

const TIMELINE = [
    { date: '2025年7月21日', event: 'ロードバイク購入。夕方に10km漕ぐ程度の運動習慣からスタート' },
    { date: '2025年8月24日', event: '朝5時発で自転車スカイツリー往復。初の「早朝運動」体験' },
    { date: '2025年9月1日', event: 'ランニングシューズ購入、翌朝から皇居ランを開始' },
    { date: '2025年11月', event: '日の出ランの素晴らしさを共有したいという動機でHINODE発足' },
    { date: '2026年2月', event: '人生初のハーフマラソン完走' },
    { date: '2026年3月', event: '人生初のフルマラソン完走' },
];

const FAQ = [
    {
        q: 'なぜ顔出しをしないのか',
        a: 'HINODEは「誰が主宰か」「誰が参加しているか」よりも「何を続けているか」を優先しています。顔を出さないことで、特定の個人のブランディングではなく、習慣としてのランニングそのものに焦点を置くためです。'
    },
    {
        q: 'なぜ参加費を無料にしているのか',
        a: '金銭が発生すると関係が「取引」になります。HINODEが扱いたいのは取引ではなく「自分との約束」です。無料にすることで、参加する理由を外部の対価ではなく参加者自身に置いています。'
    },
    {
        q: '初心者でも参加できるか',
        a: '毎回、参加者の約3割がほぼ初めてのランニングです。歩いても、途中離脱しても、途中参加しても問題ありません。'
    },
    {
        q: 'なぜ朝にこだわるのか',
        a: '朝は誰からも要求されていない時間であり、走ることが「自分のための選択」以外になり得ない時間帯だからです。'
    },
    {
        q: '競技志向のランナーは参加できるか',
        a: '参加自体は自由です。ただしHINODEはランキング・コーチング・練習メニューを提供しません。速くなるための場所ではなく、続けるための場所です。'
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
                <p className={`${styles.kicker} ${styles.fadeIn}`}>Press Kit</p>
                <h1 className={`${styles.title} ${styles.fadeIn}`}>
                    HINODE プレスキット
                </h1>
                <p className={`${styles.meta} ${styles.fadeIn}`}>
                    メディア・記者・編集者の方へ
                </p>

                <div className={`${styles.lead} ${styles.fadeIn}`}>
                    HINODEは、日の出前に集まり日の出とともに走る、東京の朝ランコミュニティ。週3回、皇居・目黒川・代々木公園で無料開催。予約不要、手首の黄色いゴムバンドが目印。「競争しない」「自分との約束を守り続ける」ことを中心に据えた、非競争型ランニングコミュニティ。
                </div>

                {/* 1. 基本情報 */}
                <div className={styles.fadeIn}>
                    <p className={styles.sectionNum}>01</p>
                    <h2 className={styles.sectionTitle}>基本情報</h2>
                    <table className={styles.table}>
                        <tbody>
                            <tr><th>設立</th><td>2025年11月</td></tr>
                            <tr><th>運営体制</th><td>個人運営(主宰: HINODE主宰)</td></tr>
                            <tr><th>参加費</th><td>無料</td></tr>
                            <tr><th>参加方法</th><td>予約不要。集合時間の5分前に集合場所へ来るだけ</td></tr>
                            <tr><th>目印</th><td>手首の黄色いゴムバンド</td></tr>
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
                            <tr><td>水</td><td>6:30〜</td><td>皇居</td><td>桔梗門前派出所</td><td>約5km</td></tr>
                            <tr><td>木</td><td>6:30〜</td><td>目黒川</td><td>中目黒駅 スターバックス蔦屋書店前</td><td>約4km</td></tr>
                            <tr><td>日</td><td>7:30〜</td><td>代々木公園</td><td>原宿時計塔</td><td>約3〜6km</td></tr>
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
                        <li>初参加比率: 毎回の参加者の約3割がほぼ初めてのランニング</li>
                    </ul>
                </div>

                {/* 2. 3つの特徴 */}
                <div className={styles.fadeIn}>
                    <p className={styles.sectionNum}>02</p>
                    <h2 className={styles.sectionTitle}>HINODEを定義する3つの特徴</h2>

                    <h3 className={styles.subTitle}>競争しない</h3>
                    <p className={styles.body}>順位・ペース・距離で他者と比べない。ランキングもコーチングも練習メニューもない。</p>

                    <h3 className={styles.subTitle}>朝にこだわる</h3>
                    <p className={styles.body}>日の出の時刻を基準に集合時間を固定。太陽は待ってくれないので、参加者のほうが時間に合わせる。</p>

                    <h3 className={styles.subTitle}>自己との約束を守る</h3>
                    <p className={styles.body}>「今日走ったかどうか」だけを問う。他人との勝ち負けではなく、昨日の自分との約束の履行を中心に据える。</p>
                </div>

                {/* 3. メディアフック */}
                <div className={styles.fadeIn}>
                    <p className={styles.sectionNum}>03</p>
                    <h2 className={styles.sectionTitle}>メディアフック(取材の切り口)</h2>
                    {MEDIA_HOOKS.map(h => (
                        <div key={h.title} className={styles.hook}>
                            <p className={styles.hookTitle}>{h.title}</p>
                            <p className={styles.hookBody}>{h.body}</p>
                        </div>
                    ))}
                </div>

                {/* 4. 代表者プロフィール */}
                <div className={styles.fadeIn}>
                    <p className={styles.sectionNum}>04</p>
                    <h2 className={styles.sectionTitle}>代表者プロフィール</h2>

                    <h3 className={styles.subTitle}>HINODE 主宰</h3>
                    <ul className={styles.list}>
                        <li>20代、東京都在住、IT関連勤務</li>
                        <li>X(旧Twitter): <a className={styles.link} href="https://x.com/t_10_a" target="_blank" rel="noopener noreferrer">@t_10_a</a></li>
                    </ul>

                    <h3 className={styles.subTitle}>運動開始までの経緯</h3>
                    <p className={styles.body}>
                        HINODE発足前、私は運動歴ゼロ。デスクワークと会議と夜の飲み会が中心の生活を送っていた。直接のきっかけは会社の健康診断で有酸素運動不足によるC判定が出たこと。加えて、以下の複合的な動機があった。
                    </p>
                    <ul className={styles.list}>
                        <li><strong>動物性の回復</strong>:「パソコン作業者である前に『動物』であり、原始的行為である運動によって動物性を取り戻したい」</li>
                        <li><strong>AGI時代のヘッジ</strong>: ホワイトカラー労働がロボットに代替されるまでの基礎体力づくり</li>
                        <li><strong>1日の能動的開始</strong>: 自分の意志で1日を始めることによる自己肯定感の確保</li>
                    </ul>

                    <h3 className={styles.subTitle}>タイムライン</h3>
                    <table className={styles.table}>
                        <tbody>
                            {TIMELINE.map(t => (
                                <tr key={t.date}><th>{t.date}</th><td>{t.event}</td></tr>
                            ))}
                        </tbody>
                    </table>
                    <p className={styles.body}>運動開始から約2ヶ月で6kg減。開始1ヶ月で10km以上ノンストップで走れるようになった。</p>

                    <h3 className={styles.subTitle}>日の出ランを選ぶ合理的理由(本人の実感)</h3>
                    <ul className={styles.list}>
                        <li>糖質が枯渇している状態から走るため脂質代謝が早く進む(2ヶ月で6kg減)</li>
                        <li>セロトニン・エンドルフィンが1日の始まりに分泌され、日中の生産性に接続する</li>
                        <li>体が適度に疲労するため夜の入眠が早まり、睡眠の質・時間ともに改善</li>
                        <li>朝の時間帯は予定が入らないため、習慣として最も保護しやすい</li>
                        <li>人が少なく、マイペースで走れる</li>
                    </ul>

                    <h3 className={styles.subTitle}>HINODE発足の動機(本人発言)</h3>
                    <blockquote className={styles.quote}>
                        この素晴らしさを知ってほしい、という思いのみでHINODEというランニングクラブも作りました。
                    </blockquote>
                    <p className={styles.body}>
                        主宰でありながら「目立ちたい気持ちはゼロ」と公言しており、個人ブランディングではなく「日の出ランという習慣そのもの」の普及が一貫した動機。このスタンスが、顔出しをしない運用方針にも反映されている。
                    </p>
                    <p className={styles.body}>
                        原体験の全文: <a className={styles.link} href="https://x.com/t_10_a/status/1992564539448238478" target="_blank" rel="noopener noreferrer">https://x.com/t_10_a/status/1992564539448238478</a>
                    </p>
                    <p className={styles.body}>
                        取材時は顔出しNG、後ろ姿・シルエット・匿名表記・音声のみ出演いずれも相談可。
                    </p>
                </div>

                {/* 5. 取材対応 */}
                <div className={styles.fadeIn}>
                    <p className={styles.sectionNum}>05</p>
                    <h2 className={styles.sectionTitle}>取材対応について</h2>
                    <table className={styles.table}>
                        <tbody>
                            <tr><th>窓口(メール)</th><td>hinode.infomation@gmail.com</td></tr>
                            <tr><th>窓口(SNS)</th><td>Instagram DM <a className={styles.link} href="https://www.instagram.com/hinode_run/" target="_blank" rel="noopener noreferrer">@hinode_run</a></td></tr>
                            <tr><th>対応可能時間</th><td>随時(早朝含む)</td></tr>
                            <tr><th>ラン帯同取材</th><td>歓迎。事前にご連絡いただき、開催地の集合場所までお越しください</td></tr>
                            <tr><th>顔出し</th><td><strong>NG</strong>(代表・参加者ともに)</td></tr>
                            <tr><th>後ろ姿・シルエット・足元</th><td><strong>OK</strong></td></tr>
                            <tr><th>音声のみ出演・匿名インタビュー</th><td>相談可</td></tr>
                        </tbody>
                    </table>
                </div>

                {/* 6. 利用可能な素材 */}
                <div className={styles.fadeIn}>
                    <p className={styles.sectionNum}>06</p>
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

                {/* 7. 過去の掲載実績 */}
                <div className={styles.fadeIn}>
                    <p className={styles.sectionNum}>07</p>
                    <h2 className={styles.sectionTitle}>過去の掲載実績</h2>
                    <p className={styles.body}>現時点でメディア掲載実績はありません。取材一号枠を歓迎します。</p>
                </div>

                {/* 8. FAQ */}
                <div className={styles.fadeIn}>
                    <p className={styles.sectionNum}>08</p>
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
                    <h3>取材・メディアのお問い合わせ</h3>
                    <p>Email: <a href="mailto:hinode.infomation@gmail.com">hinode.infomation@gmail.com</a></p>
                    <p>Instagram DM: <a href="https://www.instagram.com/hinode_run/" target="_blank" rel="noopener noreferrer">@hinode_run</a></p>
                    <p>早朝取材・ラン帯同歓迎</p>
                </div>
            </div>
        </section>
    );
}
