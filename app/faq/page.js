import Link from '@/components/SiteLink';
import styles from './faq.module.css';

const SITE_URL = 'https://hinode-run.com';

export const metadata = {
    title: 'よくある質問｜HINODE 東京の朝ランコミュニティ',
    description:
        'HINODEのよくある質問。予約・参加費・1人参加・初心者・ペース・服装・荷物・雨天時の確認方法など、初めて朝ランに参加する前の疑問にまとめて答えます。',
    alternates: {
        canonical: `${SITE_URL}/faq`,
    },
    openGraph: {
        title: 'よくある質問 | HINODE',
        description:
            '予約は必要？1人でも大丈夫？初心者でも走れる？HINODEの朝ランに参加する前の疑問にまとめて答えます。',
        url: `${SITE_URL}/faq`,
        siteName: 'HINODE',
        locale: 'ja_JP',
        type: 'website',
    },
};

// FAQの本文。aJsx はページ内でリンク付き表示するための差し込み（JSON-LDにはプレーンテキストの a を使う）
const FAQ_GROUPS = [
    {
        title: '参加について',
        items: [
            {
                q: '参加に予約や会員登録は必要ですか？',
                a: '不要です。開催日程で曜日・時間・集合場所を確認して、開始の数分前に走れる服装で来てください。Stravaでの参加登録は任意ですが、人数を把握しやすくなるのでしてもらえると嬉しいです。',
            },
            {
                q: '参加費はかかりますか？',
                a: 'かかりません。参加は無料です。',
            },
            {
                q: '1人で参加しても大丈夫ですか？',
                a: '大丈夫です。1人参加の方はとても多く、初参加のほとんどが1人で来ています。会話や交流は強制しないので、誰とも話さず走って、そのまま帰っても構いません。',
            },
            {
                q: 'ランニング初心者でも参加できますか？',
                a: 'できます。HINODEは競技志向のクラブではなく、速さより継続を大事にするコミュニティです。グループランは会話できるくらいのペースで走り、歩いても途中で抜けても大丈夫です。',
            },
            {
                q: '初参加におすすめの回はありますか？',
                a: '日曜7:10の代々木公園ラン（原宿時計塔前集合）がいちばん参加しやすいです。時間帯が朝早すぎず、参加人数も多い回です。',
            },
            {
                q: '集合場所でどうやってメンバーを見つければいいですか？',
                a: '手首に黄色いゴムバンドをつけている人が目印です。気さくなメンバーばかりなので、遠慮なく声をかけてください。',
            },
        ],
    },
    {
        title: '開催について',
        items: [
            {
                q: 'いつ、どこで開催していますか？',
                a: '毎週水曜6:00に皇居（桔梗門前派出所集合）、木曜6:00に目黒川（中目黒駅 蔦屋書店併設スターバックス前集合）、日曜7:10に代々木公園（原宿時計塔前集合）で開催しています。最新の日程は開催日程ページで確認できます。',
            },
            {
                q: '雨の日は開催されますか？',
                a: '雨天時は中止になることがあります。家を出る前にInstagramかStravaで開催可否を確認してください。',
            },
            {
                q: 'どのくらいの距離を走りますか？',
                a: '回によりますが、おおむね3〜6kmです。皇居は1周約5km、目黒川は約4km、代々木公園は1〜2周で約3〜6kmです。',
            },
            {
                q: '走った後はどうなりますか？',
                a: '自由解散です。予定がある方はそのまま帰れますし、時間があればカフェに寄ったりします。',
            },
        ],
    },
    {
        title: '当日の準備について',
        items: [
            {
                q: '服装や持ち物は何が必要ですか？',
                a: '走れる服装とシューズがあれば十分です。荷物がある場合は、駅のコインロッカーやランニングステーションを使うと身軽に走れます。シューズ選びに迷ったら、無料のランニングシューズ診断「シューズマッチ」も参考にしてください。詳しくはこちら: https://www.shoes-match.com/',
                aJsx: (
                    <>
                        走れる服装とシューズがあれば十分です。荷物がある場合は、駅のコインロッカーやランニングステーションを使うと身軽に走れます。
                        シューズ選びに迷ったら、無料の
                        <a href="https://www.shoes-match.com/" target="_blank" rel="noopener noreferrer">ランニングシューズ診断「シューズマッチ」</a>
                        も参考にしてください。
                    </>
                ),
            },
            {
                q: 'どんな人が参加していますか？',
                a: '10代から60代まで幅広く、中心は25〜35歳くらいです。学生、会社員、経営者など職業もさまざまで、ラン歴1年以内の人が体感8割ほどです。',
            },
            {
                q: 'Stravaには登録したほうがいいですか？',
                a: '強制ではありませんが、できれば登録をおすすめします。参加予定の人数が見えると、参加を迷っている人の後押しにもなります。',
            },
        ],
    },
];

function buildFaqJsonLd() {
    const allItems = FAQ_GROUPS.flatMap((group) => group.items);
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: allItems.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
    };
}

export default function FaqPage() {
    const jsonLd = buildFaqJsonLd();

    return (
        <section>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <section className={styles.hero}>
                <div className="container">
                    <p className={styles.eyebrow}>FAQ</p>
                    <h1 className={styles.title}>よくある質問</h1>
                    <p className={styles.introText}>
                        初めての朝ラン参加の前に、よく聞かれる質問をまとめました。
                        ここにない疑問は、<a href="https://www.instagram.com/hinode_run/" target="_blank" rel="noopener noreferrer">InstagramのDM</a>に遠慮なくご連絡ください。
                    </p>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.narrowContainer}>
                    {FAQ_GROUPS.map((group) => (
                        <div key={group.title}>
                            <h2 className={styles.groupTitle}>{group.title}</h2>
                            {group.items.map((item) => (
                                <div key={item.q} className={styles.faqItem}>
                                    <h3 className={styles.faqQuestion}>{item.q}</h3>
                                    <p className={styles.faqAnswer}>{item.aJsx || item.a}</p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.ctaSection}>
                <div className={styles.narrowContainer}>
                    <p className={styles.ctaText}>
                        読むより、一度来てみるのがいちばん早いです。<br />
                        次の朝、集合場所でお待ちしています。
                    </p>
                    <div className={styles.ctaLinks}>
                        <Link href="/first-run" className={styles.primaryButton}>初参加ガイドを読む</Link>
                        <Link href="/schedule" className={styles.secondaryButton}>開催日程を見る</Link>
                    </div>
                </div>
            </section>
        </section>
    );
}
