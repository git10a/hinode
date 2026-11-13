import { revalidatePath } from 'next/cache';

// 記事を公開・更新したときに作り直すページ。microCMS の Webhook と CMS の保存の両方から呼ぶ
export function revalidateBlog(postId) {
    const paths = ['/', '/blog', '/sitemap.xml'];
    if (postId) paths.push(`/blog/${postId}`);

    for (const path of paths) {
        revalidatePath(path);
    }
    revalidatePath('/blog/[slug]', 'page');
    revalidatePath('/blog/topics/[topic]', 'page');

    return paths;
}
