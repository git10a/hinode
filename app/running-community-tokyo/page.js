import Image from 'next/image';
import Link from 'next/link';
import PostBottomStrip from '../../components/PostBottomStrip';
import styles from './running-community-tokyo.module.css';

const SITE_URL = 'https://hinode-run.com';
const PAGE_URL = `${SITE_URL}/running-community-tokyo`;
const STRAVA_CLUB_URL = 'https://www.strava.com/clubs/1772485';
const INSTAGRAM_URL = 'https://www.instagram.com/hinode_run/';

export const metadata = {
    title: '東京のランニングコミュニティ｜初心者・一人参加歓迎の朝ラン HINODE',
    description: '東京でランニングコミュニティを探している方へ。HINODEは皇居・代々木公園・目黒川で朝にゆっくり走るランニングコミュニティです。初心者・一人参加歓迎。会話できるペースで走ります。予約不要・参加無料。',
    alternates: {
        canonical: PAGE_URL,
    },
    openGraph: {
        title: '東京のランニングコミュニティ｜初心者・一人参加歓迎の朝ラン HINODE',
        description: '東京でランニングコミュニティを探している方へ。初心者・一人参加でも入りやすい、朝のグループランです。',
        url: PAGE_URL,
        siteName: 'HINODE',
        locale: 'ja_JP',
        type: 'article',
        images: ['/assets/ogp-home.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: '東京のランニングコミュニティ｜初心者・一人参加歓迎の朝ラン HINODE',
        description: '速そうで怖い、一人で浮きそう、初心者でもいいかわからない。そんな人向けのHINODE参加案内です。',
        images: ['/assets/ogp-home.png'],
    },
};

const CONCERNS = [
    {
        title: '速そうで怖い',
        answer: 'HINODEは距離やスピードを求める練習会ではありません。ラン歴一年以内の人が半数以上ですし、普段からよく走る人も、グループランではゆっくり走ります。',
    },
    {
        title: '一人で行って浮かないか不安',
        answer: '本当に一人で来て大丈夫です。むしろ一人参加の人の方が多いので、誰かに紹介してもらう必要はありません。',
    },
    {
        title: '初心者でも参加していいかわからない',
        answer: 'もちろん大丈夫です。「先月からランニング始めました」とおっしゃる方も案外多いです。特に代々木公園と目黒川の回は、3km走れればまず大丈夫ですのでおすすめです。皇居は5kmでアップダウンもあるので、体力に自信がない場合は、最初は皇居以外がおすすめかもしれません。',
    },
];

const PARTICIPANT_FACTS = [
    {
        value: '10代〜60代',
        label: '幅広い年齢層',
        body: '中心は25〜35歳くらいですが、毎回いろいろな年代の方が参加しています。',
    },
    {
        value: '6:4くらい',
        label: '男女比の目安',
        body: '男性が少し多めですが、男女どちらかに偏りすぎた雰囲気ではありません。',
    },
    {
        value: '体感8割ほど',
        label: 'ラン歴1年以内',
        body: '走り始めてまだ長くない人も多いです。15年走っている人も、グループランではゆっくり走ります。',
    },
];

const FIT_ITEMS = [
    '東京で朝に走るランニングコミュニティやランニング仲間を探している',
    '速い練習会より、朝にゆっくり走る習慣を作りたい',
    '一人参加でも入りやすいランニングサークルを探している',
    '過度な自己紹介や撮影より、自然に走り始められる場がいい',
    '自分の意思に頼らずに、自然と朝ランを続けられる場所がほしい',
];

const NOT_FIT_ITEMS = [
    '距離やスピードを求めて、毎回しっかり練習したい',
    '決まったコーチやメニューに沿って走りたい',
    '同じ年齢層の人だけで走りたい',
    '交流や撮影をメインにしたイベントを探している',
];

const RUN_CHOICES = [
    {
        label: '最初の1回',
        title: '代々木公園ラン',
        schedule: '日曜 7:10',
        image: '/assets/Yoyogi.png',
        alt: '代々木公園の緑の中を走るコース',
        href: '/schedule#yoyogi',
        body: '1周2kmで距離やペースの調整がしやすい回です。3km走れれば参加しやすく、初参加にもっとも向いています。',
    },
    {
        label: '平日の習慣化',
        title: '皇居ラン',
        schedule: '水曜 6:00',
        image: '/assets/Kokyo.jpg',
        alt: '皇居周辺の朝の景色',
        href: '/schedule#kokyo',
        body: '皇居を1周して約5km。アップダウンもあるので、体力にまだ自信がない方は代々木公園か目黒川からがおすすめですが、今日も走ったという気分になれるのが良いところです。',
    },
    {
        label: '短めの平日朝',
        title: '目黒川ラン',
        schedule: '木曜 6:00',
        image: '/assets/Meguro.png',
        alt: '目黒川沿いのランニングコース',
        href: '/schedule#meguro',
        body: '皇居ほど距離は長くありません。3kmほど走れる方なら参加しやすく、平日の朝ランを始めたい人に向いています。',
    },
];

const FLOW_STEPS = [
    {
        title: '行けそうな回を選ぶ',
        body: '迷うなら、まず日曜の代々木公園ランがおすすめです。体力に不安がある方は皇居以外からどうぞ。',
    },
    {
        title: '5分前に集合場所へ',
        body: '予約は不要です。走れる服装で、集合時間の少し前に来てください。',
    },
    {
        title: '黄色いゴムバンドを目印にする',
        body: '手首に黄色いゴムバンドをつけている人を探して、「HINODEの集まりですか？」と声をかけてください。',
    },
    {
        title: '名前だけ言って走り出す',
        body: '過度な自己紹介はありません。呼ばれたい名前をそれぞれ言ったら、すぐに走りに行きます。',
    },
    {
        title: '走ったあとは自由',
        body: '帰っても、追加で走っても、カフェに行っても大丈夫です。カフェは行きたい人だけで、必須感はありません。',
    },
];

const SCENE_CARDS = [
    {
        title: '集合したら',
        body: 'HINODE以外のコミュニティが同じ場所にいることもあります。無言でも大丈夫ですが、最初だけ「HINODEの集まりですか？」と声をかけてもらえると合流しやすいです。',
    },
    {
        title: '走っているとき',
        body: '仕事の話ばかりではありません。ランニングを始めたきっかけ、HINODEを知ったきっかけ、何回参加したことがあるか、趣味の話など、その場ごとに自然な会話が生まれます。',
    },
    {
        title: '走ったあと',
        body: '次の予定に向かう人も、まだ走り足りなくて走りに行く人もいます。行きたい人だけカフェに行き、だいたい7割くらいの人が参加することが多いです。',
    },
    {
        title: '続けやすさ',
        body: 'イベント自体が朝だけで、Stravaでつながる人たちも朝ランをしがちです。過度に飾りすぎない空気もあって、朝ランを続けるきっかけになりやすいと思います。',
    },
];

const FAQ_ITEMS = [
    {
        question: '東京でランニングコミュニティを探しています。HINODEはどんな人向けですか？',
        answer: '速い練習会より、朝にゆっくり走る習慣を作りたい人向けです。社会人が多めですが学生もいて、年齢層は10代から60代まで幅広いです。',
    },
    {
        question: 'ランニングサークルと何が違いますか？',
        answer: 'HINODEも広い意味ではランニングサークルですが、入会手続きや会費はありません。決まった時間と場所に集まり、朝に会話できるペースで走るシンプルなコミュニティです。',
    },
    {
        question: '初心者でも本当に参加できますか？',
        answer: 'できます。代々木公園と目黒川は3km走れれば参加しやすいです。皇居は5kmでアップダウンもあるので、体力にまだ自信がない方は皇居以外からがおすすめです。',
    },
    {
        question: '一人参加で浮きませんか？',
        answer: '浮きません。一人参加の人の方が多いです。過度な自己紹介や撮影はなく、呼ばれたい名前だけ言って走り出すので、初参加でも入りやすいと思います。',
    },
    {
        question: '友達作り目的で参加してもいいですか？',
        answer: '大丈夫です。ただし、HINODEは交流だけを目的にした場ではなく、まず朝に集まって走る場所です。一緒に走ったあと、カフェなどで自然に話が盛り上がることが多いです。',
    },
    {
        question: 'どれくらいのペースで走りますか？',
        answer: '目安は1kmあたり6〜7分台くらいです。長く走っている人もいますが、HINODEのグループランでは会話できるくらいのペースで走ります。',
    },
    {
        question: '途中で離脱しても大丈夫ですか？',
        answer: '大丈夫です。きつければ歩いても、先に帰ってもかまいません。走った後も自由解散で、そのまま出勤する人もいます。',
    },
    {
        question: 'どの回が初参加におすすめですか？',
        answer: '日曜の代々木公園ランです。休日で予定を合わせやすく、集合も平日より少し遅め。3km走れれば参加しやすく、距離やペースの調整もしやすい回です。',
    },
    {
        question: '走ったあと、交流はありますか？',
        answer: '行きたい人だけカフェに行くことがあります。だいたい7割くらいの人が行くことが多いですが、次の予定に向かっても、追加で走りに行ってもまったく問題ありません。',
    },
    {
        question: '写真や動画に写りますか？',
        answer: 'HINODEでは、運営側が写真や動画を基本的に撮らず、顔出し前提の場ではありません。撮影や自己紹介で緊張しやすい方も参加しやすいと思います。',
    },
    {
        question: '参加費や予約は必要ですか？',
        answer: '無料です。予約も不要で、開催日の5分前に集合場所へ来てもらえれば参加できます。',
    },
    {
        question: '雨の日は開催しますか？',
        answer: '雨天は基本的にお休みです。当日の開催可否はStravaやInstagramの告知で確認してください。',
    },
];

const JSON_LD = [
    {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: metadata.title,
        description: metadata.description,
        url: PAGE_URL,
        inLanguage: 'ja',
        isPartOf: {
            '@type': 'WebSite',
            name: 'HINODE',
            url: SITE_URL,
        },
        about: [
            { '@type': 'Thing', name: '東京 ランニングコミュニティ' },
            { '@type': 'Thing', name: 'ランニングサークル 東京' },
            { '@type': 'Thing', name: '朝ラン コミュニティ' },
            { '@type': 'Thing', name: '一人参加 ランニング 東京' },
            { '@type': 'Thing', name: '初心者 ランニングコミュニティ' },
        ],
    },
    {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQ_ITEMS.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
            },
        })),
    },
    {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'HINODE',
                item: `${SITE_URL}/`,
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: '東京のランニングコミュニティ',
                item: PAGE_URL,
            },
        ],
    },
];

