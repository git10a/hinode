import { parseArticleBody } from './markup.js';

// 記事の体裁の検査。保存時（管理画面・入稿API）に実行し、結果を一覧で見せる。
//   error:   公開できない（下書き保存はできる）
//   warning: 公開はできるが、直したほうがよい
// サーバーでもブラウザでも動くよう、DOMやNode専用APIは使わない。

// Googleの検索結果で説明文が省略されずに出やすいのは全角でおよそ120字まで。
// 50字未満だと検索結果で内容が伝わらず、Google側の自動生成に置き換えられやすい。
export const DESCRIPTION_MIN = 50;
export const DESCRIPTION_MAX = 160;

// 検索結果のタイトルは全角30〜35字あたりで切れる。60字を超えると後半はほぼ読まれない
export const TITLE_MAX = 60;

const ID_PATTERN = /^[a-z0-9][a-z0-9_-]{0,63}$/;

export function isValidArticleId(id = '') {
    return ID_PATTERN.test(id);
}

const stripTags = (html = '') => html.replace(/<[^>]+>/g, '');

// 本文から、見出し（レベル順）と画像（alt・寸法の有無）を取り出す
export function summarizeBody(body = '', bodyFormat = 'markup') {
    if (bodyFormat === 'html') {
        const headings = [...body.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)]
            .map((match) => ({ level: Number(match[1]), text: stripTags(match[2]).trim() }));
        const images = [...body.matchAll(/<img\b[^>]*>/gi)].map(([tag]) => ({
            src: /\bsrc="([^"]*)"/i.exec(tag)?.[1] || '',
            alt: /\balt="([^"]*)"/i.exec(tag)?.[1] || '',
            hasSize: /\bwidth=/.test(tag) && /\bheight=/.test(tag),
        }));
        return { headings, images, textLength: stripTags(body).replace(/\s+/g, '').length };
    }

    const blocks = parseArticleBody(body);
    const inlineText = (inline = []) => inline.map((node) => node.text).join('');
    let textLength = 0;
    for (const block of blocks) {
        if (block.type === 'paragraph' || block.type === 'quote') textLength += inlineText(block.inline).length;
        if (block.type === 'list') textLength += block.items.map(inlineText).join('').length;
        if (block.type === 'heading') textLength += block.text.length;
    }

    return {
        headings: blocks.filter((block) => block.type === 'heading').map(({ level, text }) => ({ level, text })),
        images: blocks.filter((block) => block.type === 'image')
            .map((block) => ({ src: block.src, alt: block.alt, hasSize: Boolean(block.width && block.height) })),
        textLength,
        // 「# 見出し」は記法にないので段落になる。h1のつもりで書いた行を拾って知らせる
        strayH1: body.split('\n').some((line) => /^#\s+\S/.test(line.trim())),
    };
}

export function checkArticle(article = {}) {
    const issues = [];
    const add = (level, code, message) => issues.push({ level, code, message });

    const title = (article.title || '').trim();
    const description = (article.description || '').trim();
    const body = article.body || '';
    const bodyFormat = article.bodyFormat || 'markup';

    if (!isValidArticleId(article.id || '')) {
        add('error', 'id', 'URLに使うIDは、半角の英小文字・数字・ハイフン・アンダースコアで入力してください。');
    }

    if (!title) add('error', 'title-missing', 'タイトルがありません。');
    else if ((article.seoTitle || title).trim().length > TITLE_MAX) {
        add('warning', 'title-long', `検索結果に出るタイトルが${TITLE_MAX}字を超えています。後半は検索結果で省略されます。`);
    }

    if (!description) add('error', 'description-missing', '説明文（meta description）がありません。');
    else if (description.length < DESCRIPTION_MIN) {
        add('warning', 'description-short', `説明文が${description.length}字です。${DESCRIPTION_MIN}字以上にすると検索結果で内容が伝わりやすくなります。`);
    } else if (description.length > DESCRIPTION_MAX) {
        add('warning', 'description-long', `説明文が${description.length}字です。${DESCRIPTION_MAX}字を超えた部分は検索結果で省略されます。`);
    }

    if (!body.trim()) add('error', 'body-missing', '本文がありません。');

    if (!article.thumbnail?.url) {
        add('warning', 'thumbnail-missing', 'サムネイルがありません。一覧とSNSでの表示には共通の画像が使われます。');
    }

    const { headings, images, strayH1 } = summarizeBody(body, bodyFormat);

    if (headings.some((heading) => heading.level === 1) || strayH1) {
        add('warning', 'h1-in-body', '本文に大見出し（h1）があります。h1は記事タイトルだけにし、本文は「## 見出し」から始めてください。');
    }

    if (body.trim() && !headings.some((heading) => heading.level === 2)) {
        add('warning', 'no-h2', '本文に見出し（##）がありません。目次が作られず、検索やAIが内容を拾いにくくなります。');
    }

    // h1は表示時にh2へ下げるので、ここでもh2として数える
    let previousLevel = 2;
    for (const heading of headings) {
        const level = Math.max(heading.level, 2);
        if (level > previousLevel + 1) {
            add('warning', 'heading-skip', `見出し「${heading.text}」の階層が飛んでいます（h${previousLevel}の次にh${level}）。`);
            break;
        }
        previousLevel = level;
    }

    const missingAlt = images.filter((image) => !image.alt.trim()).length;
    if (missingAlt > 0) {
        add('warning', 'image-alt', `代替テキスト（alt）のない画像が${missingAlt}枚あります。画像の内容を短く書いてください。`);
    }

    const missingSize = images.filter((image) => !image.hasSize).length;
    if (missingSize > 0) {
        add('warning', 'image-size', `幅と高さが分からない画像が${missingSize}枚あります。管理画面からアップロードした画像を使うと、読み込み時のレイアウトのずれを防げます。`);
    }

    return issues;
}

export const hasBlockingIssue = (issues = []) => issues.some((issue) => issue.level === 'error');
