function getDateTime(value) {
    const time = new Date(value || '').getTime();
    return Number.isNaN(time) ? 0 : time;
}

export function getPostDisplayDate(post = {}) {
    return post.revisedAt || post.updatedAt || post.publishedAt || post.createdAt || '';
}

export function comparePostsByDisplayDate(a, b) {
    const displayDateDiff = getDateTime(getPostDisplayDate(b)) - getDateTime(getPostDisplayDate(a));
    if (displayDateDiff !== 0) return displayDateDiff;

    return getDateTime(b?.publishedAt) - getDateTime(a?.publishedAt);
}

export function sortBlogPosts(posts = []) {
    return [...posts].sort(comparePostsByDisplayDate);
}

// microCMSのリッチエディタが出力する本文HTMLの<img>を表示そのまま軽量化する。
// 本文画像はファーストビュー外なのでlazy化し、microCMS(imgix)画像は
// WebP変換と本文幅(720px@2x)への縮小を画像APIに任せる。
const MICROCMS_IMG_PARAMS = 'fm=webp&q=75&w=1440';

export function optimizeBlogContentHtml(html) {
    if (!html) return html;
    return html.replace(/<img\b[^>]*>/g, (tag) => {
        let optimized = tag.replace(
            /src="(https:\/\/images\.microcms-assets\.io\/[^"?]+)"/,
            `src="$1?${MICROCMS_IMG_PARAMS}"`
        );
        if (!/\bloading=/.test(optimized)) {
            optimized = optimized.replace(/^<img/, '<img loading="lazy"');
        }
        if (!/\bdecoding=/.test(optimized)) {
            optimized = optimized.replace(/^<img/, '<img decoding="async"');
        }
        return optimized;
    });
}

function decodeHtmlEntities(text) {
    return text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#0?39;/g, "'")
        .replace(/&nbsp;/g, ' ');
}

// 本文HTMLからh2/h3を拾い、目次データを作りつつ見出しにidを採番する。
// microCMSのリッチエディタは見出しにidを出力しないため、ここで連番を振り、
// 目次の<a href="#id">と本文側のid属性を必ず一致させる。
// 返り値: { html: 加工済み本文(id付与＋画像最適化), toc: [{ id, level, text }] }
export function buildBlogContent(html) {
    if (!html) return { html: html || '', toc: [] };

    const toc = [];
    let index = 0;

    const withIds = html.replace(/<(h2|h3)\b([^>]*)>([\s\S]*?)<\/\1>/gi, (match, tag, attrs, inner) => {
        const text = decodeHtmlEntities(inner.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
        if (!text) return match; // 空見出しは目次に載せない

        index += 1;
        const id = `toc-${index}`;
        toc.push({ id, level: tag.toLowerCase() === 'h2' ? 2 : 3, text });

        const newAttrs = /\bid\s*=/.test(attrs)
            ? attrs.replace(/\bid\s*=\s*("[^"]*"|'[^']*')/i, `id="${id}"`)
            : `${attrs} id="${id}"`;
        return `<${tag}${newAttrs}>${inner}</${tag}>`;
    });

    return { html: optimizeBlogContentHtml(withIds), toc };
}

export function formatPostDate(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';

    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}.${m}.${day}`;
}
