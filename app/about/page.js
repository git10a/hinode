import AboutContent from '../../components/AboutContent';

export const metadata = {
    title: 'HINODEとは | HINODE',
    description: 'HINODEが大切にしている3つの哲学。Ritual（儀式）、Bio-Hacking（身体の変化）、Independent & Connected（繋がり）。',
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
