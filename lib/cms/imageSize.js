// 画像ファイルの先頭を読んで、形式と寸法を調べる（JPEG / PNG / WebP / GIF）。
// アップロードされたものが本当に画像かを確かめ、表示用の width / height を得るために使う。

function readJpeg(view) {
    let offset = 2;
    while (offset + 9 < view.byteLength) {
        if (view.getUint8(offset) !== 0xff) return null;
        const marker = view.getUint8(offset + 1);
        // SOF0〜SOF15（DHT・JPG・DACを除く）に寸法が入っている
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
            return { width: view.getUint16(offset + 7), height: view.getUint16(offset + 5) };
        }
        offset += 2 + view.getUint16(offset + 2);
    }
    return null;
}

function readWebp(view) {
    const chunk = String.fromCharCode(view.getUint8(12), view.getUint8(13), view.getUint8(14), view.getUint8(15));
    if (chunk === 'VP8X') {
        const width = 1 + (view.getUint8(24) | (view.getUint8(25) << 8) | (view.getUint8(26) << 16));
        const height = 1 + (view.getUint8(27) | (view.getUint8(28) << 8) | (view.getUint8(29) << 16));
        return { width, height };
    }
    if (chunk === 'VP8 ') {
        return { width: view.getUint16(26, true) & 0x3fff, height: view.getUint16(28, true) & 0x3fff };
    }
    if (chunk === 'VP8L') {
        const bits = view.getUint32(21, true);
        return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    return null;
}

export function readImageInfo(bytes) {
    const data = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    if (data.byteLength < 30) return null;
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    const ascii = (start, length) => String.fromCharCode(...data.subarray(start, start + length));

    let info = null;
    if (view.getUint16(0) === 0xffd8) {
        info = { type: 'image/jpeg', extension: 'jpg', ...readJpeg(view) };
    } else if (view.getUint32(0) === 0x89504e47) {
        info = { type: 'image/png', extension: 'png', width: view.getUint32(16), height: view.getUint32(20) };
    } else if (ascii(0, 4) === 'RIFF' && ascii(8, 4) === 'WEBP') {
        info = { type: 'image/webp', extension: 'webp', ...readWebp(view) };
    } else if (ascii(0, 3) === 'GIF') {
        info = { type: 'image/gif', extension: 'gif', width: view.getUint16(6, true), height: view.getUint16(8, true) };
    }

    return info?.width > 0 && info?.height > 0 ? info : null;
}
