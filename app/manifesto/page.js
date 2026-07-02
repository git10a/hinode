import ManifestoContent from '../../components/ManifestoContent';

export const metadata = {
    title: 'マニフェスト｜HINODE',
    description: '人との競争ではなく、自分との約束を守り続けるためのコミュニティ。HINODEの思想・ポジショニングを定義した公式マニフェスト。',
    robots: {
        index: false,
        follow: true,
    },
    openGraph: {
        title: 'マニフェスト｜HINODE',
        description: '人との競争ではなく、自分との約束を守り続けるためのコミュニティ。HINODEの思想・ポジショニングを定義した公式マニフェスト。',
        url: 'https://hinode-run.com/manifesto',
        siteName: 'HINODE',
        locale: 'ja_JP',
        type: 'article',
        images: ['/assets/ogp-home.jpg'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'マニフェスト｜HINODE',
        description: '人との競争ではなく、自分との約束を守り続けるためのコミュニティ。',
        images: ['/assets/ogp-home.jpg'],
    },
};

export default function ManifestoPage() {
    return <ManifestoContent />;
}
