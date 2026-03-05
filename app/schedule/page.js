import styles from './schedule.module.css';
import NextRunDate from '../../components/NextRunDate';

export const metadata = {
    title: 'SCHEDULE | HINODE',
    description: 'HINODEのランニングスケジュール。毎週水・木・日に開催。誰でも参加できる朝のランニングコミュニティです。',
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
                <p className={styles.stravaHint}>
                    ソロ参加する方も多いです。ぜひお気軽に、Stravaで参加登録してください🏃‍♂️
                </p>
            </section>

            <section className={styles.scheduleSection}>
                {/* WED - Imperial Palace */}
                <div className={styles.runRow}>
                    <div className={styles.runNumber}>01</div>
                    <div className={styles.runInfo}>
                        <h3 className={styles.runName}>皇居ラン</h3>
                        <p className={styles.runMeta}>
                            <span className={styles.dayBadge}>毎週水曜</span>
                            <span className={styles.runDistance}>（約5km）</span>
                        </p>
                        <NextRunDate dayOfWeek={3} time="06:30" className={styles.nextDate} />
                    </div>
                    <div className={styles.runMapSection}>
                        <img src="/assets/kokyo-run-map.png" alt="皇居ラン" className={styles.runMapImage} />
                        <a href="https://maps.app.goo.gl/E9HkSojyPZw6zo1b9" target="_blank" rel="noopener noreferrer" className={styles.googleMapLink}>
                            📍 Google map
                        </a>
                    </div>
                    <div className={styles.runDescription}>
                        <p>桔梗門前派出所に集合。<br />皇居を左回りで1周。<br />和田倉噴水公園内にはSTARBUCKSも。</p>
                    </div>
                </div>

                {/* THU - Meguro River */}
                <div className={styles.runRow}>
                    <div className={styles.runNumber}>02</div>
                    <div className={styles.runInfo}>
                        <h3 className={styles.runName}>目黒川ラン</h3>
                        <p className={styles.runMeta}>
                            <span className={styles.dayBadge}>毎週木曜</span>
                            <span className={styles.runDistance}>（約4km）</span>
                        </p>
                        <NextRunDate dayOfWeek={4} time="06:30" className={styles.nextDate} />
                    </div>
                    <div className={styles.runMapSection}>
                        <img src="/assets/meguro-run-map.png" alt="目黒川ラン" className={styles.runMapImage} />
                        <a href="https://maps.app.goo.gl/SKixyw53vfJnp1p36" target="_blank" rel="noopener noreferrer" className={styles.googleMapLink}>
                            📍 Google map
                        </a>
                    </div>
                    <div className={styles.runDescription}>
                        <p>中目黒駅のスターバックス蔦屋書店前に集合。<br />目黒川をぐるっと回るコース。<br />走り終わったらスタバでコーヒーを。8時開店の「I&apos;m donut ?」にも並ばずに行けます。</p>
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
                        <NextRunDate dayOfWeek={0} time="07:30" className={styles.nextDate} />
                    </div>
                    <div className={styles.runMapSection}>
                        <img src="/assets/yoyogi-run-map.png" alt="代々木公園ラン" className={styles.runMapImage} />
                        <a href="https://maps.app.goo.gl/dB3L15dHByAoC4jw9" target="_blank" rel="noopener noreferrer" className={styles.googleMapLink}>
                            📍 Google map
                        </a>
                    </div>
                    <div className={styles.runDescription}>
                        <p>原宿時計塔に集合。<br />代々木公園を左回りで1〜2周。<br />公園を降りて少し歩いたところにはVERVE COFFEEなど、カフェスポットあり。</p>
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
