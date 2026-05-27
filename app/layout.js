import { Outfit, Zen_Kaku_Gothic_New } from 'next/font/google';
import Script from 'next/script';
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

const siteTitle = 'HINODE｜東京の朝ランコミュニティ｜初心者・ひとり参加歓迎';
const siteDescription = 'HINODEは東京の朝ラン・ランニングコミュニティ。皇居・目黒川・代々木公園で毎週、日の出の時間にゆっくり走ります。予約不要・参加無料・1人参加OK。朝活として誰かと気軽に走りたい方へ。';

export const metadata = {
    title: siteTitle,
    description: siteDescription,
    metadataBase: new URL('https://hinode-run.com'),
    openGraph: {
        title: siteTitle,
        description: siteDescription,
        url: 'https://hinode-run.com',
        siteName: 'HINODE',
        locale: 'ja_JP',
        type: 'website',
        images: ['/assets/ogp-home.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: siteTitle,
        description: siteDescription,
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
        "description": siteDescription,
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
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-CDCR6WTVNQ"
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-CDCR6WTVNQ');
                    `}
                </Script>
            </body>
        </html>
    );
}
