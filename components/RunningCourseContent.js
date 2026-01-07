'use client';

import { useEffect } from 'react';
import styles from '../app/hinode-spot/hinode-spot.module.css';

export default function RunningCourseContent() {
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

    const courses = [
        {
            title: '皇居ラン',
            distance: '約5km（1周）',
            badge: '水曜',
            description: '桔梗門前派出所に集合し、皇居を左回りで1周するコース。終わったあとは和田倉噴水公園のスタバに寄りがち。',
            mapUrl: 'https://maps.app.goo.gl/QvKZ8Z9Z9Z9Z9Z9Z9',
            image: '/assets/kokyo-run-map.png',
        },
        {
            title: '代々木公園ラン',
            distance: '約3〜6km（1〜2周）',
            badge: '日曜',
            description: '原宿時計塔に集合し、代々木公園を左回りで1〜2周するコース。終わったあとはVERVE COFFEEに寄りがち。',
            mapUrl: 'https://maps.app.goo.gl/QvKZ8Z9Z9Z9Z9Z9Z9',
            image: '/assets/yoyogi-run-map.png',
        },
        {
            title: 'リモートラン',
            distance: '自由',
            badge: '月曜ほか',
            description: '東京にいなくても、ひとりでも。日の出に走れば、どこにいてもHINODEメンバー。',
            mapUrl: null,
            image: '/assets/remote-run-map.png',
        },
    ];

    return (
        <>
            <section className={styles.courseHero}>
                <div className="container">
                    <h1 className={`${styles.title} ${styles.fadeIn}`}>Running Course</h1>
                    <p className={`${styles.introText} ${styles.fadeIn}`}>
                        HINODEで実際に走っているコースを紹介します。<br />
                        集合地点だけ決めて、あとは自由に。
                    </p>
                </div>
            </section>

            <section className={`${styles.section} ${styles.sectionAlt}`}>
                <div className={styles.contentContainer}>
                    <div className={styles.fadeIn}>
                        <h2 className={styles.sectionTitle}>定期開催コース</h2>
                        <p className={styles.text}>
                            グループランで走っているコースです。集合地点に来れば、誰でも参加できます。
                        </p>
                    </div>

                    <div className={`${styles.courseGrid} ${styles.fadeIn}`}>
                        {courses.map((course, index) => (
                            <div key={index} className={styles.courseCard}>
                                <div className={styles.courseImageWrapper}>
                                    <img
                                        src={course.image}
                                        alt={`${course.title}のコースマップ`}
                                        className={styles.courseImage}
                                    />
                                    <span className={styles.courseBadge}>{course.badge}</span>
                                </div>
                                <div className={styles.courseContent}>
                                    <h3 className={styles.courseTitle}>{course.title}</h3>
                                    <p className={styles.courseDistance}>{course.distance}</p>
                                    <p className={styles.courseDescription}>{course.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles.highlightSection}>
                <div className={styles.contentContainer}>
                    <div className={`${styles.highlightCard} ${styles.fadeIn}`}>
                        <div className={styles.highlightIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="12" cy="12" r="4" />
                                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                            </svg>
                        </div>
                        <div className={styles.highlightContent}>
                            <h3>日の出で走る理由</h3>
                            <p>
                                日の出の時間に走ることで、体内時計がリセットされ、一日を通して集中力が高まります。
                                また、朝日のオレンジ色の光は目に優しく、心身をリフレッシュさせる効果があると言われています。
                                早起きという小さな約束を守り続けることが、自分への信頼につながっていきます。
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={`${styles.section} ${styles.ctaSection}`}>
                <div className={styles.contentContainer}>
                    <div className={styles.fadeIn}>
                        <p className={styles.ctaText}>
                            一緒に日の出で走りませんか？<br />
                            スケジュールは<a href="/schedule" className={styles.link}>こちら</a>、
                            詳しい情報は<a href="https://www.strava.com/clubs/hinode_run" className={styles.link} target="_blank" rel="noopener noreferrer">Strava</a>や
                            <a href="https://www.instagram.com/hinode_run/" className={styles.link} target="_blank" rel="noopener noreferrer">Instagram</a>をご覧ください。
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
