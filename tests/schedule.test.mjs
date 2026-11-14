import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalizeBlogPost, normalizeBlogPostForSeason } from '../lib/blogContentUpdates.js';
import { DAY_LABELS_JP } from '../lib/jstDate.js';
import {
    FIRST_CHOICE_RUN,
    REGULAR_RUNS,
    SCHEDULE_SEASON,
    describeStartTimes,
    findUpcomingEventForRun,
    getRegularRun,
    getNextRunStart,
    getRunForEvent,
} from '../lib/regularRuns.js';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

// 静的ファイルは lib/regularRuns.js と連動しない。季節の切り替え（SCHEDULE_SEASON）で
// 開始時刻が変わったとき、直し忘れたファイルをここで検出する。
for (const file of ['press-kit.md', 'public/hinode-press-kit.md']) {
    test(`${file}: 開催表の時刻が定例ランと一致する`, () => {
        const text = read(file);
        for (const run of REGULAR_RUNS) {
            const row = `| ${DAY_LABELS_JP[run.dayOfWeek]} | ${run.timeLabel}〜 | ${run.place} |`;
            assert.ok(text.includes(row), `「${row}」の行がありません`);
        }
    });
}

test('public/llms.txt: 定期開催の時刻が定例ランと一致する', () => {
    const text = read('public/llms.txt');
    for (const run of REGULAR_RUNS) {
        const line = `- ${run.day} ${run.timeRaw}: ${run.place}（`;
        assert.ok(text.includes(line), `「${line}…」の行がありません`);
    }
    const guidance = `${FIRST_CHOICE_RUN.dayTimeLabel}の${FIRST_CHOICE_RUN.name}を第一候補`;
    assert.ok(text.includes(guidance), `「${guidance}」の案内がありません`);
});

test('開始時刻が同じ回をまとめて説明する', () => {
    const expected = {
        standard: '水曜の皇居ランと木曜の目黒川ランは6:30、日曜の代々木公園ランと駒沢公園ランは7:30',
        summer: '水曜の皇居ランと木曜の目黒川ランは6:00、日曜の代々木公園ランと駒沢公園ランは7:15',
    };
    assert.equal(describeStartTimes(), expected[SCHEDULE_SEASON]);
});

test('日曜の2拠点は、イベント名の場所で見分ける', () => {
    const yoyogi = getRegularRun('yoyogi');
    const komazawa = getRegularRun('komazawa');
    const events = [
        { eventId: '1', title: 'HINODE 代々木公園ラン', dayOfWeek: 0 },
        { eventId: '2', title: 'HINODE 駒沢公園ラン', dayOfWeek: 0 },
        { eventId: '3', title: 'HINODE 皇居ラン', dayOfWeek: 3 },
    ];
    assert.equal(findUpcomingEventForRun(events, yoyogi).eventId, '1');
    assert.equal(findUpcomingEventForRun(events, komazawa).eventId, '2');
    assert.equal(findUpcomingEventForRun(events, getRegularRun('kokyo')).eventId, '3');
});

test('場所が読み取れない日曜のイベントは代々木公園の回として扱い、駒沢には割り当てない', () => {
    const events = [{ eventId: '1', title: 'HINODE Sunday Run', dayOfWeek: 0 }];
    assert.equal(getRunForEvent(events[0]).id, 'yoyogi');
    assert.equal(findUpcomingEventForRun(events, getRegularRun('komazawa')), null);
    assert.equal(getRunForEvent({ title: '企画ラン', dayOfWeek: 6 }), null);
});

test('開始日が先の定例ランは、開始日の回を次回として返す', () => {
    const komazawa = getRegularRun('komazawa');
    assert.equal(new Date(`${komazawa.startsOn}T00:00:00+09:00`).getUTCDay(), 6, '開始日は日曜（JST）にする');
    assert.equal(komazawa.startsOnLabel, '2026年11月22日（日）');

    const startOf = (now) => getNextRunStart(komazawa, new Date(now)).toISOString();
    const first = new Date(`2026-11-22T${komazawa.timeRaw}:00+09:00`).toISOString();
    const second = new Date(`2026-11-29T${komazawa.timeRaw}:00+09:00`).toISOString();
    // 開始日より前は、手前の日曜（11/15）を飛ばして初回を返す
    assert.equal(startOf('2026-11-14T12:00:00+09:00'), first);
    assert.equal(startOf('2026-11-21T23:00:00+09:00'), first);
    // 開始日を過ぎたら、ほかの定例ランと同じく次の日曜へ進む
    assert.equal(startOf('2026-11-22T12:00:00+09:00'), second);

    // 開始日を持たない定例ランは、これまでどおり直近の回を返す
    const yoyogi = getRegularRun('yoyogi');
    assert.equal(
        getNextRunStart(yoyogi, new Date('2026-11-14T12:00:00+09:00')).toISOString(),
        new Date(`2026-11-15T${yoyogi.timeRaw}:00+09:00`).toISOString()
    );
});

test('ブログ記事の時刻は、サマータイム中だけ夏季の時刻へ読み替える', () => {
    const post = { id: 'dxjmqoqs5rz', content: '集合は7時半、原宿時計塔前。' };
    assert.equal(normalizeBlogPostForSeason(post, 'standard'), post);
    assert.equal(normalizeBlogPostForSeason(post, 'summer').content, '集合は7時15分、原宿時計塔前。');
    assert.deepEqual(normalizeBlogPost(post), normalizeBlogPostForSeason(post, SCHEDULE_SEASON));
});

test('読み替えの対象でない記事は、どの季節でもそのまま返す', () => {
    const post = { id: 'not-listed', content: '朝6時半に集合' };
    assert.equal(normalizeBlogPostForSeason(post, 'standard'), post);
    assert.equal(normalizeBlogPostForSeason(post, 'summer'), post);
    assert.equal(normalizeBlogPostForSeason(null, 'summer'), null);
});
