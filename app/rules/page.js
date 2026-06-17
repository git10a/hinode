import Link from 'next/link';
import styles from './rules.module.css';

const CONTACT_EMAIL = 'hinode.run@gmail.com';

export const metadata = {
    title: '参加ルール｜HINODE',
    description: 'HINODEの参加ルール。安心して朝ランに参加するために大切にしていること、禁止事項、写真・動画の扱い、困ったときの連絡先をまとめています。',
    openGraph: {
        title: '参加ルール｜HINODE',
        description: '安心して朝ランに参加するために、HINODEで大切にしていることと禁止事項をまとめています。',
        url: 'https://hinode-run.com/rules',
        siteName: 'HINODE',
        locale: 'ja_JP',
        type: 'article',
        images: ['/assets/ogp-home.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: '参加ルール｜HINODE',
        description: 'HINODEで安心して朝ランに参加するためのルールです。',
        images: ['/assets/ogp-home.png'],
    },
};

const CARE_ITEMS = [
    '他の参加者との適切な距離感を守ること',
    '走力、年齢、性別、経験、参加回数にかかわらず、周囲に配慮すること',
    '初参加の方や一人で参加している方が安心できる雰囲気をつくること',
    '歩行者、自転車、車、周辺施設の利用者を優先すること',
    '集合時間、集合場所、走行ルート、ペースの案内に協力すること',
    '体調不良や怪我がある場合は無理をしないこと',
    '周囲への思いやりを持って、安全に走ること',
    '主催者またはHINODE運営の案内・指示に従うこと',
];

const PROHIBITED_ITEMS = [
    '営業、販売、保険、投資、マルチ商法、ネットワークビジネス等への勧誘',
    '宗教、スピリチュアル、自己啓発、政治活動、特定団体等への勧誘',
    '特定の思想、信条、健康法、治療法、世界観等を他の参加者に押し付ける行為',
    'ナンパ、執拗な声かけ、過度に個人的な質問',
    '参加者への執拗なDM、個別連絡、待ち伏せ、つきまとい',
    '性的、差別的、威圧的、攻撃的な言動',
    '他の参加者が不安、不快感、恐怖感、圧迫感を覚える言動',
    '無断で参加者の顔写真・動画を撮影、投稿する行為',
    'HINODEの名前を使った無断営業、集客、イベント開催',
    'ランニング中の危険行為、集団走行の妨害',
    '公共の場でのマナーや一般的な常識、周囲への配慮を欠く行為',
    'その他、HINODE運営が不適切と判断する行為',
];

const RESTRICTION_ITEMS = [
    '複数の参加者から、不安、不快感、恐怖感、圧迫感などの報告があった場合',
    '他の参加者との適切な距離感を保つことが難しいと判断される場合',
    'HINODEの安全性、快適性、信頼性、継続性を損なうおそれがある場合',
    '特定の思想、信条、活動、団体、商品、サービス等への勧誘・誘導につながるおそれがある場合',
    'HINODEの場に適さないとHINODE運営が判断した場合',
];

const RESPONSE_ITEMS = [
    '口頭またはメッセージでの注意',
    '一定期間の参加停止',
    '今後の参加のお断り',
    'Strava、Instagram、その他HINODE関連コミュニティからの削除',
    '必要に応じた関係機関への相談',
];

function RuleList({ items }) {
    return (
        <ul className={styles.list}>
            {items.map((item) => (
                <li key={item}>{item}</li>
            ))}
        </ul>
    );
}

export default function RulesPage() {
    return (
        <article className={styles.page}>
            <div className={styles.container}>
                <p className={styles.eyebrow}>Community Rules</p>
                <h1 className={styles.title}>HINODE 参加ルール</h1>
                <p className={styles.lead}>
                    HINODEは、速さを競う場ではなく、朝に走るきっかけをつくり、その習慣を少しでも続けやすくするためのランニングコミュニティです。
                </p>

                <section className={styles.intro}>
                    <p>
                        そのため、より多くの参加者が、心地よく、快適に走りに来られる場であることを大切にしています。
                    </p>
                    <p>
                        HINODEでは、参加者全員が安心して走りに来られることを最優先に運営します。年齢や立場にかかわらず、公共の場でのマナーを守り、周囲への思いやりと適切な距離感を持って参加していただければ、基本的に問題が起きることはありません。
                    </p>
                    <p>
                        一方で、明確な禁止事項に該当しない場合でも、複数の参加者から不安、不快感、恐怖感、圧迫感などの報告がHINODE運営に寄せられた場合、またはHINODE運営がコミュニティの安全性・快適性・信頼性・継続性を損なうおそれがあると判断した場合には、参加を制限またはお断りすることがあります。
                    </p>
                    <p>
                        HINODEは、特定の誰かだけでなく、参加する多くの方が安心して気持ちよく走れる環境を大切にします。
                    </p>
                </section>

                <nav className={styles.toc} aria-label="参加ルールの目次">
                    <a href="#scope">適用範囲</a>
                    <a href="#care">大切にしてほしいこと</a>
                    <a href="#prohibited">禁止していること</a>
                    <a href="#photos">写真・動画について</a>
                    <a href="#contact">困ったことがあった場合</a>
                    <a href="#restriction">参加制限について</a>
                    <a href="#accidents">事故・怪我について</a>
                </nav>

                <div className={styles.content}>
                    <section id="scope" className={styles.section}>
                        <h2>本ルールの適用範囲</h2>
                        <p>
                            本ルールは、HINODEが主催・告知するランニングイベント、集合前後の交流、HINODE関連のStrava・Instagram・その他オンライン上のやり取りに適用されます。
                        </p>
                        <p>
                            イベント中だけでなく、イベント前後の個別連絡、SNS上でのやり取り、HINODEの名前を使った活動にも適用されます。
                        </p>
                    </section>

                    <section id="care" className={styles.section}>
                        <h2>HINODEで大切にしてほしいこと</h2>
                        <RuleList items={CARE_ITEMS} />
                    </section>

                    <section id="prohibited" className={styles.section}>
                        <h2>HINODEで禁止していること</h2>
                        <p>HINODEでは、以下の行為を禁止します。</p>
                        <RuleList items={PROHIBITED_ITEMS} />
                    </section>

                    <section id="photos" className={styles.section}>
                        <h2>写真・動画について</h2>
                        <p>
                            HINODEでは、参加者の安心を優先します。
                        </p>
                        <p>
                            参加者の顔が写る写真や動画を撮影・投稿する場合は、必ず本人の了承を得てください。
                        </p>
                        <p>
                            本人の了承がない撮影・投稿、無断でのSNS掲載、個人が特定される形での投稿は禁止します。
                        </p>
                    </section>

                    <section id="contact" className={styles.section}>
                        <h2>困ったことがあった場合</h2>
                        <p>
                            HINODEでの参加中、または参加後に、不安なこと、不快に感じたこと、気になることがあれば、遠慮なくHINODE運営に連絡してください。
                        </p>
                        <p>
                            小さな違和感でも構いません。
                        </p>
                        <p>
                            「これくらいで連絡していいのかな」と思う内容でも、安心して走れる場を守るために必要な情報になる場合があります。
                        </p>
                        <p>
                            直接HINODE運営に連絡しづらい場合は、信頼できる参加者や、仲良くなった参加者に相談しても構いません。
                        </p>
                        <div className={styles.contactBox}>
                            <span>HINODE運営への連絡先</span>
                            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                        </div>
                    </section>

                    <section id="restriction" className={styles.section}>
                        <h2>参加制限・参加停止について</h2>
                        <p>
                            HINODEの安全性、快適性、信頼性、継続性を維持するため、参加可否、参加制限、参加停止等に関する判断はHINODE運営が行います。
                        </p>
                        <p>
                            初参加・継続参加にかかわらず、明確な禁止事項に該当する場合はもちろん、明確な禁止事項に該当しない場合でも、HINODE運営がコミュニティの場に適さないと判断した場合、事前の警告なく参加を制限またはお断りすることがあります。
                        </p>
                        <p>特に以下に該当する場合は、参加を制限またはお断りする場合があります。</p>
                        <RuleList items={RESTRICTION_ITEMS} />
                        <p>
                            参加制限・参加停止・参加のお断りに関する判断理由の詳細については、参加者および関係者の安全・プライバシー保護のため、個別に開示しない場合があります。
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>禁止事項等が確認された場合の対応について</h2>
                        <p>禁止事項や不適切な行為が確認された場合、HINODE運営は必要に応じて以下の対応を行います。</p>
                        <RuleList items={RESPONSE_ITEMS} />
                        <p>
                            悪質な行為、緊急性の高い行為、他の参加者の安全や安心を損なうおそれがある行為については、事前の注意なく参加をお断りする場合があります。
                        </p>
                    </section>

                    <section id="accidents" className={styles.section}>
                        <h2>事故・怪我・体調不良について</h2>
                        <p>
                            HINODEは、参加者が任意で参加するランニングコミュニティです。
                        </p>
                        <p>
                            参加者は、自身の体調、走力、健康状態を踏まえ、無理のない範囲で参加してください。
                        </p>
                        <p>
                            ランニング中の怪我、事故、体調不良、荷物の紛失、参加者同士のトラブル等について、HINODEは責任を負いかねます。
                        </p>
                        <p>
                            必要に応じて、各自で保険への加入を検討してください。
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>ルールの変更</h2>
                        <p>
                            本ルールは、HINODEの運営状況、参加者の安全確保、コミュニティの健全な継続のため、必要に応じて変更することがあります。
                        </p>
                    </section>
                </div>

                <div className={styles.cta}>
                    <p>初めて参加する方は、当日の流れもあわせてご確認ください。</p>
                    <div className={styles.ctaLinks}>
                        <Link href="/first-run" className={styles.primaryLink}>初参加ガイドを見る</Link>
                        <Link href="/schedule" className={styles.secondaryLink}>開催日程を見る</Link>
                    </div>
                </div>
            </div>
        </article>
    );
}
