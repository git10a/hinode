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

export function formatPostDate(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';

    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}.${m}.${day}`;
}
