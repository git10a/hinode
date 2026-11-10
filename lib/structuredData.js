import { SITE_URL } from './site';

// items: [{ question, answer }]（answer はプレーンテキスト）
export function createFaqJsonLd(items) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map(({ question, answer }) => ({
            '@type': 'Question',
            name: question,
            acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
    };
}

// items: ホームに続くパンくず [{ name, path }]。先頭の「ホーム」は自動で付く。
export function createBreadcrumbJsonLd(items) {
    const trail = [{ name: 'ホーム', path: '' }, ...items];
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: trail.map(({ name, path }, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name,
            item: `${SITE_URL}${path}`,
        })),
    };
}
