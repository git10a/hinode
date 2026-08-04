// microCMSの過去記事に残る旧定例時間を、公開時だけ現在の時間へ正規化する。
// 施設営業時間、走行ペース、京都の過去イベントなどは対象にしない。
const NORMALIZERS = {
    '4z58kl-91': (post) => ({
        ...post,
        content: post.content?.replace(
            '6月からはサマータイムとして集合を朝6:00開始にしています。夏は暑くなるのが早く、走ったあとのシャワーや着替えの時間も取りやすいよう、少し早めに設定しています。',
            'HINODEの皇居ランは毎週水曜の朝6:00スタートです。夏は暑くなるのが早いため、走ったあとのシャワーや着替えの時間も取りやすい時間に設定しています。'
        ),
    }),
    'nn17elz-9f': (post) => ({
        ...post,
        content: post.content?.replace(
            'HINODEの目黒川グループランは、普段は木曜の朝6時半に集合しています。今は日の出が早い時期なので、サマータイムということで6時スタートにしています。時間は季節で動くので、最新の日程はStravaで確認してください。',
            'HINODEの目黒川グループランは、毎週木曜の朝6時に集合しています。時間通りに出発するため、開始5分前を目安にお集まりください。最新の日程はStravaで確認できます。'
        ),
    }),
    '16ubw89cq4': (post) => ({ ...post, content: post.content?.replace('HINODEの代々木公園ランで7時半から走って', 'HINODEの代々木公園ランで7時15分から走って') }),
    'vctaovxmrocx': (post) => ({ ...post, content: post.content?.replace('「水曜の朝6時半に必ず人がいる」', '「水曜の朝6時に必ず人がいる」') }),
    'dxjmqoqs5rz': (post) => ({ ...post, content: post.content?.replaceAll('7時半', '7時15分') }),
    '66n7fgwfkoz': (post) => ({ ...post, content: post.content?.replaceAll('7:30', '7:15') }),
    'i421thvit3u': (post) => ({ ...post, content: post.content?.replaceAll('6:30', '6:00') }),
    'kl53e9-e3_z': (post) => ({
        ...post,
        title: post.title?.replace('HINODEが紹介されます', 'HINODEが紹介されました'),
        content: post.content?.replace(
            '2026年8月2日（日）14時からBSテレ東で放送される「ランナーズサロン」で、東京の朝ランコミュニティHINODEを紹介していただきます。',
            '2026年8月2日（日）14時からBSテレ東で放送された「ランナーズサロン」で、東京の朝ランコミュニティHINODEを紹介していただきました。'
        ),
        publicUpdatedAt: '2026-08-04T00:00:00+09:00',
    }),
    'na6531kvbdg': (post) => ({
        ...post,
        title: post.title?.replaceAll('7時半', '7時15分'),
        description: post.description?.replaceAll('7時半', '7時15分'),
        content: post.content
            ?.replaceAll('7時半', '7時15分')
            .replaceAll('6時半', '6時')
            .replace('1時間うしろにずらして7時15分', '1時間15分うしろにずらして7時15分'),
    }),
    '1iyy3v9v5': (post) => ({
        ...post,
        title: post.title?.replaceAll('6時半', '6時'),
        description: post.description?.replaceAll('6時半', '6時'),
        content: post.content
            ?.replaceAll('6:30', '6:00')
            .replaceAll('6時半', '6時')
            .replace('真冬でも日が昇りはじめ、薄明るくなっています。', '季節によっては暗さが残るため、反射材やライトがあると安心です。')
            .replace('陽の光が差し込み始めて、視界は明るく、足元はクリアに見えます。', '季節によっては朝日が差し込み始め、夏場はすでに明るく、冬場は街灯のある道を走れます。')
            .replace('6時からスタートして皇居を1周すると、だいたい7時になります。', '6時からスタートして皇居を1周すると、だいたい6時30分になります。'),
    }),
};

const PUBLIC_SCHEDULE_UPDATE_AT = '2026-07-13T00:00:00+09:00';

export function normalizeBlogPost(post) {
    if (!post) return post;
    const normalize = NORMALIZERS[post.id];
    if (!normalize) return post;
    const normalized = normalize(post);
    return {
        ...normalized,
        publicUpdatedAt: normalized.publicUpdatedAt ?? PUBLIC_SCHEDULE_UPDATE_AT,
    };
}
