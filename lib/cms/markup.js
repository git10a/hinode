// 記事本文の軽量記法（どこランの記事CMSから移植し、表・番号付きリスト・画像のaltを足したもの）。
// 1行が1ブロックになる。
//   ## 見出し / ### 小見出し
//   ![代替テキスト](画像URL "キャプション")  … 画像（キャプションは省略可）
//   YouTubeのURLだけの行                      … 動画の埋め込み
//   > 引用 / - 箇条書き / 1. 番号付き / ---   … 引用・リスト・区切り線
//   | 列 | 列 |                               … 表（2行目を |---|---| にすると1行目が見出し行）
//   行内: **太字** / [文字](URL) / URLそのまま（自動リンク）
// HTMLは解釈しない。本文に書かれたタグは文字として表示される。
// このファイルは管理画面のプレビュー（ブラウザ）からも使うので、サーバー専用のAPIに依存しない。

const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(text = '') {
    return String(text).replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

// リンク・画像に使えるURLだけを通す。javascript: などは文字として残す
export function safeUrl(value = '') {
    const url = value.trim();
    if (/^\/(?!\/)/.test(url)) return url; // サイト内パス
    if (!/^https?:\/\//i.test(url)) return null;
    try {
        return new URL(url).toString();
    } catch {
        return null;
    }
}

const YOUTUBE_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be', 'www.youtube-nocookie.com']);

// YouTubeの視聴URL（watch / youtu.be / shorts / live / embed）から動画IDと開始秒を取り出す
export function parseYoutubeUrl(value) {
    let url;
    try {
        url = new URL(value.trim());
    } catch {
        return null;
    }
    if (!/^https?:$/.test(url.protocol) || !YOUTUBE_HOSTS.has(url.hostname)) return null;

    const segments = url.pathname.split('/').filter(Boolean);
    let candidate = null;
    if (url.hostname === 'youtu.be') candidate = segments[0];
    else if (segments[0] === 'watch') candidate = url.searchParams.get('v');
    else if (['shorts', 'live', 'embed'].includes(segments[0])) candidate = segments[1];
    if (!candidate || !/^[\w-]{11}$/.test(candidate)) return null;

    const startText = url.searchParams.get('t') || url.searchParams.get('start') || '';
    const start = /^\d+s?$/.test(startText) ? Number.parseInt(startText, 10) : 0;
    return start > 0 ? { videoId: candidate, start } : { videoId: candidate };
}

// アップロードした画像のURLは「…-1600x1067.jpg」のように末尾へ寸法を持つ（lib/cms/media.js）。
// 表示時にDBを引かずに width / height を付けるための取り決め
export function getImageSizeFromUrl(url = '') {
    const match = /-(\d{1,5})x(\d{1,5})\.(?:jpe?g|png|webp|gif)(?:[?#].*)?$/i.exec(url);
    return match ? { width: Number(match[1]), height: Number(match[2]) } : null;
}

// **太字** / [文字](URL) / 裸のURL。裸のURLは空白と和文の句読点・括弧で終わる
const INLINE_PATTERN = /\*\*(.+?)\*\*|\[([^\]\n]+)\]\(([^)\s]+)\)|(https?:\/\/[^\s<>「」、。）)]+)/g;

export function parseInline(text = '') {
    const result = [];
    const pushText = (value) => {
        if (!value) return;
        const last = result.at(-1);
        if (last?.type === 'text') last.text += value;
        else result.push({ type: 'text', text: value });
    };

    let cursor = 0;
    for (const match of text.matchAll(INLINE_PATTERN)) {
        pushText(text.slice(cursor, match.index));
        cursor = match.index + match[0].length;

        if (match[1] !== undefined) {
            result.push({ type: 'bold', text: match[1] });
            continue;
        }
        const href = safeUrl(match[3] ?? match[4]);
        if (href) result.push({ type: 'link', text: match[2] ?? match[4], href });
        else pushText(match[0]);
    }
    pushText(text.slice(cursor));
    return result;
}

function splitTableRow(line) {
    return line.replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());
}

const isTableSeparator = (cells) => cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));

