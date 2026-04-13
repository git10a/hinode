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
            {/* ヒーローセクション */}
            <section className={styles.aboutHero}>
                <div className="container">
                    <h1 className={`${styles.title} ${styles.titleJp} ${styles.fadeIn}`}>
                        HINODEとは｜東京で日の出とともに走る朝ランコミュニティ
                    </h1>
                    <div className={`${styles.introContainer} ${styles.fadeIn}`}>
                        <p className={styles.introText}>
                            HINODEは、日の出前に集まり、日の出とともに走る東京の朝ランコミュニティです。初心者でも参加でき、参加費は無料、予約も不要です。皇居・目黒川・代々木公園を中心に、1人参加でも来やすい場を目指しています。
                        </p>
                    </div>
                    <img
                        src="/assets/about-hero-real.png"
                        alt="HINODEの朝ラン - 日の出とともに走る東京のランニングコミュニティ"
                        className={`${styles.heroImage} ${styles.fadeIn}`}
                    />
                </div>
            </section>

            {/* HINODEはどんなコミュニティか */}
            <section className={styles.section}>
                <div className={styles.contentContainer}>
                    <div className={styles.fadeIn}>
                        <h2 className={styles.sectionTitle}>HINODEはどんなコミュニティか</h2>
                        <p className={styles.text}>週3回（水・木・日曜）のグループランを基本に、不定期のイベントも開催しています。ペースも距離も自由で、もし苦しくなったら歩いても全く問題ありません。速さではなく、走り続ける日々を積み重ねていく規律こそが大事だと考えています。</p>
                        <p className={styles.text}>競技志向のクラブではありません。ランキングやコーチング、練習メニューはなく、継続したい人のためのコミュニティです。中学生から50代まで、老若男女が参加しています。</p>
                        <p className={styles.text}>走ったあとはコーヒーを飲んだり、そのまま出勤したり、帰ったり。参加者それぞれ自由に過ごしています。</p>
                    </div>
                </div>
            </section>

            {/* こんな人に向いています */}
            <section className={`${styles.section} ${styles.sectionAlt}`}>
                <div className={styles.contentContainer}>
                    <div className={styles.fadeIn}>
                        <h2 className={styles.sectionTitle}>こんな人に向いています</h2>
                        <ul className={styles.list}>
                            <li>朝に走る習慣をつけたい人</li>
                            <li>競争より継続を大事にしたい人</li>
                            <li>1人だと続かない人</li>
                            <li>速くなくても参加しやすい場を探している人</li>
                            <li>東京で朝ランコミュニティを探している人</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 初めてでも参加できる理由 */}
            <section className={styles.section}>
                <div className={styles.contentContainer}>
                    <div className={styles.fadeIn}>
                        <h2 className={styles.sectionTitle}>初めてでも参加できる理由</h2>
                        <ul className={styles.list}>
                            <li><strong>初心者歓迎</strong> — 毎回、参加者の約3割はほぼ初めてのランニングです</li>
                            <li><strong>参加費無料</strong> — 費用は一切かかりません</li>
                            <li><strong>予約不要</strong> — 当日、集合場所へ来るだけです</li>
                            <li><strong>1人参加しやすい</strong> — 初参加でも気軽に来られる雰囲気です</li>
                            <li><strong>ペース・距離は自由</strong> — 速さや距離を競いません。歩いても問題なし</li>
                            <li><strong>途中離脱OK</strong> — 都合に合わせていつでも離脱できます。途中参加も可能です</li>
                            <li><strong>雨天は基本中止</strong> — 開催可否は当日の <a href="https://www.instagram.com/hinode_run/" className={styles.link} target="_blank" rel="noopener noreferrer">Instagram</a> / <a href="https://www.strava.com/clubs/hinode_run" className={styles.link} target="_blank" rel="noopener noreferrer">Strava</a> で確認できます</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* よくある質問 */}
            <section id="faq" className={`${styles.section} ${styles.faqSection}`}>
                <div className={styles.contentContainer}>
                    <div className={styles.fadeIn}>
                        <h2 className={styles.sectionTitle}>よくある質問</h2>

                        <div className={styles.faqItem}>
                            <h3 className={styles.faqQuestion}>日の出で集合地点に向かったのに誰もいなかったら？</h3>
                            <p className={styles.text}>不安になるお気持ちはとてもわかります。<a href="https://www.strava.com/athletes/174878383" className={styles.link} target="_blank" rel="noopener noreferrer">HINODE運営のStrava</a> をご覧いただけると、ほぼすべてのランを日の出で記録していることがわかるので、少しでも安心材料にしていただけたら幸いです。雨の日や運営がどうしてもいけない日は <a href="https://www.strava.com/clubs/hinode_run" className={styles.link} target="_blank" rel="noopener noreferrer">Strava</a>/<a href="https://www.instagram.com/hinode_run/" className={styles.link} target="_blank" rel="noopener noreferrer">Instagram</a> で前もって告知しますので、フォローしておいていただけると確認しやすいです。</p>
                        </div>

                        <div className={styles.faqItem}>
                            <h3 className={styles.faqQuestion}>どんな人が参加していますか？</h3>
                            <p className={styles.text}>中学生から50代まで老若男女問わず参加していただいています。</p>
                        </div>

                        <div className={styles.faqItem}>
                            <h3 className={styles.faqQuestion}>開始時間はいつですか？</h3>
                            <p className={styles.text}>通常は6:30スタートです。太陽は待ってくれないので、時間どおりにスタートします。数分前には集合しておいてください。</p>
                            <p className={styles.text}>夏場は日の出が早いため6:30だと少し日の出をすぎますが、電車で来る方も参加しやすいよう通年6:30に固定しています。夏の本当の日の出に合わせた特別ランは不定期で企画することがあります。</p>
                        </div>

                        <div className={styles.faqItem}>
                            <h3 className={styles.faqQuestion}>何を持っていけばいいですか？</h3>
                            <p className={styles.text}>走れる服装とシューズだけで大丈夫です。必要なら飲み物や着替えがあると便利かもしれません。荷物がある場合は、駅などのロッカーに預けてから来る方もいます。</p>
                        </div>

                        <div className={styles.faqItem}>
                            <h3 className={styles.faqQuestion}>Stravaへの参加表明は必要ですか？</h3>
                            <p className={styles.text}>必須ではありませんが、<a href="https://www.strava.com/clubs/hinode_run" className={styles.link} target="_blank" rel="noopener noreferrer">Strava</a> で「参加」を押してもらえると他の人も参加しやすくなるので、ぜひ気軽にボタンを押してください。Stravaに登録すると一緒に走った方々とそのまま繋がることができ、モチベーションにもなるのでおすすめです。</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 開催場所と日程 */}
            <section className={styles.section}>
                <div className={styles.contentContainer}>
                    <div className={styles.fadeIn}>
                        <h2 className={styles.sectionTitle}>開催場所と日程</h2>
                        <p className={styles.text}>皇居・目黒川・代々木公園を中心に、週3回（水・木・日曜）開催しています。</p></p>
                        <p className={styles.text}>
                            <a href="/schedule" className={styles.link}>開催日程と参加方法を見る →</a>
                        </p>
                    </div>
                </div>
            </section>

            {/* 最新情報の確認方法 */}
            <section className={styles.section}>
                <div className={styles.contentContainer}>
                    <div className={styles.fadeIn}>
                        <h2 className={styles.sectionTitle}>最新情報の確認方法</h2>
                        <p className={styles.text}>開催可否は当日の <a href="https://www.instagram.com/hinode_run/" className={styles.link} target="_blank" rel="noopener noreferrer">Instagram</a> と <a href="https://www.strava.com/clubs/hinode_run" className={styles.link} target="_blank" rel="noopener noreferrer">Strava</a> でお知らせしています。フォローしておくと確認しやすいです。</p>
                        <p className={styles.contactText}>その他、わからないことがあれば <a href="https://www.instagram.com/hinode_run/" className={styles.link} target="_blank" rel="noopener noreferrer">HINODEのInstagram</a> にDMください。</p>
                    </div>
                </div>
            </section>
        </>
    );
}
