import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { checkArticle, hasBlockingIssue } from '../lib/cms/checks.js';
import { applyEdit, insertLineEdit, linkEdit, pastedImageFiles, toggleLinePrefixEdit, toggleWrapEdit } from '../lib/cms/editing.js';
import { parseArticleFile } from '../lib/cms/frontmatter.js';
import { readImageInfo } from '../lib/cms/imageSize.js';
import { parseArticleBody, renderMarkupToHtml } from '../lib/cms/markup.js';
import { createMediaKey, isValidMediaKey, validateImage } from '../lib/cms/media.js';

const MEDIA_URL = '/media/articles/2026/11/0f8fad5b-d9cb-469f-a165-70867728950e-1440x960.webp';

const goodArticle = {
    id: 'asa-run-fuyu',
    title: '冬の朝ランは何を着る？',
    description: '冬の朝ランの服装を、気温ごとに実際の開催で着ているものから紹介します。手袋や耳当てなど、暗い時間帯に役立つ小物もまとめました。',
    thumbnail: { url: MEDIA_URL, width: 1440, height: 960 },
    body: `## 気温5度の日\n薄手の長袖に、風を通さない上着を重ねます。\n\n![皇居のお堀沿いの朝](${MEDIA_URL} "12月の桔梗門前")\n\n### 手袋\n指先が冷えるので必須です。`,
};

const codes = (article) => checkArticle(article).map((issue) => issue.code);

test('記法: 見出し・段落・太字・リンクをHTMLにする', () => {
    const html = renderMarkupToHtml('## 見出し\n**太字**と[日程](/schedule)と[外部](https://example.com/a)。\n### 小見出し');
    assert.equal(html, [
        '<h2>見出し</h2>',
        '<p><strong>太字</strong>と<a href="/schedule">日程</a>と<a href="https://example.com/a" target="_blank" rel="noopener noreferrer">外部</a>。</p>',
        '<h3>小見出し</h3>',
    ].join('\n'));
});

test('記法: 画像は alt・キャプション・幅と高さ・遅延読み込みつきで、本文のどこにでも置ける', () => {
    const html = renderMarkupToHtml(`前の段落\n![お堀沿いの朝](${MEDIA_URL} "12月の桔梗門前")\n後の段落`);
    assert.equal(html, [
        '<p>前の段落</p>',
        `<figure><img src="${MEDIA_URL}" alt="お堀沿いの朝" width="1440" height="960" loading="lazy" decoding="async"><figcaption>12月の桔梗門前</figcaption></figure>`,
        '<p>後の段落</p>',
    ].join('\n'));
});

test('記法: 表・箇条書き・番号付き・引用・区切り線', () => {
    const html = renderMarkupToHtml('| 施設 | 料金 |\n|---|---|\n| A | 500円 |\n\n- 一\n- 二\n\n1. 先\n2. 後\n\n> 引用\n---');
    assert.equal(html, [
        '<table><thead><tr><th>施設</th><th>料金</th></tr></thead><tbody><tr><td>A</td><td>500円</td></tr></tbody></table>',
        '<ul><li>一</li><li>二</li></ul>',
        '<ol><li>先</li><li>後</li></ol>',
        '<blockquote><p>引用</p></blockquote>',
        '<hr>',
    ].join('\n'));
});

