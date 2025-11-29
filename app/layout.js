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
    description: '日の出と共に走る、東京のランニングコミュニティ。人との競争ではなく、自分との約束を守り続けるための場所。',
    metadataBase: new URL('https://hinode-run.com'),
    openGraph: {
        title: 'HINODE | 日の出と共に走る',
        description: '日の出と共に走る、東京のランニングコミュニティ。',
        url: 'https://hinode-run.com',
        siteName: 'HINODE',
        locale: 'ja_JP',
        type: 'website',
        images: ['/assets/ogp-home.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'HINODE | 日の出と共に走る',
        description: '日の出と共に走る、東京のランニングコミュニティ。',
        images: ['/assets/ogp-home.png'],
    },
};

export default function RootLayout({ children }) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "HINODE",
        "url": "https://hinode-run.com",
        "logo": "https://hinode-run.com/assets/logo-black.png",
        "description": "日の出と共に走る、東京のランニングコミュニティ。",
        "sameAs": [
            "https://www.instagram.com/hinode_run/",
            "https://twitter.com/hinode_run",
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
