#!/usr/bin/env node
// 記事ごとの検索の成績を、直近の期間とその前の期間で並べる。
//   npm run report                 直近28日と、その前の28日
//   npm run report -- --days 7     期間を変える
//   npm run report -- --json       JSONで出す
// 「狙うクエリ」は docs/article-targets.json に、記事IDごとに書いておく。
// 記事のタイトルと公開日は CMS から取る（.env.cms-production か .env.local に CMS_BASE_URL と ADMIN_PASSWORD があるとき）。
import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { fetchArticleReport } from '../lib/searchConsole.js';

// 先に読んだファイルの値が優先される。本番の CMS を見たいので、本番用を先に読む
for (const file of ['.env.cms-production', '.env.local']) {
    try {
        process.loadEnvFile(file);
    } catch {
        // 無ければ読み飛ばす
    }
}

const { values } = parseArgs({
    options: { days: { type: 'string', default: '28' }, json: { type: 'boolean', default: false } },
});

function loadTargets() {
    try {
        return JSON.parse(readFileSync('docs/article-targets.json', 'utf8'));
    } catch {
        return {};
    }
}

// CMS にログインして記事の一覧（タイトル・状態・公開日）を読む。読めなくてもレポートは出す
async function loadArticles() {
    const baseUrl = (process.env.CMS_BASE_URL || '').replace(/\/$/, '');
    if (!baseUrl || !process.env.ADMIN_PASSWORD) return [];
    try {
        const login = await fetch(`${baseUrl}/api/cms/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Origin: baseUrl },
            body: JSON.stringify({ password: process.env.ADMIN_PASSWORD }),
        });
        if (!login.ok) return [];
        const cookie = (login.headers.getSetCookie?.() || []).map((value) => value.split(';')[0]).join('; ');
        const list = await fetch(`${baseUrl}/api/cms/articles`, { headers: { Cookie: cookie } });
        return list.ok ? (await list.json()).articles : [];
    } catch {
        return [];
    }
}

const signed = (value) => (value > 0 ? `+${value}` : `${value}`);
const position = (value) => (value ? value.toFixed(1) : '—');
const label = (article) => (article.title ? `${article.title.slice(0, 28)}${article.title.length > 28 ? '…' : ''}` : article.path);
const daysSince = (iso) => (iso ? Math.floor((Date.now() - new Date(iso).getTime()) / 86400000) : null);

function renderReport(report) {
    const { current, previous, articles } = report;
    const published = articles.filter((article) => article.status !== 'draft');
    const withTargets = articles.filter((article) => article.targets.length > 0);

    const targetRows = withTargets.flatMap((article) => article.targets.map((target) => (
        target.shown
            ? `| ${label(article)} | ${target.query} | ${position(target.position)} | ${target.impressions} | ${target.clicks} |`
            : `| ${label(article)} | ${target.query} | 表示なし | 0 | 0 |`
    )));

    const articleRows = published.filter((article) => article.impressions > 0).map((article) => (
        `| ${label(article)} | ${article.impressions}（${signed(article.impressions - article.previousImpressions)}） `
        + `| ${article.clicks}（${signed(article.clicks - article.previousClicks)}） `
        + `| ${position(article.position)}（前 ${position(article.previousPosition)}） `
        + `| ${article.topQueries.slice(0, 3).map((entry) => entry.query).join(' / ')} |`
    ));

    const silent = published.filter((article) => article.impressions === 0 && article.status === 'published').map((article) => {
        const days = daysSince(article.publishedAt);
        return `- ${label(article)}（${article.path}${days === null ? '' : `、公開から${days}日`}）`;
    });

    return `# 記事ごとの効果

直近: ${current.startDate} 〜 ${current.endDate} ／ 前の期間: ${previous.startDate} 〜 ${previous.endDate}
（）内は前の期間との差。Search Console の集計は2〜3日遅れる。

## 狙ったクエリの状況
${targetRows.length ? `| 記事 | 狙うクエリ | 順位 | 表示 | クリック |\n|---|---|--:|--:|--:|\n${targetRows.join('\n')}` : '（docs/article-targets.json に狙うクエリが登録されていません）'}

## 記事別（クリックの多い順）
| 記事 | 表示 | クリック | 平均順位 | よく出ているクエリ |
|---|--:|--:|--:|---|
${articleRows.join('\n')}

## 公開中だが、まだ検索に出ていない記事
${silent.length ? silent.join('\n') : '（なし）'}
`;
}

try {
    const report = await fetchArticleReport({
        days: Number(values.days),
        targets: loadTargets(),
        articles: await loadArticles(),
    });
    console.log(values.json ? JSON.stringify(report, null, 2) : renderReport(report));
} catch (error) {
    console.error(error.message);
    process.exit(1);
}
