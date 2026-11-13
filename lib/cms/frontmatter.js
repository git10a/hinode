// 入稿用の Markdown ファイル（npm run article:push）の読み取り。
// 先頭の --- で囲んだ部分に「キー: 値」を1行ずつ書き、その下が本文。
//
//   ---
//   id: asa-run-fuyu-fukusou
//   title: 冬の朝ランの服装
//   description: ……
//   ---
//   ## 見出し
//   本文

const ALLOWED_KEYS = new Set(['id', 'title', 'description', 'seoTitle', 'ogTitle', 'ogDescription', 'thumbnail', 'ogImage']);

function unquote(value) {
    const quoted = /^(["'])(.*)\1$/.exec(value);
    return quoted ? quoted[2] : value;
}

export function parseArticleFile(text = '') {
    const normalized = text.replace(/^﻿/, '').replace(/\r\n?/g, '\n');
    const match = /^---\n([\s\S]*?)\n---\n?/.exec(normalized);
    if (!match) throw new Error('ファイルの先頭に --- で囲んだ設定（id・title・description など）がありません。');

    const fields = {};
    for (const line of match[1].split('\n')) {
        if (!line.trim() || line.trim().startsWith('#')) continue;
        const separator = line.indexOf(':');
        const key = separator > 0 ? line.slice(0, separator).trim() : '';
        if (!ALLOWED_KEYS.has(key)) {
            throw new Error(`設定の行を読み取れませんでした: 「${line}」（使えるキー: ${[...ALLOWED_KEYS].join(', ')}）`);
        }
        fields[key] = unquote(line.slice(separator + 1).trim());
    }

    return { fields, body: normalized.slice(match[0].length).trim() };
}
