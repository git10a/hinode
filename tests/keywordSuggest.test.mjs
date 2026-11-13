import test from 'node:test';
import assert from 'node:assert/strict';
import { classifySuggestions, getSeasonSeeds, toQueryKey } from '../lib/keywordSuggest.js';

test('語順・空白・大文字小文字が違っても同じクエリとして扱う', () => {
    assert.equal(toQueryKey('冬 朝ラン 服装'), toQueryKey('朝ラン　服装  冬'));
    assert.equal(toQueryKey('HINODE ランニング'), toQueryKey('ランニング hinode'));
    assert.notEqual(toQueryKey('朝ラン 冬'), toQueryKey('朝ラン 夏'));
});

test('サジェストを Search Console の実績で仕分ける', () => {
    const suggestions = [
        { query: '冬 朝ラン 暗い', seed: '朝ラン 冬' },
        { query: '目黒川 ランニング 距離', seed: '目黒川 ランニング' },
        { query: 'ロッカー 皇居ラン', seed: '皇居ラン' },
        { query: 'ランニング 冬 服装 ユニクロ', seed: 'ランニング 冬' },
        { query: 'ランニング 仲間 大阪', seed: 'ランニング 仲間' },
        { query: 'ランニング 初心者 服装', seed: 'ランニング 初心者' },
    ];
    const queryStats = [
        { query: '目黒川 ランニング 距離', impressions: 120, position: 6.2, page: '/courses/megurogawa' },
        { query: '皇居ラン ロッカー', impressions: 3592, position: 1.3, page: '/blog/4z58kl-91' },
        { query: 'ランニング 冬 服装 ユニクロ', impressions: 50, position: 40, page: '/blog/x' },
        // 表示1回で3位。たまたま出ただけなので「対応済み」にはしない
        { query: 'ランニング 初心者 服装', impressions: 1, position: 3, page: '/blog/y' },
    ];

    const groups = classifySuggestions(suggestions, queryStats);

    assert.deepEqual(groups.newTopic.map((entry) => entry.query), ['冬 朝ラン 暗い', 'ランニング 初心者 服装']);
    assert.deepEqual(groups.improve, [{
        query: '目黒川 ランニング 距離',
        seed: '目黒川 ランニング',
        impressions: 120,
        position: 6.2,
        page: '/courses/megurogawa',
    }]);
    assert.deepEqual(groups.covered.map((entry) => entry.query), ['ロッカー 皇居ラン']);
    assert.deepEqual(groups.lowPriority.map((entry) => entry.query), ['ランニング 冬 服装 ユニクロ', 'ランニング 仲間 大阪']);
});

test('季節の種は、今の季節と2か月先の季節を含む', () => {
    assert.deepEqual(getSeasonSeeds(new Date(2026, 10, 13)), [
        '朝ラン 秋', 'ランニング 秋', '早朝 ランニング 秋',
        '朝ラン 冬', 'ランニング 冬', '早朝 ランニング 冬',
    ]);
    assert.deepEqual(getSeasonSeeds(new Date(2027, 0, 10)), [
        '朝ラン 冬', 'ランニング 冬', '早朝 ランニング 冬',
        '朝ラン 春', 'ランニング 春', '早朝 ランニング 春',
    ]);
});
