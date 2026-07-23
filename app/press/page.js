import PressContent from '../../components/PressContent';
import { getClubMemberCount } from '../../lib/strava';
import { getRunCount } from '../../lib/runCount';

export const revalidate = 900;

export const metadata = {
    title: 'プレスキット｜HINODE',
    description: 'HINODEプレスキット。基本情報・規模感・写真素材・お問い合わせ窓口をまとめたメディア向け資料。',
    openGraph: {
        title: 'プレスキット｜HINODE',
        description: 'HINODEプレスキット。基本情報・規模感・写真素材・お問い合わせ窓口をまとめたメディア向け資料。',
        url: 'https://hinode-run.com/press',
        siteName: 'HINODE',
        locale: 'ja_JP',
        type: 'article',
        images: ['/assets/ogp-home.jpg'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'プレスキット｜HINODE',
        description: 'HINODEプレスキット。メディア・記者・編集者の方へ。',
        images: ['/assets/ogp-home.jpg'],
    },
};

export default async function PressPage() {
    const [memberCount, runCount] = await Promise.all([
        getClubMemberCount(),
        getRunCount(),
    ]);
    return <PressContent memberCount={memberCount} runCount={runCount} />;
}
