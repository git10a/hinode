import AboutContent from '../../components/AboutContent';

export const metadata = {
    title: 'HINODEとは｜東京で日の出とともに走る朝ランコミュニティ',
    description: 'HINODEは、日の出とともに走る東京の朝ランコミュニティです。初心者歓迎、参加費無料、予約不要。皇居・目黒川・代々木公園で開催し、初参加でも1人で参加しやすい雰囲気です。',
};

const FAQ_JSON_LD = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "初心者でも参加できますか？",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "参加できます。毎回、参加者の約3割はほぼ初めてのランニングです。気持ちよく話しながら走れる範囲で大丈夫です。"
            }
        },
        {
            "@type": "Question",
            "name": "参加費はかかりますか？予約は必要ですか？",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "参加費はありません。予約も不要です。集合場所に来るだけで参加できます。"
            }
        },
        {
            "@type": "Question",
            "name": "雨の日はどうなりますか？",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "基本中止です。開催可否は当日のInstagramまたはStravaで案内するので、そちらを確認してください。"
            }
        },
        {
            "@type": "Question",
            "name": "何を持っていけばいいですか？",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "走れる服装とシューズだけで大丈夫です。必要なら飲み物や着替えがあると便利です。荷物は駅のロッカーに預ける方もいます。"
            }
        },
        {
            "@type": "Question",
            "name": "どんな人が参加していますか？",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "中学生から50代まで老若男女問わず参加しています。"
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
