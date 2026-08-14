import AboutContent from '../../components/AboutContent';

export const metadata = {
    title: 'HINODEとは｜日の出とともに、競争しない朝をつづける',
    description: 'HINODEは東京・京都で活動する朝ランコミュニティです。参加無料・予約不要・競争なし。通常開催では参加者を撮影しません。',
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
                "text": "中止の告知がないかぎり、必ず誰かがいます。背中に「HINODE」と書かれた黒いTシャツを着た運営メンバーにお声がけください。雨の日など開催できない場合はStrava / Instagramで前もって告知します。不安なことがあればいつでもご連絡ください。"
            }
        },
        {
            "@type": "Question",
            "name": "開始時間はいつですか？",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "水曜の皇居ランと木曜の目黒川ランは6:00、日曜の代々木公園ランは7:15スタートです。時間通りにスタートしますので、開始5分前を目安に集合してください。"
            }
        },
        {
            "@type": "Question",
            "name": "日の出の時間はもっと早くありませんか？",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "はい、夏場は5時ごろに日の出を迎えます。日の出の瞬間だけでなく、朝の光の中を無理なく続けて走ることを大切にし、電車で来る方も参加しやすい時間にしています。日曜は近くのRuntrip BASEが7:00オープンのため、7:15集合です。"
            }
        },
        {
            "@type": "Question",
            "name": "どんな人が参加していますか？",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "25歳から35歳くらいの参加者が中心ですが、10代から60代まで幅広い方が参加しています。"
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
                "text": "通常開催では、運営は参加者が写る写真・動画を撮影しません。取材・特別企画では、用途を説明し、対象者の個別同意を得た場合のみ撮影します。"
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
