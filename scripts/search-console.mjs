#!/usr/bin/env node
// Search Console の検索クエリを、記事ネタの候補として一覧する。
//   npm run gsc                 直近28日
//   npm run gsc -- --days 90    期間を変える
//   npm run gsc -- --min 30     表示回数の下限を変える（既定10）
//   npm run gsc -- --json       JSONで出す
import { parseArgs } from 'node:util';
import { fetchSearchConsoleReport } from '../lib/searchConsole.js';

try {
    process.loadEnvFile('.env.local');
} catch {
    // .env.local が無ければ、シェルの環境変数だけで動かす
}

const { values } = parseArgs({
    options: {
        days: { type: 'string', default: '28' },
        min: { type: 'string', default: '10' },
        site: { type: 'string' },
        json: { type: 'boolean', default: false },
    },
});

const percent = (value) => `${(value * 100).toFixed(1)}%`;

function queryTable(entries, limit = 40) {
    if (!entries.length) return '（該当なし）\n';

    const rows = entries.slice(0, limit).map((entry) => (
        `| ${entry.query} | ${entry.impressions} | ${entry.clicks} | ${percent(entry.ctr)} | ${entry.position.toFixed(1)} | ${entry.page} |`
    ));
    const rest = entries.length > limit ? `\nほか ${entries.length - limit} 件\n` : '';

    return `| クエリ | 表示 | クリック | CTR | 順位 | 受け皿ページ |\n|---|--:|--:|--:|--:|---|\n${rows.join('\n')}\n${rest}`;
}

function renderReport(report) {
    const { totals, groups, pages } = report;
    const pageRows = pages.slice(0, 20).map((page) => (
        `| ${page.path} | ${page.impressions} | ${page.clicks} | ${percent(page.ctr)} | ${page.position.toFixed(1)} |`
    ));

    return `# Search Console レポート（${report.startDate} 〜 ${report.endDate}）

プロパティ: ${report.siteUrl}
合計: 表示 ${totals.impressions} / クリック ${totals.clicks} / CTR ${percent(totals.ctr)} / 平均順位 ${totals.position.toFixed(1)}

## 追記・改善の候補（3位より下〜15位）
${queryTable(groups.rewrite)}
## 新記事の候補（16位以下）
${queryTable(groups.newPost)}
## すでに取れているクエリ（3位以内）
${queryTable(groups.keep, 20)}
## 指名検索
${queryTable(groups.brand, 10)}
## ページ別
| ページ | 表示 | クリック | CTR | 順位 |
|---|--:|--:|--:|--:|
${pageRows.join('\n')}
`;
}

try {
    const report = await fetchSearchConsoleReport({
        days: Number(values.days),
        minImpressions: Number(values.min),
        siteUrl: values.site,
    });
    console.log(values.json ? JSON.stringify(report, null, 2) : renderReport(report));
} catch (error) {
    console.error(error.message);
    process.exit(1);
}
