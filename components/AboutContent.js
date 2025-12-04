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
                    <h1 className={`${styles.title} ${styles.fadeIn}`}>HINODEとは</h1>
                    <div className={`${styles.introContainer} ${styles.fadeIn}`}>
                        <h3 className={styles.introTitle}>HINODE: A Sunrise Running Club, Movement & Brand</h3>
                        <p className={styles.introText}>
                            HINODE（ヒノデ）は、東京を拠点に世界中へ広がる日の出で走るクラブであり、ムーブメントであり、ブランドです。
                        </p>
                        <p className={styles.introText}>
                            私たちが共有するのは、肩書きや所属ではなく、「日の出と共に走りだす」というただ一つの習慣と、それを継続する「規律（Discipline）」への賞賛です。 東京での定例ランに参加する者も、遠く離れた場所で一人走る者も、同じ太陽の下で自分自身と向き合うなら、それは等しくHINODEの一員です。
                        </p>
                        <p className={styles.introText}>
                            場所や形式にとらわれず、自らの意志で日の出で一日を始めること。その「生き方」そのものを、HINODEと呼びます。
                        </p>
                    </div>

                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.contentContainer}>
                    <p className={`${styles.subtitle} ${styles.fadeIn}`}>The HINODE Code</p>
                    <div className={styles.fadeIn}>
                        <div className={styles.number}>01.</div>
                        <h2 className={styles.sectionTitle}>Ritual</h2>
                        <h3 className={styles.sectionSubtitle}>自分との約束を守る、朝の儀式。</h3>
                        <p className={styles.text}>HINODEが最も大切にしているのは、速さや距離ではありません。「走る」と決めた自分自身を裏切らないこと。その一点です。</p>
                        <p className={styles.text}>意志を持って目覚め、静寂の中でシューズの紐を結ぶ。その小さな「勝利」から一日を始めることで、私たちは人生の主導権を自らの手に取り戻します。</p>
                        <p className={styles.text}>HINODEは、規律（Discipline）を愛する人々のための、静かなる実践の場です。</p>
                    </div>
                </div>
            </section>

            <section className={`${styles.section} ${styles.sectionAlt}`}>
                <div className={styles.contentContainer}>
                    <div className={styles.fadeIn}>
                        <div className={styles.number}>02.</div>
                        <h2 className={styles.sectionTitle}>Bio-Hacking</h2>
                        <h3 className={styles.sectionSubtitle}>「結果」としての、圧倒的な心身の変化。</h3>
                        <p className={styles.text}>私たちはメリットのために走るわけではありません。しかし、正しい規律は必ず正しい結果をもたらします。</p>
                        <p className={styles.text}>糖質が枯渇した状態での燃焼効率。セロトニンによる幸福感。そして、静寂の中で冴え渡る脳のパフォーマンス。</p>
                        <p className={styles.text}>朝日と共に活動を開始することは、24時間を最大効率で使いこなすための、最も理にかなったバイオハックでもあります。</p>
                        <p className={styles.text}>夜よりも長く、濃密な一日が、ここから始まります。</p>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.contentContainer}>
                    <div className={styles.fadeIn}>
                        <div className={styles.number}>03.</div>
                        <h2 className={styles.sectionTitle}>Independent & Connected</h2>
                        <h3 className={styles.sectionSubtitle}>縛られない、けれど繋がっている。</h3>
                        <p className={styles.text}>HINODEは、物理的な集合だけを強制する場所ではありません。</p>
                        <p className={styles.text}>気の合う仲間と並走し、会話を楽しむ朝もあれば、遠く離れた場所で、たった一人、黙々と走る朝もあるでしょう。</p>
                        <p className={styles.text}>大切なのは、どこにいたとしても「同じ朝日の下で、自分との約束を果たしている」という事実を共有していること。</p>
                        <p className={styles.text}>離れていても、集まっていても。私たちは規律と太陽を通じて、確かに繋がっています。</p>
                    </div>
                </div>
            </section>

            <section className={`${styles.section} ${styles.faqSection}`}>
                <div className={styles.contentContainer}>
                    <div className={styles.fadeIn}>
                        <p className={styles.subtitle}>FAQ</p>
                        <div className={styles.faqItem}>
                            <h2 className={styles.faqQuestion}>Who runs with us?</h2>
                            <h3 className={styles.faqQuestionJp}>誰が走っているのか</h3>
                            <p className={styles.text}>私たちはオープンなコミュニティです。社会人、学生、海外の方。年齢も性別も国籍も多様な方々が参加しています。必要なのは「速く走る脚」ではなく、「朝起きて走り出す意志」だけです。初心者も、熟練のランナーも、等しく歓迎します。</p>
                        </div>

                        <div className={styles.faqItem}>
                            <h2 className={styles.faqQuestion}>Why Sunrise?</h2>
                            <h3 className={styles.faqQuestionJp}>なぜ日の出なのか</h3>
                            <p className={styles.text}>自分の人生を好転させるためのすべてがその時間帯にはあるからです。日の出の時刻（おおむね5時ごろ）は1日の中で最も自分でコントロールできる時間であり、そのため運動習慣を継続する上でも最適な時間帯であり、そして、やるべきことや考えるべきことに時間をかけて取り組むことができる時間帯でもあります。また、朝日を浴びながら体を動かすことで、脳にとっても最高のパフォーマンスを引き出します。</p>
                            <p className={styles.text}>日の出で走る詳しいメリットに関してはこちらも参照してください。<br />
                                <a href="https://hinode-run.com/blog/1bbjcftfxf" target="_blank" rel="noopener noreferrer" className={styles.link}>
                                    https://hinode-run.com/blog/1bbjcftfxf
                                </a>
                            </p>
                        </div>

                        <div className={styles.faqItem}>
                            <h2 className={styles.faqQuestion}>How to join?</h2>
                            <h3 className={styles.faqQuestionJp}>参加方法</h3>
                            <p className={styles.text}>HINODEに面倒な入会手続きはありません。StravaやInstagramで告知される場所に、指定の時間に来るだけ。あるいは、あなたの街で日の出と共に走り出すなら、もうセッションは始まっています。</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.ctaSection}>
                <div className="container">
                    <div className={styles.fadeIn}>

                        <a href="https://www.strava.com/clubs/hinode" target="_blank" rel="noopener noreferrer" className="btn calendar-btn">
                            次の日の出ランをStravaでチェックする🏃‍♂️‍➡️
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}

