import styles from './schedule.module.css';

export const metadata = {
    title: 'SCHEDULE | HINODE',
    description: 'HINODEのランニングスケジュール。毎週月・水・日に開催。誰でも参加できる朝のランニングコミュニティです。',
};

export default function EventPage() {
    return (
        <div className={styles.container}>
            <section className={styles.header}>
                <h1 className={styles.pageTitle}>SCHEDULE</h1>
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
                {/* MON - Remote Run */}
                <div className={styles.runRow}>
                    <div className={styles.runNumber}>01</div>
                    <div className={styles.runInfo}>
                        <h3 className={styles.runName}>リモートラン</h3>
                        <p className={styles.runMeta}>
                            <span className={styles.dayBadge}>毎週月曜</span>
                            <span className={styles.runDistance}>（自由）</span>
                        </p>
                    </div>
                    <div className={styles.runMapSection}>
                        <img src="/assets/remote-run-map.png" alt="リモートラン" className={styles.runMapImage} />
                    </div>
                    <div className={styles.runDescription}>
                        <p>同じ空の下、各自の場所で同時スタート。<br />東京にいなくても、ひとりでも。<br />1週間を自分の意思で能動的に始めましょう。</p>
                        <p className={styles.runTime}>スタート時間: 06:30</p>
                    </div>
                </div>

                {/* WED - Imperial Palace */}
                <div className={styles.runRow}>
                    <div className={styles.runNumber}>02</div>
                    <div className={styles.runInfo}>
                        <h3 className={styles.runName}>皇居ラン</h3>
                        <p className={styles.runMeta}>
                            <span className={styles.dayBadge}>毎週水曜</span>
                            <span className={styles.runDistance}>（約5km）</span>
                        </p>
                    </div>
                    <div className={styles.runMapSection}>
                        <img src="/assets/kokyo-run-map.png" alt="皇居ラン" className={styles.runMapImage} />
                        <a href="https://maps.app.goo.gl/E9HkSojyPZw6zo1b9" target="_blank" rel="noopener noreferrer" className={styles.googleMapLink}>
                            📍 Google map
                        </a>
                    </div>
                    <div className={styles.runDescription}>
                        <p>桔梗門前派出所に集合。<br />皇居を左回りで1周。<br />和田倉噴水公園内にはSTARBUCKSも。</p>
                        <p className={styles.runTime}>スタート時間: 06:30</p>
                    </div>
                </div>

                {/* SUN - Yoyogi */}
                <div className={styles.runRow}>
                    <div className={styles.runNumber}>03</div>
                    <div className={styles.runInfo}>
                        <h3 className={styles.runName}>代々木公園ラン</h3>
                        <p className={styles.runMeta}>
                            <span className={styles.dayBadge}>毎週日曜</span>
                            <span className={styles.runDistance}>（約3〜6km）</span>
                        </p>
                    </div>
                    <div className={styles.runMapSection}>
                        <img src="/assets/yoyogi-run-map.png" alt="代々木公園ラン" className={styles.runMapImage} />
                        <a href="https://maps.app.goo.gl/dB3L15dHByAoC4jw9" target="_blank" rel="noopener noreferrer" className={styles.googleMapLink}>
                            📍 Google map
                        </a>
                    </div>
                    <div className={styles.runDescription}>
                        <p>原宿時計塔に集合。<br />代々木公園を左回りで1〜2周。<br />公園を降りて少し歩いたところにはVERVE COFFEEなど、カフェスポットあり。</p>
                        <p className={styles.runTime}>スタート時間: 07:30</p>
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
                <p className={styles.faqLink}>
                    <a href="/about#faq">よくある質問はこちら →</a>
                </p>
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
