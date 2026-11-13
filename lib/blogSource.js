import { cache } from 'react';
import { normalizeBlogPost } from './blogContentUpdates';
import { getDatabase } from './cloudflareEnv';
import { articleToPost, getPublishedArticle, listPublishedArticles } from './cms/articles';

// ブログ記事の読み込み元。
// CMS（D1）に公開記事があればそこから読み、無ければこれまでどおり microCMS から読む。
// D1 のバインディングが無い・テーブルが無い・まだ記事を取り込んでいない、のどの場合も microCMS に
// 落ちるので、CMS の準備が済む前にこのコードが本番へ出ても表示は変わらない。

const loadCmsPosts = cache(async () => {
    const db = await getDatabase();
    if (!db) return null;

    try {
        const articles = await listPublishedArticles(db);
        return articles.length > 0 ? { db, articles } : null;
    } catch (error) {
        console.warn('CMS (D1) から記事を読めなかったため microCMS を使います。', error.message);
        return null;
    }
});

// microCMS のモジュールは環境変数が無いと読み込み時に例外を投げるので、必要になってから読む
const loadMicrocms = () => import('./microcms');

export const getAllBlogPosts = cache(async () => {
    const cms = await loadCmsPosts();
    if (!cms) return (await loadMicrocms()).getAllBlogPosts();

    return cms.articles.map((article) => normalizeBlogPost(articleToPost(article)));
});

export const getBlogPostById = cache(async (id) => {
    const cms = await loadCmsPosts();
    if (!cms) return (await loadMicrocms()).getBlogPostById(id);

    try {
        return normalizeBlogPost(articleToPost(await getPublishedArticle(cms.db, id)));
    } catch (error) {
        console.error('CMS (D1) から記事を読めませんでした。', error.message);
        return null;
    }
});
