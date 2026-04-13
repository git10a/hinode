import styles from './schedule.module.css';
import NextRunDate from '../../components/NextRunDate';

export const metadata = {
    title: '東京の朝ラン開催日程｜皇居・目黒川・代々木公園で毎週開催',
    description: 'HINODEの朝ラン開催日程ページです。皇居・目黒川・代々木公園で毎週開催。集合場所、曜日、距離、参加しやすさ、初参加時の注意点をまとめています。最新情報はStravaとInstagramで確認できます。',
};

export default function EventPage() {
    return (
        <div className={styles.container}>
            <section className={styles.header}>
                <h1 className={`${styles.pageTitle} ${styles.pageTitleJp}`}>東京の朝ラン開催日程｜皇居・目黒川・代々木公園</h1>
                <div className={styles.subCopy}>
                    <p>HINODEは、東京で毎週同じ時間・同じ場所に集まって走る朝ランコミュニティです。皇居、目黒川、代々木公園で開催しており、初心者や1人参加の方も多く参加しています。以下から、曜日・集合場所・距離を確認して参加してください。</p>
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
                        <h2 className={styles.runName}>皇居の朝ラン｜毎週水曜 06:30〜</h2>
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
                        <p className={styles.runForWhom}>皇居で朝ランしたい方・仕事前に短く走りたい方・初参加でも合流しやすい定番コースです。</p>
                    </div>
                </div>

                {/* THU - Meguro River */}
                <div className={styles.runRow}>
                    <div className={styles.runNumber}>02</div>
                    <div className={styles.runInfo}>
                        <h2 className={styles.runName}>目黒川の朝ラン｜毎週木曜 06:30〜</h2>
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
                        <p className={styles.runForWhom}>中目黒エリアで朝ランしたい方・平日朝に短く走りたい方・距離が短めで参加しやすい回です。</p>
                    </div>
                </div>

                {/* SUN - Yoyogi */}
                <div className={styles.runRow}>
                    <div className={styles.runNumber}>03</div>
                    <div className={styles.runInfo}>
                        <h2 className={styles.runName}>代々木公園の朝ラン｜毎週日曜 07:30〜</h2>
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
                        <p className={styles.runForWhom}>代々木公園で朝ランしたい方・休日の朝にゆるく走りたい方・初心者や会話しながら走りたい方に向いています。</p>
                    </div>
                </div>
            </section>

            <section className={styles.beginnersSection}>
                <h2 className={styles.sectionTitle}>初参加の方へ｜予約・参加費・持ち物</h2>
                <ul className={styles.beginnersList}>
                    <li>初心者歓迎 — 毎回、参加者の約3割はほぼ初めてのランニングです</li>
                    <li>参加費無料 — 費用は一切かかりません</li>
                    <li>予約不要 — 当日、集合場所へ来るだけです</li>
                    <li>1人参加しやすい — 初参加でも気軽に来られる雰囲気です</li>
                    <li>速さや経験は問いません — ペース・距離は自由、歩いても問題なし</li>
                    <li>持ち物は走れる服装とシューズだけ。荷物は近くの駅ロッカーに預ける方も多いです</li>
                    <li>途中参加・途中離脱も可能です</li>
                    <li>雨天は基本中止 — 開催可否は当日の <a href="https://www.instagram.com/hinode_run/" target="_blank" rel="noopener noreferrer">Instagram</a> / <a href="https://www.strava.com/clubs/hinode_run" target="_blank" rel="noopener noreferrer">Strava</a> で確認してください</li>
                </ul>
                <p className={styles.faqLink}>
                    <a href="/about#faq">よくある質問はこちら →</a>
                </p>
                <p className={styles.faqLink}>
                    <a href="/about">HINODEとは何かを見る →</a>
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
