import JsonLd from '@/components/JsonLd';
import RunningCourseContent from '@/components/RunningCourseContent';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/site';

export const metadata = {
    title: '日の出スポット | HINODE',
    description: '日の出が美しく見えるスポットを紹介。東京の朝を感じる場所へ。',
    robots: {
        index: false,
        follow: true,
    },
    openGraph: {
        title: '日の出スポット | HINODE',
        description: '日の出が美しく見えるスポットを紹介。東京の朝を感じる場所へ。',
        url: absoluteUrl('/hinode-spot'),
        siteName: SITE_NAME,
        locale: 'ja_JP',
        type: 'website',
        images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
        card: 'summary_large_image',
        title: '日の出スポット | HINODE',
        description: '日の出が美しく見えるスポットを紹介。',
    },
};

const PAGE_JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: '日の出スポット',
    description: '日の出が美しく見えるスポットを紹介',
    url: absoluteUrl('/hinode-spot'),
    isPartOf: {
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
    },
};

export default function HinodeSpot() {
    return (
        <section>
            <JsonLd data={PAGE_JSON_LD} />
            <RunningCourseContent />
        </section>
    );
}
