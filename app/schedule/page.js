import styles from './schedule.module.css';

export const metadata = {
    title: 'SCHEDULE | HINODE',
    description: 'HINODEのランニングスケジュール。毎週月・水・日に開催。誰でも参加できる朝のランニングコミュニティです。',
};

export default function EventPage() {
    return (
        <div className={styles.container}>
            <section className={styles.header}>
                <h1 className={styles.pageTitle}>SCHEDULE of #hinode_run</h1>
                <div className={styles.subCopy}>
                    <p>毎週、同じ時間・同じ場所で走る</p>
                    <p>自分との約束を守り続けるHINODEの朝ラン</p>
                </div>
                <a
                    href="https://www.strava.com/clubs/hinode"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.headerBtn}
                >
                    詳細はStravaでチェック
                </a>
            </section>

            <section className={styles.scheduleSection}>
                <div className={styles.scheduleGrid}>
                    {/* MON */}
                    <div className={styles.card}>
                        <span className={styles.dayLabel}>
                            <span className={styles.weeklyText}>毎週</span>
                            月曜日
                        </span>
                        <div className={styles.cardContent}>
                            <h3 className={styles.runTitle}>オンラインラン</h3>
                            <span className={styles.nextDateRest}>年始まで休み</span>
                            <div className={styles.timeLocation}>
                                <p>スタート時間: 06:30</p>
                                <p>集合場所: オンライン</p>
                                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>（同じ空の下、各自の場所で同時スタート）</p>
                            </div>
                            <div className={styles.imageContainer}>
                                <img src="/assets/earth-3d.png" alt="Online Run" className={styles.earthImage} />
                            </div>
                        </div>
                    </div>

                    {/* WED */}
                    <div className={styles.card}>
                        <span className={styles.dayLabel}>
                            <span className={styles.weeklyText}>毎週</span>
                            水曜日
                        </span>
                        <div className={styles.cardContent}>
                            <h3 className={styles.runTitle}>皇居ラン</h3>
                            <span className={styles.nextDate}>次回: 12/17（今年最後）</span>
                            <div className={styles.timeLocation}>
                                <p>スタート時間: 06:20</p>
                                <p>集合場所: 皇居 桔梗門派出所集合</p>
                            </div>
                            <div className={styles.mapContainer}>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d859.3563589663179!2d139.75930192448354!3d35.6833933120758!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188be14634be45%3A0x4756b6d53502e3b2!2z6K2m6KaW5bqBIOS4uOOBruWGheitpuWvn-e9siDmoJTmopfplIDorablgpnmtL7lh7rmiYA!5e0!3m2!1sja!2sus!4v1765865887232!5m2!1sja!2sus"
                                    className={styles.mapFrame}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                    </div>

                    {/* SUN */}
                    <div className={styles.card}>
                        <span className={styles.dayLabel}>
                            <span className={styles.weeklyText}>毎週</span>
                            日曜日
                        </span>
                        <div className={styles.cardContent}>
                            <h3 className={styles.runTitle}>代々木公園ラン</h3>
                            <span className={styles.nextDateRest}>年始まで休み</span>
                            <div className={styles.timeLocation}>
                                <p>スタート時間: 07:30</p>
                                <p>集合場所: 代々木公園 原宿門時計塔集合</p>
                            </div>
                            <div className={styles.mapContainer}>
                                <iframe
                                    src="https://maps.google.com/maps?q=代々木公園+原宿門&t=&z=17&ie=UTF8&iwloc=&output=embed"
                                    className={styles.mapFrame}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>
                    </div>

                    {/* EVENT */}
                    <div className={styles.card}>
                        <span className={styles.dayLabel}>
                            イベントラン
                        </span>
                        <div className={styles.cardContent}>
                            <div className={styles.eventItem}>
                                <h3 className={styles.runTitle}>鎌倉ラン</h3>
                                <span className={styles.nextDate}>12/21（日）開催</span>
                                <p className={styles.eventNote}>鎌倉の海岸線から登る日の出を見ながらラン</p>
                            </div>
                            <div className={styles.eventItem}>
                                <h3 className={styles.runTitle}>🌅 初日の出ラン</h3>
                                <span className={styles.nextDate}>1/1（水）オンライン</span>
                                <p className={styles.eventNote}>新年は日の出とともに走り初め</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.beginnersSection}>
                <h2 className={styles.sectionTitle}>初めての方へ</h2>
                <ul className={styles.beginnersList}>
                    <li>速さや経験は問いません</li>
                    <li>1人参加の方が多いです。誰でも連れてきてOKです</li>
                    <li>途中参加・途中離脱も可能です</li>
                </ul>
            </section>

            <section className={styles.noteSection}>
                <div className={styles.noteBox}>
                    <p className={styles.noteText}>雨天や状況により中止・変更する場合があります。</p>
                    <p className={styles.noteText}>最新情報は Strava / Instagram にて告知します。</p>
                </div>
            </section>

            <section className={styles.linksSection}>
                <a href="https://www.strava.com/clubs/hinode" target="_blank" rel="noopener noreferrer" className={styles.linkBtn}>
                    Strava クラブを見る
                </a>
                <a href="https://www.instagram.com/hinode_run/" target="_blank" rel="noopener noreferrer" className={styles.linkBtn}>
                    Instagramを見る
                </a>
            </section>
        </div>
    );
}
