import ManifestoContent from '@/components/ManifestoContent';
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from '@/lib/site';

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
        url: absoluteUrl('/manifesto'),
        siteName: SITE_NAME,
        locale: 'ja_JP',
        type: 'article',
        images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'マニフェスト｜HINODE',
        description: '人との競争ではなく、自分との約束を守り続けるためのコミュニティ。',
        images: [DEFAULT_OG_IMAGE],
    },
};

export default function ManifestoPage() {
    return <ManifestoContent />;
}
