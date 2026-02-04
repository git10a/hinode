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
                    <h1 className={`${styles.title} ${styles.fadeIn}`}>About HINODE</h1>

                    <img
                        src="/assets/about-hero-real.png"
                        alt="Sunrise Running"
                        className={`${styles.heroImage} ${styles.fadeIn}`}
                    />
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.contentContainer}>
                    <div className={styles.fadeIn}>
                        <h2 className={styles.sectionTitle}>HINODEとは？</h2>
                        <p className={styles.text}>HINODEとは、日の出前に集まり、日の出とともに走る人のコミュニティで、2025年11月に設立されました。</p>
                        <p className={styles.text}>週3回のグループランを基本に、不定期のイベントも開催しています。<a href="/schedule" className={styles.smallLink}>日程をチェック →</a></p>
                        <p className={styles.text}>HINODEのグループランでは、ペースも距離も自由です。もし苦しくなったら歩いても全く問題ありません！速さではなく、走り続ける日々を積み重ねていく規律こそが大事だと考えています。</p>
                        <p className={styles.text}>走ったあとはコーヒーを飲んだり、そのまま出勤したり、帰ったり。参加者それぞれ自由に過ごしています。</p>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.contentContainer}>
                    <div className={styles.fadeIn}>
                        <h2 className={styles.sectionTitle}>開始時間について</h2>
                        <p className={styles.text}>HINODEは日の出で走ります。太陽は待ってくれないので、時間どおりにスタートします。数分前には集合しておいてください！</p>
                        <p className={styles.text}>日の出の時間は1年の間に最大2時間ほど変わります。そのため半年に1回、開始時間の変更がありますが、<a href="https://www.strava.com/clubs/hinode_run" className={styles.link} target="_blank" rel="noopener noreferrer">Strava</a>/<a href="https://www.instagram.com/hinode_run/" className={styles.link} target="_blank" rel="noopener noreferrer">Instagram</a> で告知しますのでご確認ください。</p>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.contentContainer}>
                    <div className={styles.fadeIn}>
                        <h2 className={styles.sectionTitle}>競技志向のクラブではありません</h2>
                        <p className={styles.text}>HINODEは競技志向のランニングクラブではありません。速さや記録を競う場ではなく、規律を大切にし、継続したい人のためのコミュニティです。</p>
                        <p className={styles.text}>ランキングやコーチング、練習メニューはありません。</p>
                    </div>
                </div>
            </section>


            <section id="faq" className={`${styles.section} ${styles.faqSection}`}>
                <div className={styles.contentContainer}>
                    <div className={styles.fadeIn}>
                        <p className={styles.subtitle}>FAQ</p>
                        <div className={styles.faqItem}>
                            <h2 className={styles.faqQuestion}>日の出で集合地点に向かったのに誰もいなかったら？</h2>
                            <p className={styles.text}>不安になるお気持ちはとてもわかります。<a href="https://www.strava.com/athletes/174878383" className={styles.link} target="_blank" rel="noopener noreferrer">HINODE運営のStrava</a> をご覧いただけると、ほぼすべてのランを日の出で記録していることがわかるので、少しでも安心材料にしていただけたら幸いです。雨の日や運営がどうしてもいけない日は<a href="https://www.strava.com/clubs/hinode_run" className={styles.link} target="_blank" rel="noopener noreferrer">Strava</a>や<a href="https://www.instagram.com/hinode_run/" className={styles.link} target="_blank" rel="noopener noreferrer">Instagram</a>で前もって告知しますので、フォローしておいていただけると確認しやすいです。</p>
                        </div>

                        <div className={styles.faqItem}>
                            <h2 className={styles.faqQuestion}>初心者でも参加できますか？</h2>
                            <p className={styles.text}>参加できます。毎回、参加者の約3割はほぼ初めてのランニングです。気持ちよく話しながら走れる範囲で大丈夫です。</p>
                        </div>

                        <div className={styles.faqItem}>
                            <h2 className={styles.faqQuestion}>どんな人が参加していますか？</h2>
                            <p className={styles.text}>中学生から50代まで老若男女問わず参加していただいています。</p>
                        </div>

                        <div className={styles.faqItem}>
                            <h2 className={styles.faqQuestion}>参加費はかかりますか？予約は必要ですか？</h2>
                            <p className={styles.text}>参加費はありません。予約も不要です。</p>
                            <p className={styles.text}>必須ではありませんが、<a href="https://www.strava.com/clubs/hinode_run" className={styles.link} target="_blank" rel="noopener noreferrer">Strava</a>で「参加」を押してもらえると他の人もより参加しやすくなるので、ぜひ気軽にボタンを押してください！<a href="https://www.strava.com/clubs/hinode_run" className={styles.link} target="_blank" rel="noopener noreferrer">Strava</a>に登録すると、一緒に走った方々とそのまま繋がることができ、ランニング記録を見せあうことがモチベーションになるのでおすすめです。</p>
                        </div>

                        <div className={styles.faqItem}>
                            <h2 className={styles.faqQuestion}>途中参加・途中離脱はできますか？</h2>
                            <p className={styles.text}>離脱はいつでも大丈夫です。</p>
                            <p className={styles.text}>途中参加も可能ですが、走っている集団に合流するのは少し難しいかもしれません。できればスタートの数分前に来てもらえるとスムーズです。</p>
                        </div>



                        <div className={styles.faqItem}>
                            <h2 className={styles.faqQuestion}>雨の日はどうなりますか？</h2>
                            <p className={styles.text}>基本中止です。開催可否は当日の<a href="https://www.instagram.com/hinode_run/" className={styles.link} target="_blank" rel="noopener noreferrer">Instagram</a>/<a href="https://www.strava.com/clubs/hinode_run" className={styles.link} target="_blank" rel="noopener noreferrer">Strava</a> で案内するので、そちらを確認してください。</p>
                        </div>

                        <div className={styles.faqItem}>
                            <h2 className={styles.faqQuestion}>何を持っていけばいいですか？</h2>
                            <p className={styles.text}>走れる服装とシューズだけで大丈夫です。必要なら飲み物や着替えがあると便利かもしれません。荷物がある場合は、駅などのロッカーに預けてから来る方もいます。</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.contentContainer}>
                    <div className={styles.fadeIn}>
                        <p className={styles.contactText}>その他なんでも、わからないことがあれば<a href="https://www.instagram.com/hinode_run/" className={styles.link} target="_blank" rel="noopener noreferrer">HINODEのInstagram</a>にDMお願いします！</p>
                    </div>
                </div>
            </section>


        </>
    );
}
