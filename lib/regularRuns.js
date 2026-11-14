import { DAY_LABELS_JP, getNextWeeklyOccurrence } from './jstDate.js';

// 定例ランの情報源。曜日・開始時刻・集合場所はここだけに書く。
//
// 開始時刻は季節で切り替わる（夏季はサマータイム）。切り替えるときは SCHEDULE_SEASON を
// 変えるだけで、トップ・日程・拠点ページ・コースガイド・FAQなどの本文・構造化データ・
// ブログ記事の時刻補正（lib/blogContentUpdates.js）まで連動する。
// 連動しないのは静的ファイル（press-kit.md / public/hinode-press-kit.md / public/llms.txt）
// だけ。`npm test` を実行すると、直し忘れを検出できる。
export const SCHEDULE_SEASON = 'standard'; // 'standard'（通常期） | 'summer'（サマータイム）

// 開始からこの時間が過ぎるまでは、当日の回を「次回」として表示する
export const RUN_DURATION_MINUTES = 60;

const SHARED_DETAILS = {
    citySlug: 'tokyo',
    pace: '会話できるペース（1km 6〜7分台が目安）',
    host: 'HINODE運営メンバー',
    photography: '参加者の撮影なし',
    firstJoin: '開始5分前に集合場所へ。背中に「HINODE」と書かれた黒いTシャツを着た運営メンバーが目印です。',
};

const RUN_DEFINITIONS = [
    {
        id: 'kokyo',
        name: '皇居ラン',
        place: '皇居',
        dayOfWeek: 3,
        startTimes: { standard: '06:30', summer: '06:00' },
        meetingPlace: '桔梗門前派出所',
        meetingShort: '桔梗門派出所前',
        distance: '約5km',
        image: '/assets/Kokyo.jpg',
        titlePattern: /皇居/,
    },
    {
        id: 'meguro',
        name: '目黒川ラン',
        place: '目黒川',
        dayOfWeek: 4,
        startTimes: { standard: '06:30', summer: '06:00' },
        meetingPlace: 'スターバックス 中目黒蔦屋書店前',
        meetingShort: '中目黒駅スタバ前',
        distance: '約4km',
        image: '/assets/Meguro.jpg',
        titlePattern: /目黒/,
    },
    {
        id: 'yoyogi',
        name: '代々木公園ラン',
        place: '代々木公園',
        dayOfWeek: 0,
        startTimes: { standard: '07:30', summer: '07:15' },
        meetingPlace: '原宿時計塔前',
        meetingShort: '原宿時計塔前',
        distance: '約2〜4km',
        image: '/assets/Yoyogi.jpg',
        titlePattern: /代々木/,
        recommendationLabel: '初参加におすすめ',
        isFirstChoice: true,
    },
    {
        id: 'komazawa',
        name: '駒沢公園ラン',
        place: '駒沢公園',
        dayOfWeek: 0,
        startTimes: { standard: '07:30', summer: '07:15' },
        meetingPlace: '駒沢オリンピック公園 トレーニングルーム前',
        meetingShort: 'トレーニングルーム前',
        distance: '約4km（2周）',
        distanceNote: 'きつければ1周や半周で止めても大丈夫です',
        image: '/assets/komazawa.jpg',
        titlePattern: /駒沢/,
        // 初回の開催日（JST）。この日より前の回は「次回」として出さない
        startsOn: '2026-11-22',
        // Lumaにはイベントを立てていない。立てたらこの行を消す
        onLuma: false,
    },
];

// 日程ページで直近の開催予定が並ぶ位置
const SCHEDULE_HREF = '/schedule#event-calendar';

function formatStartsOn(startsOn, dayOfWeek) {
    const [year, month, day] = startsOn.split('-').map(Number);
    return `${year}年${month}月${day}日（${DAY_LABELS_JP[dayOfWeek]}）`;
}

export const REGULAR_RUNS = RUN_DEFINITIONS.map(({ startTimes, ...run }) => {
    const dayShort = `${DAY_LABELS_JP[run.dayOfWeek]}曜`;
    const timeRaw = startTimes[SCHEDULE_SEASON];
    // 文章に埋め込むときの表記（例: 6:30）
    const timeLabel = timeRaw.replace(/^0/, '');
    return {
        ...SHARED_DETAILS,
        ...run,
        // 例: 2026年11月22日（日）
        startsOnLabel: run.startsOn ? formatStartsOn(run.startsOn, run.dayOfWeek) : null,
        day: `毎週${dayShort}`,
        dayShort,
        timeRaw,
        timeLabel,
        time: `${timeRaw}〜`,
        // 例: 日曜7:30
        dayTimeLabel: `${dayShort}${timeLabel}`,
        scheduleHref: SCHEDULE_HREF,
        detailHref: `/locations/${run.id}`,
    };
});

export const FIRST_CHOICE_RUN = REGULAR_RUNS.find((run) => run.isFirstChoice);

export function getRegularRun(id) {
    return REGULAR_RUNS.find((run) => run.id === id);
}

// Stravaに次回イベントが無いときのフォールバックに使う、次回の開始日時
// 開始日（startsOn）がまだ先の定例ランは、開始日の回を返す。
export function getNextRunStart(run, now = new Date()) {
    const firstDay = run.startsOn ? new Date(`${run.startsOn}T00:00:00+09:00`) : null;
    return getNextWeeklyOccurrence(
        { dayOfWeek: run.dayOfWeek, time: run.timeRaw, durationMinutes: RUN_DURATION_MINUTES },
        firstDay > now ? firstDay : now
    );
}

// Stravaのイベントが、どの定例ランの回かを返す。日曜のように同じ曜日に2拠点あるときは、
// イベント名に入っている場所（titlePattern）で見分ける。場所が読み取れないイベントは、
// その曜日で先に定義した定例ランの回として扱う。定例の曜日でなければ null。
export function getRunForEvent(event) {
    const sameDayRuns = REGULAR_RUNS.filter((run) => run.dayOfWeek === event?.dayOfWeek);
    return sameDayRuns.find((run) => run.titlePattern.test(event.title || '')) || sameDayRuns[0] || null;
}

// Stravaの直近イベント（開始日時順）から、その定例ランの回にあたる最初の1件を返す
export function findUpcomingEventForRun(events, run) {
    return events.find((event) => getRunForEvent(event)?.id === run.id) || null;
}

// 平日開催の回の開始時刻（例: 6:30）。「平日6:30の回」のような文章に使う。
export const WEEKDAY_TIME_LABEL = [
    ...new Set(REGULAR_RUNS.filter((run) => run.dayOfWeek >= 1 && run.dayOfWeek <= 5).map((run) => run.timeLabel)),
].join('・');

// 例: 水曜の皇居ランと木曜の目黒川ランは6:30、日曜の代々木公園ランと駒沢公園ランは7:30
// 開始時刻が同じ回は「と」でまとめる。曜日も同じなら、曜日は最初の1回だけ書く。
export function describeStartTimes() {
    const groups = [];
    for (const run of REGULAR_RUNS) {
        const last = groups.at(-1);
        if (last?.timeLabel === run.timeLabel) last.runs.push(run);
        else groups.push({ timeLabel: run.timeLabel, runs: [run] });
    }
    return groups
        .map(({ timeLabel, runs }) => {
            const names = runs.map((run, index) => (
                runs[index - 1]?.dayOfWeek === run.dayOfWeek ? run.name : `${run.dayShort}の${run.name}`
            ));
            return `${names.join('と')}は${timeLabel}`;
        })
        .join('、');
}
