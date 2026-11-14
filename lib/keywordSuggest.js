// Google サジェスト（検索窓の予測候補）から、まだ記事にしていないクエリを探す。
// Search Console には「すでにサイトが表示されているクエリ」しか出ないので、
// 未着手のテーマはこちらで拾う。scripts/keyword-suggest.mjs 専用。

const SUGGEST_URL = 'https://suggestqueries.google.com/complete/search';
const REQUEST_INTERVAL_MS = 300;

// 種キーワード。HINODEが実体験で答えられる「場所」と「朝ラン・続ける」の周辺に絞る
export const SEED_KEYWORDS = [
    '皇居ラン',
    '皇居 ランニング',
    '代々木公園 ランニング',
    '駒沢公園 ランニング',
    '目黒川 ランニング',
    '中目黒 ランニング',
    '朝ラン',
    '朝ラン 初心者',
    '朝ラン 続かない',
    '早朝 ランニング',
    'ランニング 初心者',
    'ランニング 続かない',
    'ランニング 仲間',
    'ランニングサークル',
    'ランニングコミュニティ',
    '朝活 東京',
];

// 季節の種。記事が順位に乗るまで時間がかかるので、次の季節も先回りして調べる
const SEASON_BY_MONTH = ['冬', '冬', '春', '春', '春', '梅雨', '夏', '夏', '夏', '秋', '秋', '冬'];
const SEASON_SEED_TEMPLATES = ['朝ラン {season}', 'ランニング {season}', '早朝 ランニング {season}'];

export function getSeasonSeeds(date = new Date()) {
    const month = date.getMonth();
    const seasons = [...new Set([SEASON_BY_MONTH[month], SEASON_BY_MONTH[(month + 2) % 12]])];
    return seasons.flatMap((season) => SEASON_SEED_TEMPLATES.map((template) => template.replace('{season}', season)));
}

// 商品選びや購入が目的のクエリ。比較・アフィリエイト系サイトが強く、HINODEの体験では答えにくい
const SHOPPING_PATTERN = /メンズ|レディース|ユニクロ|ワークマン|ナイキ|アシックス|アディダス|ミズノ|モンベル|ブランド|おすすめ|ランキング|人気|安い|通販|アプリ|ダイエット|痩せ/i;

// 開催していない地域のクエリと、掲示板を探しているクエリ
const OFF_TARGET_PATTERN = /大阪|京都|神戸|名古屋|福岡|札幌|仙台|広島|熊本|横浜|神奈川|千葉|埼玉|知恵袋|2ch|5ch/i;

// 表示回数がこれ未満の実績は、順位が安定しないので「まだ表示されていない」とみなす
const MIN_IMPRESSIONS = 10;

// 語順と空白の違いを無視して同じクエリとして扱うためのキー
export function toQueryKey(query = '') {
    return query
        .toLowerCase()
        .split(/[\s　]+/)
        .filter(Boolean)
        .sort()
        .join(' ');
}

async function fetchSuggestions(query) {
    const params = new URLSearchParams({ client: 'firefox', hl: 'ja', gl: 'jp', ie: 'utf-8', oe: 'utf-8', q: query });
    const response = await fetch(`${SUGGEST_URL}?${params}`);

    if (!response.ok) {
        throw new Error(`サジェストの取得に失敗しました（${response.status}）: ${query}`);
    }

    // charset ヘッダーに頼らず UTF-8 として読む
    const text = new TextDecoder('utf-8').decode(await response.arrayBuffer());
    return JSON.parse(text)[1] || [];
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 種ごとにサジェストを集める。deep のときは、返ってきた候補をもう一段広げる
export async function collectSuggestions(seeds, { deep = false } = {}) {
    const found = new Map();
    const queue = seeds.map((seed) => ({ seed, query: seed, depth: 0 }));

    while (queue.length > 0) {
        const { seed, query, depth } = queue.shift();
        // 末尾に空白を付けると「種＋次の語」の候補が返る
        const suggestions = await fetchSuggestions(`${query} `);

        for (const suggestion of suggestions) {
            const key = toQueryKey(suggestion);
            if (found.has(key)) continue;

            found.set(key, { query: suggestion, seed });
            if (deep && depth === 0) queue.push({ seed, query: suggestion, depth: 1 });
        }

        await sleep(REQUEST_INTERVAL_MS);
    }

    return [...found.values()];
}

// サジェストを Search Console の実績と突き合わせて仕分ける
//   newTopic:    サイトがまだ（ほとんど）表示されていない。新記事の候補
//   improve:     表示はあるが3位より下。受け皿ページの改善候補
//   covered:     3位以内。対応済み
//   lowPriority: 商品・比較系、他地域、掲示板探し。優先度を下げる
export function classifySuggestions(suggestions = [], queryStats = [], { minImpressions = MIN_IMPRESSIONS } = {}) {
    const statsByKey = new Map(
        queryStats
            .filter((entry) => entry.impressions >= minImpressions)
            .map((entry) => [toQueryKey(entry.query), entry])
    );
    const groups = { newTopic: [], improve: [], covered: [], lowPriority: [] };

    for (const suggestion of suggestions) {
        const stats = statsByKey.get(toQueryKey(suggestion.query));
        const entry = { ...suggestion, ...(stats && { impressions: stats.impressions, position: stats.position, page: stats.page }) };

        if (SHOPPING_PATTERN.test(suggestion.query) || OFF_TARGET_PATTERN.test(suggestion.query)) groups.lowPriority.push(entry);
        else if (!stats) groups.newTopic.push(entry);
        else if (stats.position <= 3) groups.covered.push(entry);
        else groups.improve.push(entry);
    }

    groups.improve.sort((a, b) => b.impressions - a.impressions);
    groups.covered.sort((a, b) => b.impressions - a.impressions);
    return groups;
}
