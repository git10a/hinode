import test from 'node:test';
import assert from 'node:assert/strict';
import { aggregateByQuery, classifyQueries, getDateRange, pickSiteUrl } from '../lib/searchConsole.js';

const row = (query, page, clicks, impressions, position) => ({
    keys: [query, `https://hinode-run.com${page}`],
    clicks,
    impressions,
    position,
});

test('同じクエリの行をまとめ、順位は表示回数で重み付けする', () => {
    const [entry] = aggregateByQuery([
        row('皇居ラン 何キロ', '/blog/a', 3, 90, 4),
        row('皇居ラン 何キロ', '/courses/kokyo', 1, 10, 14),
    ]);

    assert.equal(entry.clicks, 4);
    assert.equal(entry.impressions, 100);
    assert.equal(entry.position, 5);
    assert.equal(entry.ctr, 0.04);
    assert.equal(entry.page, '/blog/a');
});

test('順位と指名検索でクエリを仕分け、表示回数の多い順に並べる', () => {
    const groups = classifyQueries(aggregateByQuery([
        row('目黒川 ランニング', '/courses/megurogawa', 2, 40, 8),
        row('朝ラン 服装 冬', '/blog/b', 0, 120, 22),
        row('朝ラン 続かない', '/blog/c', 0, 60, 31),
        row('皇居ラン 何時から', '/blog/d', 9, 50, 2),
        row('hinode ランニング', '/', 20, 30, 1),
        row('表示が少ないクエリ', '/', 0, 3, 9),
    ]));

    assert.deepEqual(groups.rewrite.map((entry) => entry.query), ['目黒川 ランニング']);
    assert.deepEqual(groups.newPost.map((entry) => entry.query), ['朝ラン 服装 冬', '朝ラン 続かない']);
    assert.deepEqual(groups.keep.map((entry) => entry.query), ['皇居ラン 何時から']);
    assert.deepEqual(groups.brand.map((entry) => entry.query), ['hinode ランニング']);
});

test('ドメインプロパティを優先し、未確認のプロパティは選ばない', () => {
    assert.equal(pickSiteUrl([
        { siteUrl: 'https://hinode-run.com/', permissionLevel: 'siteRestrictedUser' },
        { siteUrl: 'sc-domain:hinode-run.com', permissionLevel: 'siteRestrictedUser' },
        { siteUrl: 'sc-domain:example.com', permissionLevel: 'siteOwner' },
    ]), 'sc-domain:hinode-run.com');

    assert.equal(pickSiteUrl([
        { siteUrl: 'sc-domain:hinode-run.com', permissionLevel: 'siteUnverifiedUser' },
    ]), null);
});

test('集計の遅れを見込んで、直近3日を除いた期間にする', () => {
    assert.deepEqual(getDateRange(28, new Date('2026-11-13T03:00:00Z')), {
        startDate: '2026-10-14',
        endDate: '2026-11-10',
    });
});