export default function RunningCommunityTokyoPage() {
    return (
        <div className={styles.page}>
            {JSON_LD.map((entry, index) => (
                <script
                    key={index}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
                />
            ))}

            <section className={styles.hero} aria-labelledby="running-community-title">
                <div className={styles.heroCopy}>
                    <p className={styles.kicker}>Running Community Tokyo</p>
                    <h1 id="running-community-title" className={styles.title}>
                        東京のランニングコミュニティ｜初心者・一人参加歓迎の朝ラン HINODE
                    </h1>
                    <p className={styles.lead}>
                        HINODE（ヒノデ）は、東京の朝にゆっくり走るランニングコミュニティです。皇居・代々木公園・目黒川で、会話できるくらいのペースのグループランを毎週開いています。
                    </p>
                    <p className={styles.lead}>
                        1人で何かイベントに参加するときは何かと不安になるものだと思いますし、その気持ちはよくわかりますが、本当に1人で来て大丈夫です。HINODEのグループランは一人参加の人の方が多く、過度な自己紹介や撮影もありません。呼ばれたい名前だけサッと5秒で自己紹介して、すぐに走り出すくらいの気軽さです。
                    </p>
                    <div className={styles.heroActions}>
                        <Link href="/first-run" className={styles.primaryCta}>
                            初参加の流れを見る
                        </Link>
                        <Link href="/schedule" className={styles.secondaryCta}>
                            次回のグループラン日程を見る
                        </Link>
                    </div>
                </div>
                <div className={styles.heroMedia}>
                    <Image
                        src="/assets/about-hero-real.png"
                        alt="東京の朝焼け"
                        fill
                        sizes="(max-width: 900px) 100vw, 46vw"
                        priority
                        className={styles.heroImage}
                    />
                </div>
            </section>

            <section className={styles.answerBand} aria-labelledby="answer-title">
                <div className={styles.bandInner}>
                    <div className={styles.answerLead}>
                        <p className={styles.sectionLabel}>Short Answer</p>
                        <h2 id="answer-title" className={styles.sectionTitle}>
                            HINODEなら、初心者でも、一人参加でも、朝ランを始められ、続けられます。
                        </h2>
                    </div>
                    <div className={styles.answerCopy}>
                        <p>
                            参加は無料、予約も不要です。代々木公園と目黒川は3km走れれば参加しやすい回です。皇居は5kmでアップダウンもあるので、体力にまだ自信がない方はまず皇居以外からどうぞ。
                        </p>
                    </div>
                </div>
            </section>

            <section className={styles.section} aria-labelledby="real-title">
                <div className={styles.sectionHeader}>
                    <p className={styles.sectionLabel}>Reality</p>
                    <h2 id="real-title" className={styles.sectionTitle}>実際に来ている人</h2>
                </div>
                <div className={styles.factGrid}>
                    {PARTICIPANT_FACTS.map((fact) => (
                        <article key={fact.label} className={styles.factCard}>
                            <p className={styles.factValue}>{fact.value}</p>
                            <h3>{fact.label}</h3>
                            <p>{fact.body}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className={styles.section} aria-labelledby="worries-title">
                <div className={styles.sectionHeader}>
                    <p className={styles.sectionLabel}>Worries</p>
                    <h2 id="worries-title" className={styles.sectionTitle}>ランニングコミュニティを探している人が不安になりやすいことに答えました</h2>
                </div>
                <div className={styles.concernGrid}>
                    {CONCERNS.map((item) => (
                        <article key={item.title} className={styles.concernCard}>
                            <h3>{item.title}</h3>
                            <p>{item.answer}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className={`${styles.section} ${styles.warmSection}`} aria-labelledby="fit-title">
                <div className={styles.sectionHeader}>
                    <p className={styles.sectionLabel}>Fit</p>
                    <h2 id="fit-title" className={styles.sectionTitle}>HINODEが向いている人、向いていない人</h2>
                </div>
                <div className={styles.fitGrid}>
                    <div className={styles.fitBlock}>
                        <h3>向いている人</h3>
                        <ul>
                            {FIT_ITEMS.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.fitBlock}>
                        <h3>別の場のほうが合うかもしれない人</h3>
                        <ul>
                            {NOT_FIT_ITEMS.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            <section className={styles.section} aria-labelledby="first-choice-title">
                <div className={styles.sectionHeader}>
                    <p className={styles.sectionLabel}>First Choice</p>
                    <h2 id="first-choice-title" className={styles.sectionTitle}>初参加なら、まず日曜の代々木公園がおすすめです</h2>
                </div>
                <div className={styles.featureBlock}>
                    <div className={styles.featureImage}>
                        <Image src="/assets/Yoyogi.png" alt="代々木公園の緑の中を走るコース" fill sizes="(max-width: 900px) 100vw, 44vw" />
                    </div>
                    <div className={styles.featureCopy}>
                        <p>
                            日曜の代々木公園ランは、平日より少し遅めの7:10スタートです。1周2kmなので、距離やペースを調整しやすく、3km走れれば参加しやすい回です。
                        </p>
                        <p>
                            最初は代々木公園で大丈夫です。早起きに体が慣れてきたら、水曜の皇居ランや木曜の目黒川ランにもぜひ。平日なのに少し時間に余裕がある感覚も、HINODEで味わってほしい朝です。
                        </p>
                        <Link href="/schedule#yoyogi" className={styles.textCta}>
                            日曜・代々木公園ランを見る
                        </Link>
                    </div>
                </div>
            </section>

            <section className={`${styles.section} ${styles.locationSection}`} aria-labelledby="locations-title">
                <div className={styles.sectionHeader}>
                    <p className={styles.sectionLabel}>Where To Run</p>
                    <h2 id="locations-title" className={styles.sectionTitle}>東京の3か所で、朝に走っています</h2>
                </div>
                <div className={styles.choiceGrid}>
                    {RUN_CHOICES.map((run) => (
                        <article key={run.title} className={styles.choiceCard}>
                            <div className={styles.choiceImage}>
                                <Image src={run.image} alt={run.alt} fill sizes="(max-width: 900px) 100vw, 30vw" />
                            </div>
                            <div className={styles.choiceBody}>
                                <p className={styles.choiceLabel}>{run.label}</p>
                                <h3>{run.title}</h3>
                                <p className={styles.choiceSchedule}>{run.schedule}</p>
                                <p>{run.body}</p>
                                <Link href={run.href} className={styles.cardLink}>集合場所を見る</Link>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className={styles.section} aria-labelledby="flow-title">
                <div className={styles.sectionHeader}>
                    <p className={styles.sectionLabel}>How It Works</p>
                    <h2 id="flow-title" className={styles.sectionTitle}>集合してから走り出すまで</h2>
                </div>
                <ol className={styles.flowList}>
                    {FLOW_STEPS.map((step, index) => (
                        <li key={step.title} className={styles.flowItem}>
                            <span className={styles.flowNumber}>{String(index + 1).padStart(2, '0')}</span>
                            <div>
                                <h3>{step.title}</h3>
                                <p>{step.body}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            </section>

            <section className={`${styles.section} ${styles.warmSection}`} aria-labelledby="scene-title">
                <div className={styles.sectionHeader}>
                    <p className={styles.sectionLabel}>Scene</p>
                    <h2 id="scene-title" className={styles.sectionTitle}>実際の空気感</h2>
                </div>
                <div className={styles.sceneGrid}>
                    {SCENE_CARDS.map((item) => (
                        <article key={item.title} className={styles.sceneCard}>
                            <h3>{item.title}</h3>
                            <p>{item.body}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className={styles.section} aria-labelledby="pace-title">
                <div className={styles.sectionHeader}>
                    <p className={styles.sectionLabel}>Pace</p>
                    <h2 id="pace-title" className={styles.sectionTitle}>速く走る場所ではなく、続けるための場所です</h2>
                </div>
                <div className={styles.copyStack}>
                    <p>
                        目安は1kmあたり6〜7分台くらい。息が上がって話せないような走り方はしません。ラン歴1年以内の人も多く、長く走っている人もHINODEのグループランではゆっくり走ってくれます。
                    </p>
                    <p>
                        HINODEが大事にしているのは、タイムを伸ばすことより、朝に走る習慣を持ち続けること。Stravaでつながった人たちが朝ランをしているのを見ることで、自然とモチベーションが上がる人も多いです。
                    </p>
                </div>
            </section>

            <section className={styles.section} aria-labelledby="join-title">
                <div className={styles.sectionHeader}>
                    <p className={styles.sectionLabel}>Join</p>
                    <h2 id="join-title" className={styles.sectionTitle}>参加方法</h2>
                </div>
                <div className={styles.copyStack}>
                    <p>
                        参加は無料です。事前の予約もいりません。開催日の5分前に集合場所へ来てもらえれば参加できます。
                    </p>
                    <p>
                        日程はスケジュールページとStravaのクラブで告知しています。参加するか迷っている段階でも、まずは次回の日程を見てもらうのが早いと思います。
                    </p>
                    <div className={styles.inlineActions}>
                        <Link href="/schedule" className={styles.textCta}>次回のグループランを見る</Link>
                        <a href={STRAVA_CLUB_URL} target="_blank" rel="noopener noreferrer" className={styles.textCtaSecondary}>
                            HINODEのStravaクラブに参加する
                        </a>
                    </div>
                    <p>
                        初参加の細かい流れは<Link href="/first-run" className={styles.inlineLink}>初めての人へのページ</Link>にまとめています。普段の様子は<a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={styles.inlineLink}>Instagram</a>でも見られます。
                    </p>
                </div>
            </section>

            <section className={styles.section} aria-labelledby="faq-title">
                <div className={styles.sectionHeader}>
                    <p className={styles.sectionLabel}>FAQ</p>
                    <h2 id="faq-title" className={styles.sectionTitle}>よくある質問</h2>
                </div>
                <div className={styles.faqList}>
                    {FAQ_ITEMS.map((item) => (
                        <details key={item.question} className={styles.faqItem}>
                            <summary>{item.question}</summary>
                            <p>{item.answer}</p>
                        </details>
                    ))}
                </div>
            </section>

            <section className={styles.closing} aria-labelledby="closing-title">
                <div className={styles.closingInner}>
                    <h2 id="closing-title">人とつながれば、朝ランは続けられる。</h2>
                    <p>迷ったら、まずは日曜の代々木公園ランからぜひ。</p>
                    <div className={styles.heroActions}>
                        <Link href="/schedule" className={styles.primaryCta}>
                            HINODEの次回グループランを見る
                        </Link>
                        <a href={STRAVA_CLUB_URL} target="_blank" rel="noopener noreferrer" className={styles.secondaryCta}>
                            Stravaクラブに参加する
                        </a>
                    </div>
                </div>
            </section>

            <PostBottomStrip compact />
        </div>
    );
}
