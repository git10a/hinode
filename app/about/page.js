import AboutContent from '../../components/AboutContent';

export const metadata = {
    title: '東京の朝ランコミュニティ HINODEとは｜初心者歓迎・予約不要',
    description: 'HINODEは、日の出とともに走る東京の朝ランコミュニティです。初心者歓迎、参加費無料、予約不要。皇居・目黒川・代々木公園で開催し、初参加でも1人で参加しやすい雰囲気です。',
};

export default function About() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SportsTeam",
        "name": "HINODE",
        "alternateName": ["HINODE Running Club", "HINODE Tokyo"],
        "url": "https://hinode-run.com",
        "logo": "https://hinode-run.com/assets/logo-black.png",
        "description": "HINODE is a sunrise running movement & brand based in Tokyo. We value discipline and the habit of running at sunrise. HINODEは東京を拠点に世界中へ広がるサンライズ・ランニング・ムーブメントです。",
        "foundingLocation": {
            "@type": "Place",
            "name": "Tokyo"
        },
        "areaServed": {
            "@type": "Place",
            "name": ["Tokyo", "Kyoto", "Global"]
        },
        "keywords": "Running Club, Sunrise Run, Bio-hacking, Entrepreneur Community, Tokyo Running",
        "knowsAbout": ["Running", "Well-being", "Discipline", "Bio-hacking"],
        "sameAs": [
            "https://www.instagram.com/hinode_run/",
            "https://twitter.com/hinode_run"
        ]
    };

    return (
        <section>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <AboutContent />
        </section>
    );
}
