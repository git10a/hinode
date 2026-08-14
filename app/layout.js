import { Outfit } from 'next/font/google';
import Script from 'next/script';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './globals.css';

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-en',
    display: 'swap',
});

const siteTitle = 'HINODE｜日の出とともに、競争しない朝をつづける';
const siteDescription = 'HINODEは東京・京都で活動する朝ランコミュニティ。参加無料・予約不要・競争なし。通常開催では参加者を撮影しません。';

export const metadata = {
    title: siteTitle,
    description: siteDescription,
    metadataBase: new URL('https://hinode-run.com'),
    // './' はmetadataBase + 現在のルートパスに解決されるため、
    // 個別に指定しないページにもページ自身のcanonical / og:urlが付く
    alternates: {
        canonical: './',
    },
    openGraph: {
        title: siteTitle,
        description: siteDescription,
        url: './',
        siteName: 'HINODE',
        locale: 'ja_JP',
        type: 'website',
        images: ['/assets/ogp-home.jpg'],
    },
    twitter: {
        card: 'summary_large_image',
        title: siteTitle,
        description: siteDescription,
        images: ['/assets/ogp-home.jpg'],
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
        "@id": "https://hinode-run.com/#organization",
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
        <html lang="ja" className={outfit.variable}>
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
