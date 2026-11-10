import { SCHEDULE_SEASON } from './regularRuns.js';

// microCMSの記事本文は、通常期の開始時刻（平日6時半・日曜7時半）で書かれている。
// 公開時に、いまの季節（lib/regularRuns.js の SCHEDULE_SEASON）に合わせて時刻の記述だけを
// 読み替える。施設営業時間、走行ペース、京都の過去イベントなどは対象にしない。

// 季節に関係なく、常に適用する修正
const CORRECTIONS = {
    'kl53e9-e3_z': (post) => ({
        ...post,
        title: post.title?.replace('HINODEが紹介されます', 'HINODEが紹介されました'),
        content: post.content?.replace(
            '2026年8月2日（日）14時からBSテレ東で放送される「ランナーズサロン」で、東京の朝ランコミュニティHINODEを紹介していただきます。',
            '2026年8月2日（日）14時からBSテレ東で放送された「ランナーズサロン」で、東京の朝ランコミュニティHINODEを紹介していただきました。'
        ),
        publicUpdatedAt: '2026-08-04T00:00:00+09:00',
    }),
};

// サマータイム中: 通常期の時刻で書かれた記述を、夏季の時刻へ読み替える
const SUMMER_ADJUSTMENTS = {
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

// 通常期: 夏に書いた記事の「今はサマータイム」という説明だけを、通年で読める形に直す
const STANDARD_ADJUSTMENTS = {
    '4z58kl-91': (post) => ({
        ...post,
        content: post.content?.replace(
            '6月からはサマータイムとして集合を朝6:00開始にしています。',
            '通常は朝6:30開始で、6月からの夏季はサマータイムとして集合を朝6:00開始にしています。'
        ),
    }),
    'nn17elz-9f': (post) => ({
        ...post,
        content: post.content?.replace(
            '今は日の出が早い時期なので、サマータイムということで6時スタートにしています。',
            '日の出が早い夏の時期は、サマータイムということで6時スタートにしています。'
        ),
    }),
};

const SEASONAL_ADJUSTMENTS = {
    standard: STANDARD_ADJUSTMENTS,
    summer: SUMMER_ADJUSTMENTS,
};

// 夏季の読み替えは題名や本文の時刻が広く変わるので、読み替えを始めた日を更新日として出す。
// 通常期の2件は一文の言い回しだけなので、更新日は動かさない（一覧の並び順も変えない）。
const SEASON_UPDATED_AT = {
    summer: '2026-07-13T00:00:00+09:00',
};

export function normalizeBlogPostForSeason(post, season) {
    if (!post) return post;
    const corrected = CORRECTIONS[post.id]?.(post) ?? post;
    const adjust = SEASONAL_ADJUSTMENTS[season][post.id];
    if (!adjust) return corrected;
    const adjusted = adjust(corrected);
    const publicUpdatedAt = adjusted.publicUpdatedAt ?? SEASON_UPDATED_AT[season];
    return publicUpdatedAt ? { ...adjusted, publicUpdatedAt } : adjusted;
}

// Array.prototype.map にそのまま渡せるよう、引数は記事だけにしている
export function normalizeBlogPost(post) {
    return normalizeBlogPostForSeason(post, SCHEDULE_SEASON);
}