export function parseArticleBody(body = '') {
    const blocks = [];
    const lines = body.replace(/\r\n?/g, '\n').split('\n');

    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) {
            // 空行は表とリストの切れ目になる
            blocks.push({ type: 'gap' });
            continue;
        }

        const heading = /^(#{2,3})\s+(.+)$/.exec(line);
        if (heading) {
            blocks.push({ type: 'heading', level: heading[1].length, text: heading[2].trim() });
            continue;
        }

        if (/^(-{3,}|\*{3,})$/.test(line)) {
            blocks.push({ type: 'divider' });
            continue;
        }

        const image = /^!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]*)")?\)$/.exec(line);
        const imageSrc = image && safeUrl(image[2]);
        if (image && imageSrc) {
            blocks.push({
                type: 'image',
                src: imageSrc,
                alt: image[1].trim(),
                caption: (image[3] || '').trim(),
                ...getImageSizeFromUrl(imageSrc),
            });
            continue;
        }

        const youtube = /^https?:\/\/\S+$/.test(line) ? parseYoutubeUrl(line) : null;
        if (youtube) {
            blocks.push({ type: 'youtube', ...youtube });
            continue;
        }

        if (line.startsWith('|')) {
            const cells = splitTableRow(line);
            const last = blocks.at(-1);
            if (last?.type === 'table') {
                if (last.rows.length === 1 && !last.hasHeader && isTableSeparator(cells)) last.hasHeader = true;
                else last.rows.push(cells.map(parseInline));
            } else {
                blocks.push({ type: 'table', hasHeader: false, rows: [cells.map(parseInline)] });
            }
            continue;
        }

        const quote = /^>\s*(.+)$/.exec(line);
        if (quote) {
            blocks.push({ type: 'quote', inline: parseInline(quote[1]) });
            continue;
        }

        const listItem = /^[-*]\s+(.+)$/.exec(line) || /^\d+[.)]\s+(.+)$/.exec(line);
        if (listItem) {
            const ordered = /^\d/.test(line);
            const last = blocks.at(-1);
            if (last?.type === 'list' && last.ordered === ordered) last.items.push(parseInline(listItem[1]));
            else blocks.push({ type: 'list', ordered, items: [parseInline(listItem[1])] });
            continue;
        }

        blocks.push({ type: 'paragraph', inline: parseInline(line) });
    }

    return blocks.filter((block) => block.type !== 'gap');
}

function renderInline(inline = []) {
    return inline.map((node) => {
        if (node.type === 'bold') return `<strong>${escapeHtml(node.text)}</strong>`;
        if (node.type === 'link') {
            // サイト内リンクは同じタブ、外部リンクは別タブで開く
            const external = !node.href.startsWith('/');
            const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
            return `<a href="${escapeHtml(node.href)}"${attrs}>${escapeHtml(node.text)}</a>`;
        }
        return escapeHtml(node.text);
    }).join('');
}

function renderBlock(block) {
    switch (block.type) {
        case 'heading':
            return `<h${block.level}>${escapeHtml(block.text)}</h${block.level}>`;
        case 'paragraph':
            return `<p>${renderInline(block.inline)}</p>`;
        case 'divider':
            return '<hr>';
        case 'quote':
            return `<blockquote><p>${renderInline(block.inline)}</p></blockquote>`;
        case 'list': {
            const tag = block.ordered ? 'ol' : 'ul';
            return `<${tag}>${block.items.map((item) => `<li>${renderInline(item)}</li>`).join('')}</${tag}>`;
        }
        case 'image': {
            const size = block.width && block.height ? ` width="${block.width}" height="${block.height}"` : '';
            const caption = block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : '';
            return `<figure><img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt)}"${size} loading="lazy" decoding="async">${caption}</figure>`;
        }
        case 'youtube': {
            const start = block.start ? `?start=${block.start}` : '';
            return '<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">'
                + `<iframe src="https://www.youtube-nocookie.com/embed/${block.videoId}${start}" title="YouTube動画" loading="lazy"`
                + ' style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;"'
                + ' allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>';
        }
        case 'table': {
            const [first, ...rest] = block.rows;
            const row = (cells, tag) => `<tr>${cells.map((cell) => `<${tag}>${renderInline(cell)}</${tag}>`).join('')}</tr>`;
            const bodyRows = block.hasHeader ? rest : block.rows;
            const head = block.hasHeader ? `<thead>${row(first, 'th')}</thead>` : '';
            return `<table>${head}<tbody>${bodyRows.map((cells) => row(cells, 'td')).join('')}</tbody></table>`;
        }
        default:
            return '';
    }
}

export function renderBlocksToHtml(blocks = []) {
    return blocks.map(renderBlock).join('\n');
}

// 軽量記法の本文をHTMLにする。入力はすべてエスケープされるので、そのまま埋め込める
export function renderMarkupToHtml(body = '') {
    return renderBlocksToHtml(parseArticleBody(body));
}
