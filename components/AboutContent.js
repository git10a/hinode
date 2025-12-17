'use client';

import { useEffect } from 'react';
import styles from '../app/about/about.module.css';

export default function AboutContent() {
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(styles.visible);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const fadeElements = document.querySelectorAll(`.${styles.fadeIn}`);
        fadeElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

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
                        <h2 className={styles.sectionTitle}>What we do</h2>
                        <p className={styles.text}>日の出前に集まり、日の出とともに走ります。</p>
                        <p className={styles.text}>ペースも距離も決めません。各自の心地よさを優先します。</p>
                        <p className={styles.text}>走ったあとは、コーヒーを飲んだり、そのまま解散したり、自由です。</p>
                    </div>
                </div>
            </section>

            <section className={`${styles.section} ${styles.sectionAlt}`}>
                <div className={styles.contentContainer}>
                    <div className={styles.fadeIn}>
                        <h2 className={styles.sectionTitle}>Start on time</h2>
                        <p className={styles.text}>HINODEは日の出で走ります。太陽は待ってくれないので、時間どおりにスタートします。</p>
                        <p className={styles.text}>数分前には集合しておいてください。</p>
                    </div>
                </div>
            </section>






            <section id="faq" className={`${styles.section} ${styles.faqSection}`}>
                <div className={styles.contentContainer}>
                    <div className={styles.fadeIn}>
                        <p className={styles.subtitle}>FAQ</p>
                        <div className={styles.faqItem}>
                            <h2 className={styles.faqQuestion}>日の出で集合地点に向かったのに誰もいなかったら？</h2>
                            <p className={styles.text}>不安になるお気持ちはとてもわかります。<a href="https://www.strava.com/athletes/174878383" className={styles.link} target="_blank" rel="noopener noreferrer">HINODE運営のStrava</a> をご覧いただけると、ほぼすべてのランを日の出で記録していることがわかるので、少しでも安心材料にしていただけたら幸いです。雨の日や運営がどうしてもいけない日はStravaやInstagramで前もって告知しますので、フォローしておいていただけると確認しやすいです。</p>
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
                            <p className={styles.text}>Stravaで「参加」を押してもらえると運営が人数を把握しやすいので助かります（必須ではありません）。Stravaに登録すると、そのまま繋がれるのでおすすめです。</p>
                        </div>

                        <div className={styles.faqItem}>
                            <h2 className={styles.faqQuestion}>途中参加・途中離脱はできますか？</h2>
                            <p className={styles.text}>離脱はいつでも大丈夫です。</p>
                            <p className={styles.text}>途中参加も可能ですが、走っている集団に合流するのは少し難しいことがあります。できればスタートの数分前に来てもらえるとスムーズです。</p>
                        </div>



                        <div className={styles.faqItem}>
                            <h2 className={styles.faqQuestion}>雨の日はどうなりますか？</h2>
                            <p className={styles.text}>小雨なら走る場合もあります。開催可否は当日のInstagram / Stravaで案内するので、そちらを確認してください。</p>
                        </div>

                        <div className={styles.faqItem}>
                            <h2 className={styles.faqQuestion}>何を持っていけばいいですか？</h2>
                            <p className={styles.text}>走れる服装とシューズだけで大丈夫です。必要なら飲み物や着替えを。荷物がある場合は、駅などのロッカーに預けてから来る人もいます。</p>
                        </div>
                    </div>
                </div>
            </section>


        </>
    );
}

