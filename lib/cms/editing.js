// 記事エディタ（管理画面の本文欄）の編集操作。どこランの記事CMSから移植。
// 入力欄に依存しない形で書き、テストできるようにしている。
// 各関数は「どの範囲を何に置き換え、その後どこを選択するか」を { from, to, text, select } で返す。

function lineRange(body, position) {
    const start = body.lastIndexOf('\n', position - 1) + 1;
    const end = body.indexOf('\n', position);
    return { start, end: end < 0 ? body.length : end };
}

// カーソルのある行の次に、独立した行として差し込む（空行にいるときはその行に入れる）。
// selectOffset を渡すと、差し込んだ文字列の中のその範囲を選択する
export function insertLineEdit(body, position, line, selectOffset = null) {
    const { start, end } = lineRange(body, position);
    const blank = body.slice(start, end).trim() === '';
    const from = blank ? start : end;
    const text = `${blank ? '' : '\n'}${line}${body.startsWith('\n', end) ? '' : '\n'}`;
    const lineStart = from + (blank ? 0 : 1);
    const select = selectOffset
        ? [lineStart + selectOffset[0], lineStart + selectOffset[1]]
        : [lineStart + line.length, lineStart + line.length];
    return { from, to: end, text, select };
}

// カーソルのある行の先頭に記号を付ける。同じ記号が付いていれば外す
export function toggleLinePrefixEdit(body, position, prefix) {
    const { start, end } = lineRange(body, position);
    const line = body.slice(start, end);
    const stripped = line.replace(/^(#{2,3}|>|-)\s+/, '');
    const next = line.startsWith(prefix) ? stripped : `${prefix}${stripped}`;
    return { from: start, to: end, text: next, select: [start + next.length, start + next.length] };
}

// 選択範囲を前後の記号で囲む。すでに囲まれていれば外す（太字に使う）
export function toggleWrapEdit(body, start, end, mark = '**') {
    const selected = body.slice(start, end);
    const size = mark.length;
    if (!selected) {
        return { from: start, to: end, text: mark + mark, select: [start + size, start + size] };
    }
    if (selected.startsWith(mark) && selected.endsWith(mark) && selected.length > size * 2 && !selected.includes('\n')) {
        const inner = selected.slice(size, -size);
        return { from: start, to: end, text: inner, select: [start, start + inner.length] };
    }
    if (!selected.includes('\n') && body.slice(start - size, start) === mark && body.slice(end, end + size) === mark) {
        return { from: start - size, to: end + size, text: selected, select: [start - size, start - size + selected.length] };
    }
    // 太字は行をまたげないので、複数行を選んだときは行ごとに付ける。前後の空白は外に出す
    const lines = selected.split('\n').map((line) => {
        const core = line.trim();
        if (!core) return line;
        const lead = line.slice(0, line.indexOf(core));
        return `${lead}${mark}${core}${mark}${line.slice(lead.length + core.length)}`;
    });
    const text = lines.join('\n');
    if (lines.length === 1) {
        const lead = selected.length - selected.trimStart().length;
        const inner = selected.trim().length;
        return { from: start, to: end, text, select: [start + lead + size, start + lead + size + inner] };
    }
    return { from: start, to: end, text, select: [start, start + text.length] };
}

// 選択範囲をリンクにする。URLの部分を選択した状態にして、続けて貼り付けられるようにする
export function linkEdit(body, start, end) {
    const label = body.slice(start, end) || 'リンクの文字';
    const placeholder = 'https://';
    const text = `[${label}](${placeholder})`;
    const urlStart = start + label.length + 3;
    return { from: start, to: end, text, select: [urlStart, urlStart + placeholder.length] };
}

// 貼り付けの中身が「画像」かどうかを決める。画像なら、その画像ファイルを返す。
// WordやExcelは文字をコピーしても画像（見た目の写し）を一緒に入れてくるので、その場合は文字の貼り付けとして扱う
export function pastedImageFiles({ types = [], text = '', files = [] }) {
    const images = files.filter((file) => file.type.startsWith('image/'));
    if (!images.length || types.includes('text/rtf')) return [];
    // 画像だけのコピーでも、ファイル名やURLが文字として付くことがある。文章（空白や改行を含む）なら文字を優先する
    return /\s/.test(text.trim()) ? [] : images;
}

export function applyEdit(body, edit) {
    return body.slice(0, edit.from) + edit.text + body.slice(edit.to);
}
