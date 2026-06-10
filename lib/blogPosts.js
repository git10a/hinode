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

export function formatPostDate(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';

    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}.${m}.${day}`;
}
