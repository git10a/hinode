import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';

// Search Console の検索クエリを取得して、記事ネタの候補に仕分ける。
// サイト本体からは呼ばない（scripts/search-console.mjs 専用）ので next/* に依存しない。

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const API_URL = 'https://www.googleapis.com/webmasters/v3';
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const SITE_HOST = 'hinode-run.com';
const DAY_MS = 24 * 60 * 60 * 1000;

// Search Console の集計は2〜3日遅れるので、直近3日は範囲に含めない
const DATA_DELAY_DAYS = 3;

// 指名検索（HINODEを知っている人の検索）。ネタ候補からは外して別枠で見る
const BRAND_PATTERN = /hinode|ヒノデ|ひので/i;

function base64Url(value) {
    return Buffer.from(value)
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

// GA4と同じサービスアカウントを使う。鍵はJSONファイルのパスか、環境変数で渡す
export function loadServiceAccount(env = process.env) {
    const keyFile = env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE || env.GOOGLE_APPLICATION_CREDENTIALS;
    const inlineJson = env.GOOGLE_ANALYTICS_SERVICE_ACCOUNT_JSON;

    if (keyFile || inlineJson) {
        const credentials = JSON.parse(keyFile ? readFileSync(keyFile, 'utf8') : inlineJson);
        return { clientEmail: credentials.client_email, privateKey: credentials.private_key };
    }

    const clientEmail = env.GOOGLE_ANALYTICS_CLIENT_EMAIL || env.GOOGLE_CLIENT_EMAIL;
    const privateKey = env.GOOGLE_ANALYTICS_PRIVATE_KEY || env.GOOGLE_PRIVATE_KEY;
    return clientEmail && privateKey ? { clientEmail, privateKey } : null;
}

async function getAccessToken({ clientEmail, privateKey }) {
    const now = Math.floor(Date.now() / 1000);
    const unsignedJwt = [
        base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' })),
        base64Url(JSON.stringify({ iss: clientEmail, scope: SCOPE, aud: TOKEN_URL, exp: now + 3600, iat: now })),
    ].join('.');
    const signature = crypto
        .createSign('RSA-SHA256')
        .update(unsignedJwt)
        .sign(privateKey.replace(/\\n/g, '\n'));

    const response = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: `${unsignedJwt}.${base64Url(signature)}`,
        }),
    });

    if (!response.ok) {
        throw new Error(`Googleのトークン取得に失敗しました（${response.status}）: ${await response.text()}`);
    }

    return (await response.json()).access_token;
}

