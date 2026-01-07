import RunningCourseContent from '../../components/RunningCourseContent';

export const metadata = {
    title: '日の出スポット | HINODE',
    description: '日の出が美しく見えるスポットを紹介。東京の朝を感じる場所へ。',
    openGraph: {
        title: '日の出スポット | HINODE',
        description: '日の出が美しく見えるスポットを紹介。東京の朝を感じる場所へ。',
        url: 'https://hinode-run.com/hinode-spot',
        siteName: 'HINODE',
        locale: 'ja_JP',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: '日の出スポット | HINODE',
        description: '日の出が美しく見えるスポットを紹介。',
    },
};

export default function HinodeSpot() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "日の出スポット",
        "description": "日の出が美しく見えるスポットを紹介",
        "url": "https://hinode-run.com/hinode-spot",
        "isPartOf": {
            "@type": "WebSite",
            "name": "HINODE",
            "url": "https://hinode-run.com"
        }
    };

    return (
        <section>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <RunningCourseContent />
        </section>
    );
}

