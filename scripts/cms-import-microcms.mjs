#!/usr/bin/env node
// microCMS の公開記事を、URL（id）・日付・本文をそのままに CMS へ取り込む。
//   npm run cms:import                 まだ CMS に無い記事だけ取り込む
//   npm run cms:import -- --force      すでにある記事も取り込み直す（画像は新しく上げ直される）
//   npm run cms:import -- --dry-run    何を取り込むかだけ表示する
// 送り先は CMS_BASE_URL（既定は http://localhost:3002）。管理画面と同じ ADMIN_PASSWORD でログインして書き込む。
// 本文はHTMLのまま保存し、画像（サムネイルと本文中）だけ CMS の置き場へ移して参照を置き換える。
import { parseArgs } from 'node:util';

try {
    process.loadEnvFile('.env.local');
} catch {
    // .env.local が無ければ、シェルの環境変数だけで動かす
}

const { values: options } = parseArgs({
    options: { force: { type: 'boolean', default: false }, 'dry-run': { type: 'boolean', default: false } },
});

const baseUrl = (process.env.CMS_BASE_URL || 'http://localhost:3002').replace(/\/$/, '');
const MICROCMS_IMAGE_HOST = 'https://images.microcms-assets.io/';
// 本文の画像は、いまの表示（lib/blogPosts.js の optimizeBlogContentHtml）と同じ条件で縮小して取り込む
const BODY_IMAGE_PARAMS = 'fm=webp&q=75&w=1440&fit=max';
// サムネイルはSNSのカードにも使うので JPEG にする
const THUMBNAIL_PARAMS = 'fm=jpg&q=85&w=1600&fit=max';

let cookie = '';

async function cms(path, init = {}) {
    const response = await fetch(`${baseUrl}${path}`, {
        ...init,
        headers: { Origin: baseUrl, Cookie: cookie, ...init.headers },
    });
    const result = await response.json().catch(() => ({}));
    return { response, result };
}

async function login() {
    if (!process.env.ADMIN_PASSWORD) throw new Error('ADMIN_PASSWORD が設定されていません（.env.local）。');
    const { response, result } = await cms('/api/cms/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: process.env.ADMIN_PASSWORD }),
    });
    if (!response.ok) throw new Error(`CMS にログインできませんでした: ${result.error || response.status}`);
    cookie = (response.headers.getSetCookie?.() || []).map((value) => value.split(';')[0]).join('; ');
}

async function fetchMicrocmsPosts() {
    const { MICROCMS_SERVICE_DOMAIN: domain, MICROCMS_API_KEY: key } = process.env;
    if (!domain || !key) throw new Error('MICROCMS_SERVICE_DOMAIN / MICROCMS_API_KEY が設定されていません（.env.local）。');
    const response = await fetch(`https://${domain}.microcms.io/api/v1/blogs?limit=100&orders=publishedAt`, {
        headers: { 'X-MICROCMS-API-KEY': key },
    });
    if (!response.ok) throw new Error(`microCMS から記事を取得できませんでした（${response.status}）。`);
    const data = await response.json();
    if (data.totalCount > data.contents.length) throw new Error('記事が100件を超えています。取得処理の見直しが必要です。');
    return data.contents;
}

// microCMS の画像を取ってきて CMS に上げ直し、新しいURLと寸法を返す
async function moveImage(sourceUrl, params) {
    const [base, query] = sourceUrl.split('?');
    // エディタで表示サイズを指定してある画像（?w=336&h=400 など）は、その指定を保ったまま形式だけ変える
    const url = query ? `${base}?${query}&fm=webp&q=75` : `${base}?${params}`;
    const download = await fetch(url);
    if (!download.ok) throw new Error(`画像を取得できませんでした（${download.status}）: ${base}`);

    const blob = await download.blob();
    const formData = new FormData();
    formData.append('file', blob, 'image');
    const { response, result } = await cms('/api/cms/upload', { method: 'POST', body: formData });
    if (!response.ok) throw new Error(`画像をアップロードできませんでした: ${result.error || response.status}（${base}）`);
    return { url: result.url, width: result.width, height: result.height };
}

async function importPost(post) {
    const thumbnail = post.thumbnail?.url ? await moveImage(post.thumbnail.url, THUMBNAIL_PARAMS) : null;

    // 本文中の画像。HTMLの属性値なので & は &amp; で入っている
    let body = post.content || '';
    const sources = [...new Set([...body.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map((match) => match[1]))]
        .filter((source) => source.startsWith(MICROCMS_IMAGE_HOST));
    for (const source of sources) {
        const moved = await moveImage(source.replaceAll('&amp;', '&'), BODY_IMAGE_PARAMS);
        body = body.replaceAll(`src="${source}"`, `src="${moved.url}"`);
    }

    const { response, result } = await cms('/api/cms/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            import: true,
            id: post.id,
            title: post.title,
            description: post.description || '',
            thumbnail,
            body,
            bodyFormat: 'html',
            status: post.publishedAt ? 'published' : 'draft',
            publishedAt: post.publishedAt,
            revisedAt: post.revisedAt,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
        }),
    });
    if (!response.ok) throw new Error(`「${post.title}」を保存できませんでした: ${result.error || response.status}`);
    return { images: sources.length + (thumbnail ? 1 : 0), issues: result.issues };
}

try {
    const posts = await fetchMicrocmsPosts();
    console.log(`microCMS の記事: ${posts.length}件 → ${baseUrl}`);
    if (options['dry-run']) {
        for (const post of posts) console.log(`  ${post.id}  ${post.title}`);
        process.exit(0);
    }

    await login();
    let imported = 0;
    for (const post of posts) {
        if (!options.force) {
            const existing = await cms(`/api/cms/articles/${post.id}`);
            if (existing.response.ok) {
                console.log(`  スキップ（取り込み済み）: ${post.id}`);
                continue;
            }
        }
        const { images, issues } = await importPost(post);
        imported += 1;
        const notes = issues.filter((issue) => issue.level === 'error').length
            ? '（必須項目の不足あり）'
            : issues.length ? `（注意 ${issues.length}件: ${issues.map((issue) => issue.code).join(', ')}）` : '';
        console.log(`  取り込み: ${post.id}  画像${images}枚  ${post.title} ${notes}`);
    }
    console.log(`完了: ${imported}件を取り込みました。`);
} catch (error) {
    console.error(error.message);
    process.exit(1);
}
