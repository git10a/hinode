import { readImageInfo } from './imageSize.js';

// 画像の置き場（R2）。URLは /media/<キー> で、Worker が R2 から読んで返す（app/media/[...key]）。
// キーの末尾に「-幅x高さ」を入れておき、表示時にDBを引かずに width / height を付けられるようにする。

export const MEDIA_PATH = '/media/';

// ブラウザ側で縮小してから送るので、これを超えるのは想定外のファイル
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const MAX_DIMENSION = 6000;

export function validateImage(bytes) {
    if (bytes.byteLength > MAX_UPLOAD_BYTES) {
        return { error: `画像が大きすぎます（上限 ${MAX_UPLOAD_BYTES / 1024 / 1024}MB）。` };
    }
    const info = readImageInfo(bytes);
    if (!info) return { error: '画像として読み取れませんでした。JPEG・PNG・WebP・GIF のいずれかにしてください。' };
    if (info.width > MAX_DIMENSION || info.height > MAX_DIMENSION) {
        return { error: `画像の辺が長すぎます（上限 ${MAX_DIMENSION}px）。` };
    }
    return { info };
}

export function createMediaKey(info, now = new Date()) {
    const month = now.toISOString().slice(0, 7).replace('-', '/');
    return `articles/${month}/${crypto.randomUUID()}-${info.width}x${info.height}.${info.extension}`;
}

// 受け付けるキーは createMediaKey が作る形だけ（R2 の中を自由に読ませない）
export function isValidMediaKey(key = '') {
    return /^articles\/\d{4}\/\d{2}\/[0-9a-f-]{36}-\d{1,5}x\d{1,5}\.(jpg|png|webp|gif)$/.test(key);
}

export const mediaUrl = (key) => `${MEDIA_PATH}${key}`;
