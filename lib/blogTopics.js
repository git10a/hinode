export const BLOG_TOPICS = [
    {
        slug: 'courses',
        label: 'コース紹介',
        eyebrow: 'Running Courses',
        title: '東京の朝ランコース記事',
        description: '皇居・代々木公園・目黒川を中心に、距離、走りやすさ、朝の雰囲気を実際に走った視点で紹介します。',
        keywords: ['コース', '皇居', '目黒川', '代々木', '公園', 'ルート', 'スポット', '距離'],
    },
    {
        slug: 'beginners',
        label: '初心者向け',
        eyebrow: 'For Beginners',
        title: '朝ラン初心者ガイド',
        description: '初参加、ひとり参加、ペースや距離への不安など、朝ランを始める前に知っておきたいことをまとめています。',
        keywords: ['初参加', '初心者', '初めて', 'はじめて', '1人', '一人', '不安', '参加方法', '続かない'],
    },
    {
        slug: 'gear-and-facilities',
        label: '装備・施設',
        eyebrow: 'Gear & Facilities',
        title: '朝ランの装備・施設ガイド',
        description: 'ロッカー、シャワー、ランニングステーション、持ち物など、東京で朝ランするときの実用情報をまとめています。',
        keywords: ['装備', '持ち物', '荷物', 'ウェア', 'シューズ', 'シャワー', 'ロッカー', '銭湯', '施設', 'ランステ'],
    },
];

function normalizeText(value = '') {
    return value.toLowerCase().trim();
}

export function getBlogTopic(slug) {
    return BLOG_TOPICS.find((topic) => topic.slug === slug);
}

export function getPostTopicSlugs(post = {}) {
    const text = normalizeText(`${post.title || ''} ${post.description || ''}`);
    return BLOG_TOPICS
        .filter((topic) => topic.keywords.some((keyword) => text.includes(normalizeText(keyword))))
        .map((topic) => topic.slug);
}

export function getPostsForTopic(posts = [], topicSlug) {
    return posts.filter((post) => getPostTopicSlugs(post).includes(topicSlug));
}

export function getRelatedBlogPosts(posts = [], currentPost, limit = 3) {
    const currentTopics = new Set(getPostTopicSlugs(currentPost));
    const candidates = posts.filter((post) => post.id !== currentPost.id);

    return candidates
        .map((post, index) => ({
            post,
            index,
            score: getPostTopicSlugs(post).filter((slug) => currentTopics.has(slug)).length,
        }))
        .sort((a, b) => b.score - a.score || a.index - b.index)
        .slice(0, limit)
        .map(({ post }) => post);
}
