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
    title: 'HINODE｜東京の朝ランコミュニティ｜皇居・目黒川・代々木公園',
    description: 'HINODEは、東京で日の出とともに走る朝ランコミュニティ。皇居（水曜）・目黒川（木曜）・代々木公園（日曜）で週3回開催。参加無料・予約不要・1人参加OK。',
    metadataBase: new URL('https://hinode-run.com'),
    openGraph: {
        title: 'HINODE｜東京の朝ランコミュニティ｜皇居・目黒川・代々木公園',
        description: 'HINODEは、東京で日の出とともに走る朝ランコミュニティ。皇居（水曜）・目黒川（木曜）・代々木公園（日曜）で週3回開催。参加無料・予約不要・1人参加OK。',
        url: 'https://hinode-run.com',
        siteName: 'HINODE',
        locale: 'ja_JP',
        type: 'website',
        images: ['/assets/ogp-home.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'HINODE｜東京の朝ランコミュニティ｜皇居・目黒川・代々木公園',
        description: 'HINODEは、東京で日の出とともに走る朝ランコミュニティ。皇居（水曜）・目黒川（木曜）・代々木公園（日曜）で週3回開催。参加無料・予約不要・1人参加OK。',
        images: ['/assets/ogp-home.png'],
    },
    icons: {
        icon: '/favicon.png',
        apple: '/favicon.png',
    },
};

export default function RootLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SportsClub",
        "name": "HINODE",
        "alternateName": ["日の出ラン", "HINODE Running Club", "HINODE Tokyo"],
        "description": "東京で日の出とともに走る朝ランコミュニティ。皇居・目黒川・代々木公園で週3回開催。参加無料・予約不要。",
        "url": "https://hinode-run.com/",
        "logo": "https://hinode-run.com/assets/logo-black.png",
        "foundingDate": "2025-11",
        "areaServed": {
            "@type": "City",
            "name": "Tokyo"
        },
        "sport": "Running",
        "sameAs": [
            "https://www.instagram.com/hinode_run/",
            "https://www.strava.com/clubs/hinode"
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
