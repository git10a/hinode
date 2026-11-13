import test from 'node:test';
import assert from 'node:assert/strict';
import { aggregateByQuery, buildArticleReport, classifyQueries, getComparisonRanges, getDateRange, pickSiteUrl } from '../lib/searchConsole.js';

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

test('効果レポート: 直近の期間と、そのひとつ前の同じ長さの期間を出す', () => {
    assert.deepEqual(getComparisonRanges(28, new Date('2026-11-13T03:00:00Z')), {
        current: { startDate: '2026-10-14', endDate: '2026-11-10' },
        previous: { startDate: '2026-09-16', endDate: '2026-10-13' },
    });
});

test('効果レポート: 記事ごとに前の期間と並べ、狙うクエリは表示がなくても残す', () => {
    const current = [
        // 同じページでも、見出しへのリンクつきのURLは別の行で返ってくる
        row('皇居ラン 時間', '/blog/1iyy3v9v5', 6, 300, 4),
        row('皇居ラン 時間', '/blog/1iyy3v9v5#toc-2', 2, 100, 4),
        row('皇居ラン 早朝', '/blog/1iyy3v9v5', 2, 100, 9),
        row('皇居ラン ロッカー', '/blog/4z58kl-91', 50, 200, 1.2),
        row('hinode', '/', 9, 90, 1),
    ];
    const previous = [row('皇居ラン 時間', '/blog/1iyy3v9v5', 3, 300, 7)];
    const report = buildArticleReport(current, previous, {
        targets: { '1iyy3v9v5': ['時間 皇居ラン', '皇居ラン 時間帯'], 'winter-morning-run': ['冬 朝ラン 暗い'] },
        articles: [{ id: 'winter-morning-run', title: '冬の朝ラン', status: 'published', publishedAt: '2026-11-14T00:00:00Z' }],
    });

    // ブログ以外のページは含めない。クリックの多い順
    assert.deepEqual(report.map((article) => article.id), ['4z58kl-91', '1iyy3v9v5', 'winter-morning-run']);

    const kokyo = report[1];
    assert.equal(kokyo.clicks, 10);
    assert.equal(kokyo.impressions, 500);
    assert.equal(kokyo.position, 5);
    assert.equal(kokyo.previousClicks, 3);
    assert.equal(kokyo.previousPosition, 7);
    assert.deepEqual(kokyo.topQueries.map((entry) => entry.query), ['皇居ラン 時間', '皇居ラン 早朝']);
    assert.deepEqual(kokyo.targets, [
        { query: '時間 皇居ラン', shown: true, clicks: 8, impressions: 400, position: 4 },
        { query: '皇居ラン 時間帯', shown: false },
    ]);

    // 公開したばかりで、まだ検索に出ていない記事も一覧に残る
    const fresh = report[2];
    assert.equal(fresh.impressions, 0);
    assert.equal(fresh.title, '冬の朝ラン');
    assert.deepEqual(fresh.targets, [{ query: '冬 朝ラン 暗い', shown: false }]);
});
