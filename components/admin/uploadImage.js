// 画像をブラウザ側で縮小してから CMS に送る（どこランの記事CMSの方式を移植）。
// 本文の画像は WebP、サムネイル・SNS用の画像は JPEG にする（SNSのクローラーは WebP を読めないことがある）。

// 本文の表示幅は 720px。高精細な画面向けに倍の 1440px を上限にする（microCMS のときと同じ）
export const BODY_IMAGE_MAX = 1440;
// SNSのカード画像の推奨は 1200x630。余裕を見て長辺 1600px まで
export const COVER_IMAGE_MAX = 1600;

async function resizeImage(file, maxSize, type) {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('画像を処理できませんでした。');
    // 透過部分が黒くならないよう、白で下塗りする
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const toBlob = (mime, quality) => new Promise((resolve) => canvas.toBlob(resolve, mime, quality));
    let blob = await toBlob(type, 0.82);
    // WebP で書き出せないブラウザ（古い Safari）は別の形式を返すので、JPEG でやり直す
    if (!blob || blob.type !== type) blob = await toBlob('image/jpeg', 0.85);
    if (!blob) throw new Error('画像を処理できませんでした。');

    const extension = blob.type === 'image/webp' ? 'webp' : 'jpg';
    return new File([blob], `image.${extension}`, { type: blob.type });
}

export async function uploadImage(file, { purpose = 'body' } = {}) {
    const isCover = purpose === 'cover';
    // アニメーションGIFは縮小すると止まってしまうので、そのまま送る
    const prepared = file.type === 'image/gif' && !isCover
        ? file
        : await resizeImage(file, isCover ? COVER_IMAGE_MAX : BODY_IMAGE_MAX, isCover ? 'image/jpeg' : 'image/webp');

    const formData = new FormData();
    formData.append('file', prepared);
    const response = await fetch('/api/cms/upload', { method: 'POST', body: formData });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.url) throw new Error(result.error || '画像をアップロードできませんでした。');

    return { url: result.url, width: result.width, height: result.height };
}