async function callApi(accessToken, path, body) {
    const response = await fetch(`${API_URL}${path}`, {
        method: body ? 'POST' : 'GET',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        throw new Error(`Search Console API が ${response.status} を返しました: ${await response.text()}`);
    }

    return response.json();
}

// サービスアカウントに見えているプロパティから HINODE のものを選ぶ。
// ドメインプロパティ（sc-domain:）があればそちらを優先する
export function pickSiteUrl(siteEntries = []) {
    const candidates = siteEntries
        .filter((entry) => entry.permissionLevel !== 'siteUnverifiedUser')
        .map((entry) => entry.siteUrl)
        .filter((siteUrl) => siteUrl.includes(SITE_HOST));

    return candidates.find((siteUrl) => siteUrl.startsWith('sc-domain:')) || candidates[0] || null;
}

function formatDate(date) {
    return date.toISOString().slice(0, 10);
}

export function getDateRange(days, now = new Date()) {
    const end = new Date(now.getTime() - DATA_DELAY_DAYS * DAY_MS);
    const start = new Date(end.getTime() - (days - 1) * DAY_MS);
    return { startDate: formatDate(start), endDate: formatDate(end) };
}

function toPath(pageUrl = '') {
    try {
        return new URL(pageUrl).pathname;
    } catch {
        return pageUrl;
    }
}

// query×page の行をクエリ単位にまとめる。掲載順位は表示回数で重み付けした平均
export function aggregateByQuery(rows = []) {
    const byQuery = new Map();

    for (const row of rows) {
        const [query, page] = row.keys;
        const entry = byQuery.get(query) || { query, clicks: 0, impressions: 0, positionSum: 0, pages: [] };
        entry.clicks += row.clicks;
        entry.impressions += row.impressions;
        entry.positionSum += row.position * row.impressions;
        entry.pages.push({ path: toPath(page), impressions: row.impressions });
        byQuery.set(query, entry);
    }

    return [...byQuery.values()].map(({ positionSum, pages, ...entry }) => ({
        ...entry,
        position: entry.impressions ? positionSum / entry.impressions : 0,
        ctr: entry.impressions ? entry.clicks / entry.impressions : 0,
        // そのクエリで最も表示されているページ（＝いま受け皿になっているページ）
        page: pages.sort((a, b) => b.impressions - a.impressions)[0]?.path || '',
    }));
}

// クエリを「次に何をするか」で仕分ける
//   rewrite: 3位より下〜15位。受け皿ページへの追記・改善で1ページ目上位を狙える
//   newPost: 16位以下。表示はされているが答えるページが弱い。新記事の候補
//   keep:    3位以内。すでに取れているので守る
//   brand:   指名検索
export function classifyQueries(queries = [], { minImpressions = 10 } = {}) {
    const groups = { rewrite: [], newPost: [], keep: [], brand: [] };

    for (const entry of queries) {
        if (entry.impressions < minImpressions) continue;

        if (BRAND_PATTERN.test(entry.query)) groups.brand.push(entry);
        else if (entry.position <= 3) groups.keep.push(entry);
        else if (entry.position <= 15) groups.rewrite.push(entry);
        else groups.newPost.push(entry);
    }

    for (const list of Object.values(groups)) {
        list.sort((a, b) => b.impressions - a.impressions);
    }

    return groups;
}

// 認証してプロパティを決め、検索アナリティクスを問い合わせる関数を返す
async function openSearchAnalytics({ siteUrl, env = process.env } = {}) {
    const credentials = loadServiceAccount(env);
    if (!credentials) {
        throw new Error('サービスアカウントの鍵が見つかりません。.env.local に GOOGLE_SERVICE_ACCOUNT_KEY_FILE=<鍵JSONのパス> を設定してください。');
    }

    const accessToken = await getAccessToken(credentials);
    const resolvedSiteUrl = siteUrl
        || env.SEARCH_CONSOLE_SITE_URL
        || pickSiteUrl((await callApi(accessToken, '/sites')).siteEntry);

    if (!resolvedSiteUrl) {
        throw new Error(`${credentials.clientEmail} から ${SITE_HOST} のプロパティが見えません。Search Console の「設定 > ユーザーと権限」でこのアドレスを追加してください。`);
    }

    const searchPath = `/sites/${encodeURIComponent(resolvedSiteUrl)}/searchAnalytics/query`;
    return {
        siteUrl: resolvedSiteUrl,
        query: (body) => callApi(accessToken, searchPath, body),
    };
}

const QUERY_AND_PAGE = { dimensions: ['query', 'page'], rowLimit: 25000 };

// クエリ単位の実績（表示・クリック・順位・受け皿ページ）を全件返す
export async function fetchQueryStats({ days = 90, ...options } = {}) {
    const analytics = await openSearchAnalytics(options);
    const response = await analytics.query({ ...getDateRange(days), ...QUERY_AND_PAGE });
    return aggregateByQuery(response.rows);
}

export async function fetchSearchConsoleReport({ days = 28, minImpressions = 10, ...options } = {}) {
    const analytics = await openSearchAnalytics(options);
    const range = getDateRange(days);
    const [totals, byQueryAndPage, byPage] = await Promise.all([
        analytics.query({ ...range }),
        analytics.query({ ...range, ...QUERY_AND_PAGE }),
        analytics.query({ ...range, dimensions: ['page'], rowLimit: 50 }),
    ]);

    return {
        siteUrl: analytics.siteUrl,
        ...range,
        totals: totals.rows?.[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 },
        groups: classifyQueries(aggregateByQuery(byQueryAndPage.rows), { minImpressions }),
        pages: (byPage.rows || []).map(({ keys, ...row }) => ({ path: toPath(keys[0]), ...row })),
    };
}

// ---- 記事ごとの効果（scripts/article-report.mjs）

// 直近の期間と、そのひとつ前の同じ長さの期間
export function getComparisonRanges(days, now = new Date()) {
    const current = getDateRange(days, now);
    const previousEnd = new Date(new Date(`${current.startDate}T00:00:00Z`).getTime() - DAY_MS);
    const previousStart = new Date(previousEnd.getTime() - (days - 1) * DAY_MS);
    return { current, previous: { startDate: formatDate(previousStart), endDate: formatDate(previousEnd) } };
}

// 語順と空白の違いを無視して同じクエリとして扱うためのキー
const toQueryKey = (query = '') => query.toLowerCase().split(/[\s　]+/).filter(Boolean).sort().join(' ');

// query×page の行を、ページ単位にまとめる。
// Search Console は同じページを URL の違い（#見出し など）で別の行として返すので、
// ページ内のクエリも足し合わせる（語順・空白だけが違うクエリは同じものとして扱う）
function aggregateByPage(rows = []) {
    const byPage = new Map();
    for (const row of rows) {
        const [query, page] = row.keys;
        const path = toPath(page);
        const entry = byPage.get(path) || { path, clicks: 0, impressions: 0, positionSum: 0, queryMap: new Map() };
        entry.clicks += row.clicks;
        entry.impressions += row.impressions;
        entry.positionSum += row.position * row.impressions;

        const key = toQueryKey(query);
        const merged = entry.queryMap.get(key) || { query, clicks: 0, impressions: 0, positionSum: 0, topImpressions: 0 };
        merged.clicks += row.clicks;
        merged.impressions += row.impressions;
        merged.positionSum += row.position * row.impressions;
        // 表記は、いちばん表示の多い書き方を代表にする
        if (row.impressions > merged.topImpressions) {
            merged.query = query;
            merged.topImpressions = row.impressions;
        }
        entry.queryMap.set(key, merged);
        byPage.set(path, entry);
    }

    for (const entry of byPage.values()) {
        entry.position = entry.impressions ? entry.positionSum / entry.impressions : 0;
        entry.queries = [...entry.queryMap.values()]
            .map(({ positionSum, topImpressions, ...query }) => ({
                ...query,
                position: query.impressions ? positionSum / query.impressions : 0,
            }))
            .sort((a, b) => b.impressions - a.impressions);
        delete entry.positionSum;
        delete entry.queryMap;
    }
    return byPage;
}

// 記事ごとに、直近と前の期間を並べる。targets は { 記事ID: [狙うクエリ, ...] }。
// 狙うクエリは、まだ1回も表示されていなくても「表示なし」として結果に残す（取れたかどうかを見るため）
export function buildArticleReport(currentRows = [], previousRows = [], { targets = {}, articles = [] } = {}) {
    const current = aggregateByPage(currentRows);
    const previous = aggregateByPage(previousRows);
    const info = new Map(articles.map((article) => [`/blog/${article.id}`, article]));
    const paths = new Set([...current.keys(), ...Object.keys(targets).map((id) => `/blog/${id}`), ...info.keys()]);

    const reports = [...paths].filter((path) => path.startsWith('/blog/')).map((path) => {
        const id = path.replace('/blog/', '');
        const now = current.get(path) || { clicks: 0, impressions: 0, position: 0, queries: [] };
        const before = previous.get(path) || { clicks: 0, impressions: 0, position: 0 };
        const byKey = new Map(now.queries.map((entry) => [toQueryKey(entry.query), entry]));

        return {
            id,
            path,
            title: info.get(path)?.title || '',
            status: info.get(path)?.status || '',
            publishedAt: info.get(path)?.publishedAt || null,
            clicks: now.clicks,
            impressions: now.impressions,
            position: now.position,
            previousClicks: before.clicks,
            previousImpressions: before.impressions,
            previousPosition: before.position,
            topQueries: now.queries.slice(0, 5),
            targets: (targets[id] || []).map((query) => {
                const hit = byKey.get(toQueryKey(query));
                return hit
                    ? { query, shown: true, clicks: hit.clicks, impressions: hit.impressions, position: hit.position }
                    : { query, shown: false };
            }),
        };
    });

    return reports.sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions);
}

export async function fetchArticleReport({ days = 28, targets = {}, articles = [], ...options } = {}) {
    const analytics = await openSearchAnalytics(options);
    const ranges = getComparisonRanges(days);
    const blogOnly = {
        dimensionFilterGroups: [{ filters: [{ dimension: 'page', operator: 'contains', expression: '/blog/' }] }],
    };
    const [current, previous] = await Promise.all([
        analytics.query({ ...ranges.current, ...QUERY_AND_PAGE, ...blogOnly }),
        analytics.query({ ...ranges.previous, ...QUERY_AND_PAGE, ...blogOnly }),
    ]);

    return { ...ranges, days, articles: buildArticleReport(current.rows, previous.rows, { targets, articles }) };
}
