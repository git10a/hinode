#!/usr/bin/env node
// Markdown ファイルを、CMS の下書きとして登録・更新する（AIエージェント用の入稿口）。
//   npm run article:push -- docs/drafts/asa-run-fuyu-fukusou.md
// 作れるのは下書きだけ。公開は管理画面（/admin）から人が行う。公開済みの記事は上書きできない。
// 送り先は CMS_BASE_URL（既定は http://localhost:3002）、認証は CMS_API_TOKEN。どちらも .env.local に置く。
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';
import { parseArticleFile } from '../lib/cms/frontmatter.js';
import { getImageSizeFromUrl } from '../lib/cms/markup.js';

try {
    process.loadEnvFile('.env.local');
} catch {
    // .env.local が無ければ、シェルの環境変数だけで動かす
}

const file = process.argv[2];
const baseUrl = (process.env.CMS_BASE_URL || 'http://localhost:3002').replace(/\/$/, '');
const token = process.env.CMS_API_TOKEN;

const toImage = (url) => (url ? { url, ...getImageSizeFromUrl(url) } : null);

try {
    if (!file) throw new Error('使い方: npm run article:push -- <Markdownファイル>');
    if (!token) throw new Error('CMS_API_TOKEN が設定されていません（.env.local）。');

    const { fields, body } = parseArticleFile(readFileSync(file, 'utf8'));
    const article = {
        ...fields,
        id: fields.id || basename(file).replace(/\.[^.]+$/, ''),
        thumbnail: toImage(fields.thumbnail),
        ogImage: toImage(fields.ogImage),
        body,
    };

    const response = await fetch(`${baseUrl}/api/cms/drafts`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(article),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || `登録できませんでした（${response.status}）。`);

    console.log(`下書きを登録しました: ${result.id}`);
    console.log(`  編集:       ${result.editUrl}`);
    console.log(`  プレビュー: ${result.previewUrl}`);
    if (result.issues.length > 0) {
        console.log('\n体裁チェック:');
        for (const issue of result.issues) {
            console.log(`  [${issue.level === 'error' ? '必須' : '注意'}] ${issue.message}`);
        }
    } else {
        console.log('\n体裁チェック: 問題は見つかりませんでした。');
    }
} catch (error) {
    console.error(error.message);
    process.exit(1);
}
