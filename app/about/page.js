import AboutContent from '../../components/AboutContent';

export const metadata = {
    title: 'HINODEとは｜東京で日の出とともに走る朝ランコミュニティ',
    description: 'HINODEは、日の出とともに走る東京の朝ランコミュニティです。初心者歓迎、参加費無料。皇居・目黒川・代々木公園で開催し、初参加でも1人で参加しやすい雰囲気です。',
};

const FAQ_JSON_LD = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "集合場所で誰もいなかったら？",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "中止の告知がないかぎり、必ず誰かがいます。目印の黄色いバンドを手首に付けている人にお声がけください。雨の日など開催できない場合はStrava / Instagramで前もって告知します。不安なことがあればいつでもご連絡ください。"
            }
        },
        {
            "@type": "Question",
            "name": "開始時間はいつですか？",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "6月1日から、水曜の皇居ランと木曜の目黒川ランは6:00、日曜の代々木公園ランは7:15スタートです。時間通りにスタートしますので、2分前には集合しておいてください。"
            }
        },
        {
            "@type": "Question",
            "name": "日の出の時間はもっと早くありませんか？",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "はい、夏場は5時ごろに日の出を迎えます。6月1日からは1か月ほどサマータイムとして、水曜・木曜は6:00、日曜は7:15を試します。日曜は近くのRuntrip BASEが7:00オープンのため、7:15集合です。継続するかは参加状況や気温を見ながら判断します。"
            }
        },
        {
            "@type": "Question",
            "name": "どんな人が参加していますか？",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "25歳から35歳くらいのメンバーが5割ほどいらっしゃいますが、中学生から50代まで老若男女問わず参加しています。"
            }
        },
        {
            "@type": "Question",
            "name": "何を持っていけばいいですか？",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "走れる服装とシューズだけで大丈夫です。荷物がある場合は、駅のロッカーに預けてから来る方もいます。"
            }
        },
        {
            "@type": "Question",
            "name": "Stravaへの参加表明は必要ですか？",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "必須ではありませんが、Stravaで参加を押してもらえると他の人も参加しやすくなります。"
            }
        },
        {
            "@type": "Question",
            "name": "写真に写らなくても大丈夫ですか？",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "大丈夫です。HINODEでは、基本的に集合写真は撮りません。日の出や街の景色がきれいなタイミングで、景色の写真を撮るために立ち止まることはありますが、参加者の顔出しやSNS掲載を前提にした場ではありません。"
            }
        }
    ]
};

export default function About() {
    return (
        <section>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
            />
            <AboutContent />
        </section>
    );
}
