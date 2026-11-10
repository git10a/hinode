import PressContent from '@/components/PressContent';
import { getRunCount } from '@/lib/runCount';
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl } from '@/lib/site';
import { getClubMemberCount } from '@/lib/strava';

export const revalidate = 900;

export const metadata = {
    title: 'プレスキット｜HINODE',
    description: 'HINODEプレスキット。基本情報・規模感・写真素材・お問い合わせ窓口をまとめたメディア向け資料。',
    openGraph: {
        title: 'プレスキット｜HINODE',
        description: 'HINODEプレスキット。基本情報・規模感・写真素材・お問い合わせ窓口をまとめたメディア向け資料。',
        url: absoluteUrl('/press'),
        siteName: SITE_NAME,
        locale: 'ja_JP',
        type: 'article',
        images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'プレスキット｜HINODE',
        description: 'HINODEプレスキット。メディア・記者・編集者の方へ。',
        images: [DEFAULT_OG_IMAGE],
    },
};

export default async function PressPage() {
    const [memberCount, runCount] = await Promise.all([
        getClubMemberCount(),
        getRunCount(),
    ]);
    return <PressContent memberCount={memberCount} runCount={runCount} />;
}
