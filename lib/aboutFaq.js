import { PHOTOGRAPHY_POLICY } from './communityPolicy';
import { describeStartTimes, getRegularRun } from './regularRuns';
import { INSTAGRAM_URL, STRAVA_APP_LINK } from './site';
import { COMMUNITY_STATS } from './stats';

// Aboutページの「よくある質問」。画面の表示と構造化データ(FAQPage)の両方がここを読むので、
// 文言を直すのはここだけでよい。
// answer は文字列か、リンクを含む場合は「文字列 または { text, href }」の配列。
export const ABOUT_FAQ = [
    {
        question: '集合場所で誰もいなかったら？',
        answer: [
            '中止の告知がないかぎり、必ず誰かがいます。背中に「HINODE」と書かれた黒いTシャツを着た運営メンバーにお声がけください。雨の日など開催できない場合は ',
            { text: 'Strava', href: STRAVA_APP_LINK },
            ' / ',
            { text: 'Instagram', href: INSTAGRAM_URL },
            ' で前もって告知します。不安なことがあればいつでもご連絡ください。',
        ],
    },
    {
        question: 'どんな人が参加していますか？',
        answer: `25歳から35歳くらいの参加者が中心ですが、${COMMUNITY_STATS.ageRange}まで幅広い方が参加しています。`,
    },
    {
        question: '開始時間はいつですか？',
        answer: `${describeStartTimes()}スタートです。時間通りにスタートしますので、開始5分前を目安に集合してください。`,
    },
    {
        question: '日の出の時間はもっと早くありませんか？',
        answer: `はい、夏場は5時ごろに日の出を迎えます。日の出の瞬間だけでなく、朝の光の中を無理なく続けて走ることを大切にし、電車で来る方も参加しやすい時間にしています。日曜は近くのRuntrip BASEが7:00オープンのため、${getRegularRun('yoyogi').timeLabel}集合です。`,
    },
    {
        question: '何を持っていけばいいですか？',
        answer: '走れる服装とシューズだけで大丈夫です。荷物がある場合は、駅のロッカーに預けてから来る方もいます。',
    },
    {
        question: 'Stravaへの参加表明は必要ですか？',
        answer: [
            '必須ではありませんが、',
            { text: 'Strava', href: STRAVA_APP_LINK },
            ' で「参加」を押してもらえると他の人も参加しやすくなります。',
        ],
    },
    {
        question: '写真に写らなくても大丈夫ですか？',
        answer: `${PHOTOGRAPHY_POLICY.standard}${PHOTOGRAPHY_POLICY.reason}`,
    },
];

// 構造化データ用に、リンクを外したプレーンテキストへ直す
export function toPlainAnswer(answer) {
    if (typeof answer === 'string') return answer;
    return answer.map((part) => (typeof part === 'string' ? part : part.text)).join('');
}
