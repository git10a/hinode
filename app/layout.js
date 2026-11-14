import { Outfit } from 'next/font/google';
import Script from 'next/script';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import JsonLd from '@/components/JsonLd';
import {
    DEFAULT_OG_IMAGE,
    GA_MEASUREMENT_ID,
    ORGANIZATION_ID,
    SITE_NAME,
    SITE_URL,
    SOCIAL_LINKS,
    absoluteUrl,
} from '@/lib/site';
import './globals.css';

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-en',
    display: 'swap',
});

const siteTitle = 'HINODE｜東京の朝ランコミュニティ｜初心者・ひとり参加歓迎';
const siteDescription = 'HINODEは東京の朝ラン・ランニングコミュニティ。皇居・目黒川・代々木公園・駒沢公園で毎週、日の出の時間にゆっくり走ります。予約不要・参加無料・1人参加OK。朝活として誰かと気軽に走りたい方へ。';

export const metadata = {
    title: siteTitle,
    description: siteDescription,
    metadataBase: new URL(SITE_URL),
    // './' はmetadataBase + 現在のルートパスに解決されるため、
    // 個別に指定しないページにもページ自身のcanonical / og:urlが付く
    alternates: {
        canonical: './',
    },
    openGraph: {
        title: siteTitle,
        description: siteDescription,
        url: './',
        siteName: SITE_NAME,
        locale: 'ja_JP',
        type: 'website',
        images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
        card: 'summary_large_image',
        title: siteTitle,
        description: siteDescription,
        images: [DEFAULT_OG_IMAGE],
    },
    icons: {
        icon: '/favicon.png',
        apple: '/favicon.png',
    },
};

// 各ページの構造化データから @id で参照される、サイト全体の組織情報
const ORGANIZATION_JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'SportsClub',
    '@id': ORGANIZATION_ID,
    name: SITE_NAME,
    alternateName: ['日の出ラン', 'HINODE Running Club', 'HINODE Tokyo'],
    description: siteDescription,
    url: `${SITE_URL}/`,
    logo: absoluteUrl('/assets/logo-black.png'),
    foundingDate: '2025-11',
    areaServed: {
        '@type': 'City',
        name: 'Tokyo',
    },
    sport: 'Running',
    sameAs: SOCIAL_LINKS.map((link) => link.href),
};

export default function RootLayout({ children }) {
    return (
        <html lang="ja" className={outfit.variable}>
            <head>
                <JsonLd data={ORGANIZATION_JSON_LD} />
            </head>
            <body>
                <Header />
                <main>{children}</main>
                <Footer />
                <Script
                    src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${GA_MEASUREMENT_ID}');
                    `}
                </Script>
            </body>
        </html>
    );
}
