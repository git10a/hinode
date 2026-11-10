import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalizeBlogPost, normalizeBlogPostForSeason } from '../lib/blogContentUpdates.js';
import { DAY_LABELS_JP } from '../lib/jstDate.js';
import { FIRST_CHOICE_RUN, REGULAR_RUNS, SCHEDULE_SEASON, describeStartTimes } from '../lib/regularRuns.js';

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
        standard: '水曜の皇居ランと木曜の目黒川ランは6:30、日曜の代々木公園ランは7:30',
        summer: '水曜の皇居ランと木曜の目黒川ランは6:00、日曜の代々木公園ランは7:15',
    };
    assert.equal(describeStartTimes(), expected[SCHEDULE_SEASON]);
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