test('記法: HTMLは解釈せず、危険なURLはリンクにしない', () => {
    const html = renderMarkupToHtml('<script>alert(1)</script>\n[押す](javascript:alert(1))\n![x](javascript:alert(1))\n![a" onerror="x](/media/a.jpg)');
    assert.ok(!html.includes('<script>'));
    assert.ok(html.includes('&lt;script&gt;'));
    assert.ok(!/href="javascript:/i.test(html));
    assert.ok(!/src="javascript:/i.test(html));
    // 属性を閉じて別の属性を足すことはできない
    assert.ok(html.includes('alt="a&quot; onerror=&quot;x"'));
});

test('記法: YouTubeのURLだけの行は埋め込みになる', () => {
    const [block] = parseArticleBody('https://youtu.be/dQw4w9WgXcQ?t=30');
    assert.deepEqual(block, { type: 'youtube', videoId: 'dQw4w9WgXcQ', start: 30 });
});

test('検査: 体裁の整った記事は指摘なし', () => {
    assert.deepEqual(checkArticle(goodArticle), []);
});

test('検査: タイトル・説明文・本文が無いと公開できない', () => {
    const issues = checkArticle({ ...goodArticle, title: '', description: '', body: '' });
    assert.ok(hasBlockingIssue(issues));
    assert.deepEqual(issues.filter((issue) => issue.level === 'error').map((issue) => issue.code), [
        'title-missing', 'description-missing', 'body-missing',
    ]);
});

test('検査: 説明文の長さ・サムネイル・見出し・画像の抜けを注意として出す', () => {
    assert.deepEqual(codes({ ...goodArticle, description: '短い説明' }), ['description-short']);
    assert.deepEqual(codes({ ...goodArticle, description: 'あ'.repeat(200) }), ['description-long']);
    assert.deepEqual(codes({ ...goodArticle, thumbnail: null }), ['thumbnail-missing']);
    assert.deepEqual(codes({ ...goodArticle, body: '見出しのない本文だけ。' }), ['no-h2']);
    assert.deepEqual(codes({ ...goodArticle, body: '# 大見出し\n## 見出し\n本文' }), ['h1-in-body']);
    assert.deepEqual(codes({ ...goodArticle, body: '## 見出し\n![](/assets/Kokyo.jpg)' }), ['image-alt', 'image-size']);
    assert.ok(!hasBlockingIssue(checkArticle({ ...goodArticle, thumbnail: null })));
});

test('検査: 取り込んだHTML形式の記事も同じ観点で見る', () => {
    const body = '<h1>大見出し</h1><h2>見出し</h2><h4>飛んだ見出し</h4><figure><img src="/media/a.webp" alt="" width="10" height="10"></figure>';
    assert.deepEqual(codes({ ...goodArticle, body, bodyFormat: 'html' }), ['h1-in-body', 'heading-skip', 'image-alt']);
});

test('検査: URLに使えないIDは必須エラー', () => {
    assert.ok(codes({ ...goodArticle, id: 'Asa Run' }).includes('id'));
    assert.ok(!codes({ ...goodArticle, id: '5_9d06klyz' }).includes('id'));
    assert.ok(!codes({ ...goodArticle, id: '4z58kl-91' }).includes('id'));
});

test('編集: 見出しの切り替え・太字・リンク・行の差し込み', () => {
    const apply = (body, edit) => applyEdit(body, edit);
    assert.equal(apply('本文', toggleLinePrefixEdit('本文', 1, '## ')), '## 本文');
    assert.equal(apply('## 本文', toggleLinePrefixEdit('## 本文', 3, '## ')), '本文');
    assert.equal(apply('朝に走る', toggleWrapEdit('朝に走る', 0, 1)), '**朝**に走る');
    assert.equal(apply('**朝**に走る', toggleWrapEdit('**朝**に走る', 2, 3)), '朝に走る');
    assert.equal(apply('日程はこちら', linkEdit('日程はこちら', 0, 2)), '[日程](https://)はこちら');

    const edit = insertLineEdit('一行目\n二行目', 2, '![画像の説明](/media/a.webp)', [2, 7]);
    const next = apply('一行目\n二行目', edit);
    assert.equal(next, '一行目\n![画像の説明](/media/a.webp)\n二行目');
    assert.equal(next.slice(edit.select[0], edit.select[1]), '画像の説明');
});

test('編集: 文章と一緒に貼られた画像（Wordなど）は文字として扱う', () => {
    const image = { type: 'image/png' };
    assert.deepEqual(pastedImageFiles({ types: ['Files'], text: '', files: [image] }), [image]);
    assert.deepEqual(pastedImageFiles({ types: ['text/rtf', 'Files'], text: '文章', files: [image] }), []);
    assert.deepEqual(pastedImageFiles({ types: ['Files'], text: '改行を含む\n文章', files: [image] }), []);
});

test('入稿ファイル: 先頭の設定と本文を読み分ける', () => {
    const { fields, body } = parseArticleFile('---\nid: asa-run-fuyu\ntitle: "冬の朝ラン: 服装"\ndescription: 説明\n---\n\n## 見出し\n本文\n');
    assert.deepEqual(fields, { id: 'asa-run-fuyu', title: '冬の朝ラン: 服装', description: '説明' });
    assert.equal(body, '## 見出し\n本文');
    assert.throws(() => parseArticleFile('## 見出し\n本文'), /先頭に ---/);
    assert.throws(() => parseArticleFile('---\nstatus: published\n---\n本文'), /読み取れませんでした/);
});

test('画像: 中身から形式と寸法を読み、画像でないものは受け付けない', () => {
    const jpeg = readFileSync(new URL('../public/assets/Kokyo.jpg', import.meta.url));
    const png = readFileSync(new URL('../public/favicon.png', import.meta.url));
    assert.equal(readImageInfo(jpeg).type, 'image/jpeg');
    assert.ok(readImageInfo(jpeg).width > 0 && readImageInfo(jpeg).height > 0);
    assert.equal(readImageInfo(png).type, 'image/png');
    assert.equal(readImageInfo(new TextEncoder().encode('<svg onload="alert(1)"></svg>'.padEnd(64))), null);
    assert.ok(validateImage(new TextEncoder().encode('{"name":"x"}'.padEnd(64))).error);
});

test('画像: 保存キーは寸法つきの決まった形だけを通す', () => {
    const key = createMediaKey({ width: 1440, height: 960, extension: 'webp' }, new Date('2026-11-13T00:00:00Z'));
    assert.match(key, /^articles\/2026\/11\/[0-9a-f-]{36}-1440x960\.webp$/);
    assert.ok(isValidMediaKey(key));
    assert.ok(!isValidMediaKey('../wrangler.jsonc'));
    assert.ok(!isValidMediaKey('articles/2026/11/../../secret.jpg'));
});
