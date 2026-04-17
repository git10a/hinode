import PressContent from '../../components/PressContent';

export const metadata = {
    title: 'プレスキット｜HINODE',
    description: 'HINODEプレスキット。基本情報・規模感・取材の切り口・代表者プロフィール・写真素材・お問い合わせ窓口をまとめたメディア向け資料。',
    openGraph: {
        title: 'プレスキット｜HINODE',
        description: 'HINODEプレスキット。基本情報・取材の切り口・代表者プロフィールをまとめたメディア向け資料。',
        url: 'https://hinode-run.com/press',
        siteName: 'HINODE',
        locale: 'ja_JP',
        type: 'article',
        images: ['/assets/ogp-home.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'プレスキット｜HINODE',
        description: 'HINODEプレスキット。メディア・記者・編集者の方へ。',
        images: ['/assets/ogp-home.png'],
    },
};

export default function PressPage() {
    return <PressContent />;
}
