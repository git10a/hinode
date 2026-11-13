#!/usr/bin/env node
// Google サジェストから記事ネタの候補を出し、Search Console の実績と突き合わせる。
//   npm run suggest                          既定の種＋季節の種
//   npm run suggest -- "朝ラン 冬" "皇居ラン"   種を指定する
//   npm run suggest -- --deep                 候補をもう一段広げる（時間がかかる）
//   npm run suggest -- --json                 JSONで出す
import { parseArgs } from 'node:util';
import { SEED_KEYWORDS, classifySuggestions, collectSuggestions, getSeasonSeeds } from '../lib/keywordSuggest.js';
import { fetchQueryStats } from '../lib/searchConsole.js';

try {
    process.loadEnvFile('.env.local');
} catch {
    // .env.local が無ければ、シェルの環境変数だけで動かす
}

const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
        deep: { type: 'boolean', default: false },
        days: { type: 'string', default: '90' },
        json: { type: 'boolean', default: false },
    },
});

function groupBySeed(entries) {
    const bySeed = new Map();
    for (const entry of entries) {
        bySeed.set(entry.seed, [...(bySeed.get(entry.seed) || []), entry.query]);
    }
    return [...bySeed].map(([seed, queries]) => `**${seed}**\n${queries.map((query) => `- ${query}`).join('\n')}`).join('\n\n');
}

function rankedTable(entries) {
    if (!entries.length) return '（該当なし）';
    const rows = entries.map((entry) => `| ${entry.query} | ${entry.impressions} | ${entry.position.toFixed(1)} | ${entry.page} |`);
    return `| クエリ | 表示 | 順位 | 受け皿ページ |\n|---|--:|--:|---|\n${rows.join('\n')}`;
}

function renderReport({ seeds, groups, days, hasStats }) {
    const statsNote = hasStats
        ? `Search Console の直近${days}日と突き合わせ済み。`
        : 'Search Console に接続できなかったため、既存ページとの突き合わせはしていません。';

    return `# キーワード候補（Google サジェスト）

種: ${seeds.join(' / ')}
${statsNote}

## 新記事の候補（サイトがまだほとんど表示されていないクエリ）
${groups.newTopic.length ? groupBySeed(groups.newTopic) : '（該当なし）'}

## 既存ページの改善候補（表示はあるが3位より下）
${rankedTable(groups.improve)}

## 対応済み（3位以内）
${rankedTable(groups.covered)}

## 優先度低（商品・比較系、他地域、掲示板探し）
${groups.lowPriority.map((entry) => entry.query).join(' / ') || '（該当なし）'}
`;
}

try {
    const seeds = positionals.length ? positionals : [...SEED_KEYWORDS, ...getSeasonSeeds()];
    const days = Number(values.days);
    const [suggestions, queryStats] = await Promise.all([
        collectSuggestions(seeds, { deep: values.deep }),
        fetchQueryStats({ days }).catch((error) => {
            console.error(`Search Console を読めませんでした: ${error.message}`);
            return null;
        }),
    ]);
    const groups = classifySuggestions(suggestions, queryStats || []);

    console.log(values.json
        ? JSON.stringify({ seeds, groups }, null, 2)
        : renderReport({ seeds, groups, days, hasStats: Boolean(queryStats) }));
} catch (error) {
    console.error(error.message);
    process.exit(1);
}
