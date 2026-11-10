// 日本時間(JST)での日付計算と表示用フォーマット。
// サーバーのタイムゾーンに左右されないよう、時刻を9時間ずらしたDateを
// UTCメソッドで読む方式に統一している。

const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

export const DAY_LABELS_JP = ['日', '月', '火', '水', '木', '金', '土'];

function pad2(value) {
    return String(value).padStart(2, '0');
}

// UTCメソッドで読むとJSTの壁時計時刻になるDateを返す
function shiftToJst(dateInput) {
    return new Date(new Date(dateInput).getTime() + JST_OFFSET_MS);
}

export function getJstDateParts(dateInput = new Date()) {
    const jst = shiftToJst(dateInput);
    return {
        year: jst.getUTCFullYear(),
        monthIndex: jst.getUTCMonth(),
        day: jst.getUTCDate(),
        dayOfWeek: jst.getUTCDay(),
        hours: jst.getUTCHours(),
        minutes: jst.getUTCMinutes(),
    };
}

export function getJstDayOfWeek(dateInput) {
    return shiftToJst(dateInput).getUTCDay();
}

// 例: 8/2(日)
export function formatMonthDayJst(dateInput) {
    if (!dateInput) return null;
    const { monthIndex, day, dayOfWeek } = getJstDateParts(dateInput);
    return `${monthIndex + 1}/${day}(${DAY_LABELS_JP[dayOfWeek]})`;
}

// 例: 07:15
export function formatTimeJst(dateInput) {
    const date = new Date(dateInput);
    if (Number.isNaN(date.getTime())) return '';
    const { hours, minutes } = getJstDateParts(date);
    return `${pad2(hours)}:${pad2(minutes)}`;
}

// 例: 2026-08-02T07:15:00+09:00
export function formatIsoJst(dateInput) {
    const { year, monthIndex, day, hours, minutes } = getJstDateParts(dateInput);
    return `${year}-${pad2(monthIndex + 1)}-${pad2(day)}T${pad2(hours)}:${pad2(minutes)}:00+09:00`;
}

// 毎週 dayOfWeek の time（'HH:MM'・JST）に始まる予定の、次回の開始日時を返す。
// 当日は開始から durationMinutes が過ぎるまで「今日の回」を次回として扱う。
export function getNextWeeklyOccurrence({ dayOfWeek, time, durationMinutes = 0 }, now = new Date()) {
    const jstNow = shiftToJst(now);
    const [hours, minutes] = time.split(':').map(Number);
    const currentMinutes = jstNow.getUTCHours() * 60 + jstNow.getUTCMinutes();
    const startMinutes = hours * 60 + minutes;

    let daysUntil = dayOfWeek - jstNow.getUTCDay();
    if (daysUntil < 0) {
        daysUntil += 7;
    } else if (daysUntil === 0 && currentMinutes >= startMinutes + durationMinutes) {
        daysUntil = 7;
    }

    const startAsJstWallClock = Date.UTC(
        jstNow.getUTCFullYear(),
        jstNow.getUTCMonth(),
        jstNow.getUTCDate() + daysUntil,
        hours,
        minutes
    );
    return new Date(startAsJstWallClock - JST_OFFSET_MS);
}
