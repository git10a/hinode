import { checkArticle, hasBlockingIssue, isValidArticleId } from './checks.js';
import { renderMarkupToHtml } from './markup.js';

// 記事の読み書き（D1）。db は lib/cloudflareEnv.js の getDatabase() で取ったものを渡す。

const SUMMARY_COLUMNS = 'id, title, description, seo_title, og_title, og_description, og_image, thumbnail, body_format, status, published_at, revised_at, created_at, updated_at';
const PUBLISHED = "status = 'published' AND published_at IS NOT NULL";

function parseImage(value) {
    if (!value) return null;
    try {
        const image = JSON.parse(value);
        return image?.url ? image : null;
    } catch {
        return null;
    }
}

function serializeImage(image) {
    if (!image?.url) return null;
    return JSON.stringify({ url: image.url, width: Number(image.width) || null, height: Number(image.height) || null });
}

// 管理画面用の形（本文は書いたままの記法）
export function rowToArticle(row) {
    if (!row) return null;
    return {
        id: row.id,
        title: row.title,
        description: row.description,
        seoTitle: row.seo_title || '',
        ogTitle: row.og_title || '',
        ogDescription: row.og_description || '',
        ogImage: parseImage(row.og_image),
        thumbnail: parseImage(row.thumbnail),
        body: row.body ?? '',
        bodyFormat: row.body_format,
        status: row.status,
        publishedAt: row.published_at,
        revisedAt: row.revised_at,
        previewToken: row.preview_token,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

// 公開ページ用の形。microCMS の記事と同じ項目名にそろえ、本文はHTMLにして content に入れる
export function articleToPost(article) {
    if (!article) return null;
    const post = {
        id: article.id,
        title: article.title,
        description: article.description,
        thumbnail: article.thumbnail,
        publishedAt: article.publishedAt,
        revisedAt: article.revisedAt,
        updatedAt: article.updatedAt,
        createdAt: article.createdAt,
        seoTitle: article.seoTitle,
        ogTitle: article.ogTitle,
        ogDescription: article.ogDescription,
        ogImage: article.ogImage,
    };
    if (article.body !== undefined) {
        post.content = article.bodyFormat === 'html' ? article.body : renderMarkupToHtml(article.body);
    }
    return post;
}

export async function listPublishedArticles(db) {
    const { results } = await db
        .prepare(`SELECT ${SUMMARY_COLUMNS} FROM articles WHERE ${PUBLISHED} ORDER BY published_at DESC`)
        .all();
    // 一覧では本文を読まない（microCMS の一覧取得と同じ）
    return results.map((row) => rowToArticle({ ...row, body: undefined }));
}

export async function getPublishedArticle(db, id) {
    return rowToArticle(await db.prepare(`SELECT * FROM articles WHERE id = ? AND ${PUBLISHED}`).bind(id).first());
}

export async function listArticlesForAdmin(db) {
    const { results } = await db
        .prepare(`SELECT ${SUMMARY_COLUMNS} FROM articles ORDER BY updated_at DESC`)
        .all();
    return results.map((row) => rowToArticle({ ...row, body: undefined }));
}

export async function getArticle(db, id) {
    return rowToArticle(await db.prepare('SELECT * FROM articles WHERE id = ?').bind(id).first());
}

export async function getArticleByPreviewToken(db, token) {
    if (!/^[0-9a-f]{32}$/.test(token || '')) return null;
    return rowToArticle(await db.prepare('SELECT * FROM articles WHERE preview_token = ?').bind(token).first());
}

function createPreviewToken() {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

const cleanText = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '');
const cleanDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

// 記事を保存する。戻り値は { article, issues } か { error, issues }。
//   allowPublish: false のとき（AIエージェントの入稿）は下書きしか作れず、公開済みの記事は上書きできない
//   allowImport:  true のとき（既存記事の取り込み）だけ、HTML形式と日時の直接指定を受け付ける
export async function saveArticle(db, input = {}, { allowPublish = false, allowImport = false, now = new Date() } = {}) {
    const id = cleanText(input.id, 64);
    if (!isValidArticleId(id)) {
        return { error: 'URLに使うIDは、半角の英小文字・数字・ハイフン・アンダースコアで入力してください。', issues: [] };
    }

    const existing = await getArticle(db, id);
    if (input.isNew && existing) {
        return { error: `ID「${id}」の記事はすでにあります。別のIDにしてください。`, issues: [] };
    }
    if (!allowPublish && existing?.status === 'published') {
        return { error: `「${id}」は公開済みの記事です。公開済みの記事は管理画面から編集してください。`, issues: [] };
    }

    const importing = allowImport && input.import === true;
    const status = allowPublish && input.status === 'published' ? 'published' : 'draft';
    const article = {
        id,
        title: cleanText(input.title, 200),
        description: cleanText(input.description, 500),
        seoTitle: cleanText(input.seoTitle, 200),
        ogTitle: cleanText(input.ogTitle, 200),
        ogDescription: cleanText(input.ogDescription, 500),
        ogImage: input.ogImage?.url ? input.ogImage : null,
        thumbnail: input.thumbnail?.url ? input.thumbnail : null,
        body: typeof input.body === 'string' ? input.body.replace(/\r\n?/g, '\n').slice(0, 300_000) : '',
        // HTML形式は取り込んだ既存記事だけ。いったんHTMLで入った記事は、編集してもHTMLのまま扱う
        bodyFormat: importing && input.bodyFormat === 'html' ? 'html' : (existing?.bodyFormat || 'markup'),
        status,
    };

    const issues = checkArticle(article);
    if (status === 'published' && hasBlockingIssue(issues)) {
        return { error: '必須項目が足りないため公開できません。下書きとしては保存できます。', issues };
    }

    const nowIso = now.toISOString();
    const publishedAt = (importing && cleanDate(input.publishedAt))
        || cleanDate(allowPublish ? input.publishedAt : null)
        || existing?.publishedAt
        || (status === 'published' ? nowIso : null);

    let revisedAt = existing?.revisedAt || null;
    if (importing && cleanDate(input.revisedAt)) revisedAt = cleanDate(input.revisedAt);
    else if (status === 'published' && (input.bumpRevisedAt || !revisedAt)) {
        // 初めて公開するときは公開日と同じ。以降は「更新日を今日にする」を選んだときだけ進める
        revisedAt = existing?.status === 'published' || existing?.revisedAt ? nowIso : publishedAt;
    }

    const createdAt = (importing && cleanDate(input.createdAt)) || existing?.createdAt || nowIso;
    const updatedAt = (importing && cleanDate(input.updatedAt)) || nowIso;
    const previewToken = existing?.previewToken || createPreviewToken();

    await db.prepare(`
        INSERT INTO articles (id, title, description, seo_title, og_title, og_description, og_image, thumbnail,
                              body, body_format, status, published_at, revised_at, preview_token, created_at, updated_at)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16)
        ON CONFLICT (id) DO UPDATE SET
            title = ?2, description = ?3, seo_title = ?4, og_title = ?5, og_description = ?6, og_image = ?7,
            thumbnail = ?8, body = ?9, body_format = ?10, status = ?11, published_at = ?12, revised_at = ?13,
            updated_at = ?16
    `).bind(
        article.id, article.title, article.description, article.seoTitle || null, article.ogTitle || null,
        article.ogDescription || null, serializeImage(article.ogImage), serializeImage(article.thumbnail),
        article.body, article.bodyFormat, article.status, publishedAt, revisedAt, previewToken, createdAt, updatedAt,
    ).run();

    return { article: await getArticle(db, id), issues, wasPublished: existing?.status === 'published' };
}

// 取り込んだ記事（下書きとして入れてある）を、まとめて公開にする。
// 1つの文で切り替えるので、「一部の記事だけ公開されている」状態にはならない。
// 対象は、取り込みで入ったHTML形式で、公開日を持つ記事だけ
export async function publishImportedArticles(db, ids = []) {
    const validIds = [...new Set(ids)].filter(isValidArticleId).slice(0, 500);
    if (validIds.length === 0) return 0;

    const placeholders = validIds.map(() => '?').join(', ');
    const result = await db
        .prepare(`UPDATE articles SET status = 'published'
                  WHERE id IN (${placeholders}) AND body_format = 'html' AND published_at IS NOT NULL`)
        .bind(...validIds)
        .run();
    return result.meta?.changes ?? 0;
}

export async function deleteArticle(db, id) {
    await db.prepare('DELETE FROM articles WHERE id = ?').bind(id).run();
}
