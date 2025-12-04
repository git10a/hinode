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
        "description": "HINODE is a sunrise running movement & brand. We value Ritual, Bio-Hacking, and Independent & Connected.",
        "url": "https://hinode-run.com",
        "location": {
            "@type": "Place",
            "name": "Yoyogi Park",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Tokyo",
                "addressCountry": "JP"
            }
        },
        "sameAs": [
            "https://www.instagram.com/hinode_run/",
            "https://www.strava.com/clubs/hinode"
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
