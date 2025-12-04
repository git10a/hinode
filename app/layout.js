import { Outfit, Zen_Kaku_Gothic_New } from 'next/font/google';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './globals.css';

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-en',
    display: 'swap',
});

const zenKaku = Zen_Kaku_Gothic_New({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    variable: '--font-jp',
    display: 'swap',
});

export const metadata = {
    title: 'HINODE | 日の出と共に走る',
    description: '日の出と共に走り出すランナーたちのコミュニティ、HINODE。東京にいなくても、ひとりでも。「日の出に走る」習慣があれば、あなたはもうメンバー。水曜・日曜は東京でオープンランも開催。人との競争ではなく、自分との約束を守り続けるためのコミュニティです。',
    metadataBase: new URL('https://hinode-run.com'),
    openGraph: {
        title: 'HINODE | 日の出と共に走る',
        description: '日の出と共に走り出すランナーたちのコミュニティ、HINODE。東京にいなくても、ひとりでも。「日の出に走る」習慣があれば、あなたはもうメンバー。水曜・日曜は東京でオープンランも開催。人との競争ではなく、自分との約束を守り続けるためのコミュニティです。',
        url: 'https://hinode-run.com',
        siteName: 'HINODE',
        locale: 'ja_JP',
        type: 'website',
        images: ['/assets/ogp-home.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'HINODE | 日の出と共に走る',
        description: '日の出と共に走り出すランナーたちのコミュニティ、HINODE。東京にいなくても、ひとりでも。「日の出に走る」習慣があれば、あなたはもうメンバー。水曜・日曜は東京でオープンランも開催。人との競争ではなく、自分との約束を守り続けるためのコミュニティです。',
        images: ['/assets/ogp-home.png'],
    },
};

export default function RootLayout({ children }) {
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
        <html lang="ja" className={`${outfit.variable} ${zenKaku.variable}`}>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body>
                <Header />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}
