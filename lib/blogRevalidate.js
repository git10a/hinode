import { revalidatePath } from 'next/cache';

// 記事を公開・更新したときに作り直すページ。microCMS の Webhook と CMS（/api/cms/revalidate）から呼ぶ。
// 本番では Cloudflare のキャッシュ消去を伴い、短時間に何度も呼ぶと回数制限で失敗する。失敗すると
// このリクエスト自体がエラー（500）になるので、CMS では記事の保存とは別のリクエストに分けている
export function revalidateBlog(postId) {
    const paths = ['/', '/blog', '/sitemap.xml'];
    if (postId) paths.push(`/blog/${postId}`);

    for (const path of paths) {
        revalidatePath(path);
    }
    revalidatePath('/blog/[slug]', 'page');

    return paths;
}
