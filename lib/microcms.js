import { cache } from 'react';
import { createClient } from 'microcms-js-sdk';
import { normalizeBlogPost } from './blogContentUpdates';

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
    throw new Error('MICROCMS_SERVICE_DOMAIN is required');
}

if (!process.env.MICROCMS_API_KEY) {
    throw new Error('MICROCMS_API_KEY is required');
}

export const client = createClient({
    serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
    apiKey: process.env.MICROCMS_API_KEY,
});

// searchParams等で動的レンダリングになるページではfetchがデフォルトで
// no-storeになるため、データキャッシュを明示する
const BLOG_REVALIDATE_SECONDS = 900;
const BLOG_CACHE = { next: { revalidate: BLOG_REVALIDATE_SECONDS } };

export const getBlogPostById = cache(async (id) => {
    try {
        const post = await client.get({
            endpoint: 'blogs',
            contentId: id,
            customRequestInit: BLOG_CACHE,
        });
        return normalizeBlogPost(post);
    } catch (error) {
        return null;
    }
});

export const getAllBlogPosts = cache(async () => {
    try {
        const data = await client.get({
            endpoint: 'blogs',
            queries: {
                fields: 'id,title,publishedAt,revisedAt,updatedAt,createdAt,thumbnail,description',
                orders: '-revisedAt',
                limit: 100,
            },
            customRequestInit: BLOG_CACHE,
        });
        return data.contents.map(normalizeBlogPost);
    } catch (error) {
        console.error('Failed to fetch blog posts:', error);
        return [];
    }
});
