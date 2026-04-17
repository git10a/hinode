'use client';

import useFadeInOnScroll from '../lib/useFadeInOnScroll';
import styles from '../app/about/about.module.css';

export default function AboutContent() {
    useFadeInOnScroll({
        selector: `.${styles.fadeIn}`,
        visibleClass: styles.visible
    });

    return (
        <>
            <section className={styles.aboutHero}>
                <div className="container">
                    <h1 className={`${styles.title} ${styles.titleJp} ${styles.fadeIn}`}>
                        HINODEとは｜東京で日の出とともに走る朝ランコミュニティ
                    </h1>
                    <div className={`${styles.introContainer} ${styles.fadeIn}`}>
                        <p className={styles.introText}>
                            HINODEは、日の出前に集まり、日の出とともに走る東京の朝ランコミュニティです。初心者でも参加でき、参加費無料、予約不要。皇居・目黒川・代々木公園を中心に、1人参加でも来やすい場を目指しています。
                        </p>
                    </div>
                    <img
                        src="/assets/about-hero-real.png"
                        alt="HINODEの朝ラン - 日の出とともに走る東京のランニングコミュニティ"
                        className={`${styles.heroImage} ${styles.fadeIn}`}
                    />
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.contentContainer}>
                    <div className={styles.fadeIn}>
                        <h2 className={styles.sectionTitle}>HINODEはどんなコミュニティか</h2>
                        <p className={styles.text}>週3回（水・木・日曜）のグループランを基本に、不定期のイベントも開催しています。ペースも距離も自由で、苦しくなったら歩いても問題ありません。速さではなく、走り続ける規律そのものを大事にしています。</p>
                        <p className={styles.text}>競技志向のクラブではありません。ランキングやコーチング、練習メニューはなく、継続したい人のためのコミュニティです。中学生から50代まで、老若男女が参加しています。</p>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.contentContainer}>
                    <div className={styles.fadeIn}>
                        <h2 className={styles.sectionTitle}>こんな人に向いています</h2>
                        <ul className={styles.list}>
                            <li>朝に走る習慣をつけたい人</li>
                            <li>競争より継続を大事にしたい人</li>
                            <li>1人だと続かない人</li>
                            <li>速くなくても参加しやすい場を探している人</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.contentContainer}>
                    <div className={styles.fadeIn}>
                        <h2 className={styles.sectionTitle}>初めてでも参加できる理由</h2>
                        <ul className={styles.list}>
                            <li>手首に<strong>黄色いゴムバンド</strong>をつけている人がHINODEです。それを目印に合流してください</li>
                            <li>初心者歓迎 — 毎回、参加者の約3割はほぼ初めてのランニングです</li>
                            <li>参加費無料・予約不要 — 集合場所へ来るだけで参加できます</li>
                            <li>ペース・距離は自由 — 歩いても途中離脱・途中参加も問題なし</li>
                            <li>雨天は基本中止 — 開催可否は当日の <a href="https://www.instagram.com/hinode_run/" className={styles.link} target="_blank" rel="noopener noreferrer">Instagram</a> / <a href="https://strava.app.link/pQ0uMuWWj2b" className={styles.link} target="_blank" rel="noopener noreferrer">Strava</a> で確認できます</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section id="faq" className={styles.faqSection}>
                <div className={styles.contentContainer}>
                    <div className={styles.fadeIn}>
                        <h2 className={styles.sectionTitle}>よくある質問</h2>

                        <div className={styles.faqItem}>
                            <h3 className={styles.faqQuestion}>集合場所で誰もいなかったら？</h3>
                            <p className={styles.text}>手首に黄色いゴムバンドをつけている人がいないか探してみてください。<a href="https://www.strava.com/athletes/174878383" className={styles.link} target="_blank" rel="noopener noreferrer">運営のStrava</a> でほぼすべてのランを日の出で記録しています。雨の日など開催できない場合は <a href="https://strava.app.link/pQ0uMuWWj2b" className={styles.link} target="_blank" rel="noopener noreferrer">Strava</a> / <a href="https://www.instagram.com/hinode_run/" className={styles.link} target="_blank" rel="noopener noreferrer">Instagram</a> で前もって告知します。</p>
                        </div>

                        <div className={styles.faqItem}>
                            <h3 className={styles.faqQuestion}>どんな人が参加していますか？</h3>
                            <p className={styles.text}>中学生から50代まで老若男女問わず参加しています。</p>
                        </div>

                        <div className={styles.faqItem}>
                            <h3 className={styles.faqQuestion}>開始時間はいつですか？</h3>
                            <p className={styles.text}>平日は6:30、日曜は7:30スタートです。太陽は待ってくれないので時間通りにスタートします。数分前には集合しておいてください。夏場は日の出が早く6:30だと少し日の出を過ぎますが、電車で来る方も参加しやすいよう通年同じ時刻に固定しています。</p>
                        </div>

                        <div className={styles.faqItem}>
                            <h3 className={styles.faqQuestion}>何を持っていけばいいですか？</h3>
                            <p className={styles.text}>走れる服装とシューズだけで大丈夫です。荷物がある場合は、駅のロッカーに預けてから来る方もいます。</p>
                        </div>

                        <div className={styles.faqItem}>
                            <h3 className={styles.faqQuestion}>Stravaへの参加表明は必要ですか？</h3>
                            <p className={styles.text}>必須ではありませんが、<a href="https://strava.app.link/pQ0uMuWWj2b" className={styles.link} target="_blank" rel="noopener noreferrer">Strava</a> で「参加」を押してもらえると他の人も参加しやすくなります。</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.contentContainer}>
                    <div className={styles.fadeIn}>
                        <h2 className={styles.sectionTitle}>開催と最新情報</h2>
                        <p className={styles.text}>皇居・目黒川・代々木公園で週3回（水・木・日曜）開催。<a href="/schedule" className={styles.link}>開催日程と参加方法を見る →</a></p>
                        <p className={styles.text}>開催可否やその他の案内は <a href="https://www.instagram.com/hinode_run/" className={styles.link} target="_blank" rel="noopener noreferrer">Instagram</a> と <a href="https://strava.app.link/pQ0uMuWWj2b" className={styles.link} target="_blank" rel="noopener noreferrer">Strava</a> で告知しています。</p>
                    </div>
                </div>
            </section>
        </>
    );
}
