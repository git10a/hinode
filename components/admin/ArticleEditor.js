'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import postStyles from '@/app/blog/[slug]/post.module.css';
import { DESCRIPTION_MAX, DESCRIPTION_MIN, checkArticle, hasBlockingIssue } from '@/lib/cms/checks';
import {
    applyEdit,
    insertLineEdit,
    linkEdit,
    pastedImageFiles,
    toggleLinePrefixEdit,
    toggleWrapEdit,
} from '@/lib/cms/editing';
import { renderMarkupToHtml } from '@/lib/cms/markup';
import styles from './admin.module.css';
import { uploadImage } from './uploadImage';

const EMPTY_ARTICLE = {
    id: '',
    title: '',
    description: '',
    seoTitle: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: null,
    thumbnail: null,
    body: '',
    bodyFormat: 'markup',
    status: 'draft',
    publishedAt: null,
    revisedAt: null,
    previewToken: '',
};

const TABLE_TEMPLATE = '| 項目 | 内容 |\n|---|---|\n| 例 | 例 |';
const IMAGE_ALT_PLACEHOLDER = '画像の説明';

// ISO文字列 ⇔ <input type="datetime-local"> の値（表示は端末の時刻）
function toLocalInput(iso) {
    if (!iso) return '';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
}

const fromLocalInput = (value) => (value ? new Date(value).toISOString() : null);

function ImageField({ label, hint, image, onChange, onError }) {
    const [uploading, setUploading] = useState(false);

    async function handleFile(event) {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;
        setUploading(true);
        try {
            onChange(await uploadImage(file, { purpose: 'cover' }));
        } catch (error) {
            onError(error.message);
        }
        setUploading(false);
    }

    return (
        <div className={styles.field}>
            <span className={styles.label}>{label}</span>
            {hint && <span className={styles.hint}>{hint}</span>}
            {image?.url && (
                // eslint-disable-next-line @next/next/no-img-element -- 管理画面のプレビュー。最適化は不要
                <img className={styles.imagePreview} src={image.url} alt="" width={image.width || undefined} height={image.height || undefined} />
            )}
            <div className={styles.inlineActions}>
                <label className={styles.secondaryButton}>
                    {uploading ? 'アップロード中…' : image?.url ? '画像を差し替える' : '画像を選ぶ'}
                    <input type="file" accept="image/*" className={styles.visuallyHidden} onChange={handleFile} disabled={uploading} />
                </label>
                {image?.url && (
                    <button type="button" className={styles.textButton} onClick={() => onChange(null)}>外す</button>
                )}
            </div>
        </div>
    );
}

// 公開ページを作り直す。保存とは別のリクエストで、失敗しても保存は済んでいる（反映が遅れるだけ）
async function requestRevalidate(id) {
    try {
        const response = await fetch('/api/cms/revalidate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        return response.ok;
    } catch {
        return false;
    }
}

export default function ArticleEditor({ article = null }) {
    const isNew = !article;
    const router = useRouter();
    const [values, setValues] = useState({ ...EMPTY_ARTICLE, ...article });
    const [saved, setSaved] = useState(article);
    const [bumpRevisedAt, setBumpRevisedAt] = useState(true);
    const [notice, setNotice] = useState(null); // { type: 'ok' | 'error', text }
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [mobilePane, setMobilePane] = useState('edit');
    const bodyRef = useRef(null);
    const fileRef = useRef(null);

    const isHtml = values.bodyFormat === 'html';
    const isPublished = saved?.status === 'published';
    const issues = useMemo(() => checkArticle(values), [values]);
    const previewHtml = useMemo(
        () => (isHtml ? values.body : renderMarkupToHtml(values.body)),
        [isHtml, values.body]
    );

    const set = (key, value) => {
        setValues((current) => ({ ...current, [key]: value }));
        setDirty(true);
    };

    // 保存していない変更があるときは、ページを離れる前に確認する
    useEffect(() => {
        if (!dirty) return undefined;
        const warn = (event) => event.preventDefault();
        window.addEventListener('beforeunload', warn);
        return () => window.removeEventListener('beforeunload', warn);
    }, [dirty]);

    function runEdit(createEdit) {
        const textarea = bodyRef.current;
        if (!textarea) return;
        const edit = createEdit(textarea.value, textarea.selectionStart, textarea.selectionEnd);
        set('body', applyEdit(textarea.value, edit));
        // 値の反映を待ってから、選択範囲を戻す
        requestAnimationFrame(() => {
            textarea.focus();
            textarea.setSelectionRange(edit.select[0], edit.select[1]);
        });
    }

    async function insertImages(files) {
        if (!files.length) return;
        setUploading(true);
        setNotice(null);
        try {
            for (const file of files) {
                const { url } = await uploadImage(file);
                // 代替テキストの部分を選択した状態で入れ、続けて書き換えられるようにする
                runEdit((body, start) => insertLineEdit(
                    body, start, `![${IMAGE_ALT_PLACEHOLDER}](${url})`, [2, 2 + IMAGE_ALT_PLACEHOLDER.length]
                ));
            }
        } catch (error) {
            setNotice({ type: 'error', text: error.message });
        }
        setUploading(false);
    }

    function handlePaste(event) {
        if (isHtml) return;
        const data = event.clipboardData;
        const images = pastedImageFiles({
            types: Array.from(data.types),
            text: data.getData('text/plain'),
            files: Array.from(data.files),
        });
        if (!images.length) return;
        event.preventDefault();
        insertImages(images);
    }

    function handleDrop(event) {
        const images = Array.from(event.dataTransfer?.files || []).filter((file) => file.type.startsWith('image/'));
        if (!images.length || isHtml) return;
        event.preventDefault();
        insertImages(images);
    }

    async function save(status) {
        setSaving(true);
        setNotice(null);
        try {
            const response = await fetch('/api/cms/articles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...values, status, isNew: isNew && !saved, bumpRevisedAt }),
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) {
                setNotice({ type: 'error', text: result.error || '保存できませんでした。' });
                setSaving(false);
                return;
            }

            setDirty(false);
            if (isNew && !saved) {
                // 新規作成のあとは、その記事の編集ページへ移る
                if (result.needsRevalidate) await requestRevalidate(result.article.id);
                router.push(`/admin/articles/${result.article.id}`);
                return;
            }
            setSaved(result.article);
            setValues({ ...EMPTY_ARTICLE, ...result.article });
            const reflected = result.needsRevalidate ? await requestRevalidate(result.article.id) : true;
            let text = '下書きとして保存しました。';
            if (status === 'published') {
                text = reflected
                    ? '公開しました。サイトに反映されています。'
                    : '公開しました。キャッシュの消去が混み合っているため、サイトへの反映に最大15分かかります。';
            } else if (result.needsRevalidate) {
                text = reflected
                    ? '非公開に戻しました。'
                    : '非公開に戻しました。サイトから消えるまで最大15分かかります。';
            }
            setNotice({ type: 'ok', text });
        } catch {
            setNotice({ type: 'error', text: '通信に失敗しました。もう一度お試しください。' });
        }
        setSaving(false);
    }

    async function remove() {
        if (!window.confirm(`「${saved.title}」を削除します。元に戻せません。よろしいですか？`)) return;
        const response = await fetch(`/api/cms/articles/${saved.id}`, { method: 'DELETE' });
        if (response.ok) {
            const result = await response.json().catch(() => ({}));
            if (result.needsRevalidate) await requestRevalidate(saved.id);
            setDirty(false);
            router.push('/admin');
            router.refresh();
        } else {
            setNotice({ type: 'error', text: '削除できませんでした。' });
        }
    }

    function handleKeyDown(event) {
        if (!(event.metaKey || event.ctrlKey)) return;
        if (event.key === 's') {
            event.preventDefault();
            save(isPublished ? 'published' : 'draft');
        } else if (event.key === 'b' && !isHtml && event.target === bodyRef.current) {
            event.preventDefault();
            runEdit((body, start, end) => toggleWrapEdit(body, start, end));
        }
    }

    const blocked = hasBlockingIssue(issues);
    const descriptionLength = values.description.trim().length;
    const tools = [
        { label: '見出し', title: '見出し（##）', run: (body, start) => toggleLinePrefixEdit(body, start, '## ') },
        { label: '小見出し', title: '小見出し（###）', run: (body, start) => toggleLinePrefixEdit(body, start, '### ') },
        { label: '太字', title: '太字（Cmd+B）', run: (body, start, end) => toggleWrapEdit(body, start, end) },
        { label: 'リンク', title: 'リンク', run: (body, start, end) => linkEdit(body, start, end) },
        { label: 'リスト', title: '箇条書き', run: (body, start) => toggleLinePrefixEdit(body, start, '- ') },
        { label: '引用', title: '引用', run: (body, start) => toggleLinePrefixEdit(body, start, '> ') },
        { label: '表', title: '表を入れる', run: (body, start) => insertLineEdit(body, start, TABLE_TEMPLATE) },
    ];

    return (
        <div className={styles.editor} onKeyDown={handleKeyDown}>
            <div className={styles.actionBar}>
                <span className={isPublished ? styles.badgePublished : styles.badgeDraft}>
                    {isPublished ? '公開中' : '下書き'}
                </span>
                {dirty && <span className={styles.dirtyMark}>未保存の変更があります</span>}
                <div className={styles.actionButtons}>
                    {saved?.previewToken && (
                        <a className={styles.textButton} href={`/blog/preview/${saved.previewToken}`} target="_blank" rel="noopener noreferrer">
                            プレビュー ↗
                        </a>
                    )}
                    {isPublished && (
                        <a className={styles.textButton} href={`/blog/${saved.id}`} target="_blank" rel="noopener noreferrer">
                            公開ページ ↗
                        </a>
                    )}
                    <button type="button" className={styles.secondaryButton} onClick={() => save('draft')} disabled={saving}>
                        {isPublished ? '非公開に戻す' : '下書き保存'}
                    </button>
                    <button
                        type="button"
                        className={styles.primaryButton}
                        onClick={() => save('published')}
                        disabled={saving || blocked}
                        title={blocked ? '必須項目が足りません（下の体裁チェックを確認）' : undefined}
                    >
                        {isPublished ? '更新して公開' : '公開する'}
                    </button>
                </div>
            </div>

            {notice && (
                <p className={notice.type === 'ok' ? styles.noticeOk : styles.noticeError} role="status">{notice.text}</p>
            )}

            <section className={styles.section}>
                <label className={styles.field}>
                    <span className={styles.label}>タイトル</span>
                    <span className={styles.hint}>記事ページの大見出し（H1）になります。</span>
                    <input className={styles.input} value={values.title} onChange={(event) => set('title', event.target.value)} />
                </label>

                <label className={styles.field}>
                    <span className={styles.label}>URL</span>
                    <span className={styles.hint}>
                        {isNew && !saved
                            ? '半角の英小文字・数字・ハイフン。公開後は変えられません。'
                            : '公開後のURLは変えられません（検索順位を引き継ぐため）。'}
                    </span>
                    <span className={styles.slugRow}>
                        <span className={styles.slugPrefix}>/blog/</span>
                        <input
                            className={styles.input}
                            value={values.id}
                            onChange={(event) => set('id', event.target.value.toLowerCase())}
                            placeholder="asa-run-fuyu-fukusou"
                            disabled={!(isNew && !saved)}
                        />
                    </span>
                </label>

                <label className={styles.field}>
                    <span className={styles.label}>説明文（meta description）</span>
                    <span className={styles.hint}>
                        検索結果とSNSに出る説明です。{DESCRIPTION_MIN}〜{DESCRIPTION_MAX}字が目安。
                        <span className={descriptionLength < DESCRIPTION_MIN || descriptionLength > DESCRIPTION_MAX ? styles.countWarn : styles.count}>
                            {' '}現在 {descriptionLength} 字
                        </span>
                    </span>
                    <textarea className={styles.textarea} rows={3} value={values.description} onChange={(event) => set('description', event.target.value)} />
                </label>

                <ImageField
                    label="サムネイル"
                    hint="記事の先頭・一覧・SNSのカードに使います。横長（1200×630前後）がきれいに出ます。"
                    image={values.thumbnail}
                    onChange={(image) => set('thumbnail', image)}
                    onError={(text) => setNotice({ type: 'error', text })}
                />
            </section>

            <section className={styles.section}>
                <div className={styles.bodyHeader}>
                    <span className={styles.label}>本文</span>
                    {isHtml && <span className={styles.hint}>この記事は microCMS から取り込んだHTML形式です。HTMLのまま編集します。</span>}
                </div>

                {!isHtml && (
                    <div className={styles.toolbar} role="toolbar" aria-label="本文の編集">
                        {tools.map((tool) => (
                            <button key={tool.label} type="button" className={styles.toolButton} title={tool.title} onClick={() => runEdit(tool.run)}>
                                {tool.label}
                            </button>
                        ))}
                        <button type="button" className={styles.toolButton} title="画像を入れる（貼り付け・ドロップでも入ります）" onClick={() => fileRef.current?.click()} disabled={uploading}>
                            {uploading ? 'アップロード中…' : '画像'}
                        </button>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className={styles.visuallyHidden}
                            onChange={(event) => {
                                const files = Array.from(event.target.files || []);
                                event.target.value = '';
                                insertImages(files);
                            }}
                        />
                    </div>
                )}

                <div className={styles.paneTabs} role="tablist" aria-label="本文の表示切り替え">
                    {[['edit', '編集'], ['preview', 'プレビュー']].map(([key, label]) => (
                        <button
                            key={key}
                            type="button"
                            role="tab"
                            aria-selected={mobilePane === key}
                            className={mobilePane === key ? styles.paneTabActive : styles.paneTab}
                            onClick={() => setMobilePane(key)}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <div className={styles.panes} data-pane={mobilePane}>
                    <textarea
                        ref={bodyRef}
                        className={styles.bodyInput}
                        aria-label="本文"
                        value={values.body}
                        onChange={(event) => set('body', event.target.value)}
                        onPaste={handlePaste}
                        onDrop={handleDrop}
                        spellCheck={false}
                        placeholder={'## 見出し\n本文を書きます。1行が1段落になります。\n\n画像は貼り付けるか、ここにドロップしてください。'}
                    />
                    <div className={styles.previewPane} aria-label="本文のプレビュー">
                        <h1 className={postStyles.title}>{values.title || 'タイトル'}</h1>
                        {/* 新形式の本文はすべてエスケープ済み。HTML形式は取り込んだ既存記事だけ */}
                        <div className={postStyles.content} dangerouslySetInnerHTML={{ __html: previewHtml }} />
                    </div>
                </div>

                {!isHtml && (
                    <p className={styles.hint}>
                        書き方: <code>## 見出し</code>　<code>### 小見出し</code>　<code>**太字**</code>　<code>[文字](URL)</code>
                        <code>- 箇条書き</code>　<code>&gt; 引用</code>　<code>![画像の説明](URL &quot;キャプション&quot;)</code>
                    </p>
                )}
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>体裁チェック</h2>
                {issues.length === 0 ? (
                    <p className={styles.checkOk}>問題は見つかりませんでした。</p>
                ) : (
                    <ul className={styles.issueList}>
                        {issues.map((issue) => (
                            <li key={issue.code} className={issue.level === 'error' ? styles.issueError : styles.issueWarning}>
                                <span className={styles.issueLevel}>{issue.level === 'error' ? '必須' : '注意'}</span>
                                {issue.message}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <details className={styles.section}>
                <summary className={styles.sectionTitle}>検索・SNS向けの設定（任意）</summary>
                <label className={styles.field}>
                    <span className={styles.label}>検索結果のタイトル</span>
                    <span className={styles.hint}>空欄なら記事タイトルを使います。H1と変えたいときだけ入れます。</span>
                    <input className={styles.input} value={values.seoTitle} onChange={(event) => set('seoTitle', event.target.value)} placeholder={values.title} />
                </label>
                <label className={styles.field}>
                    <span className={styles.label}>SNSで表示するタイトル</span>
                    <input className={styles.input} value={values.ogTitle} onChange={(event) => set('ogTitle', event.target.value)} placeholder={values.seoTitle || values.title} />
                </label>
                <label className={styles.field}>
                    <span className={styles.label}>SNSで表示する説明</span>
                    <textarea className={styles.textarea} rows={2} value={values.ogDescription} onChange={(event) => set('ogDescription', event.target.value)} placeholder={values.description} />
                </label>
                <ImageField
                    label="SNSで表示する画像（OGP）"
                    hint="空欄ならサムネイルを使います。"
                    image={values.ogImage}
                    onChange={(image) => set('ogImage', image)}
                    onError={(text) => setNotice({ type: 'error', text })}
                />
            </details>

            <details className={styles.section}>
                <summary className={styles.sectionTitle}>日付の設定（任意）</summary>
                <label className={styles.field}>
                    <span className={styles.label}>公開日</span>
                    <span className={styles.hint}>空欄なら、最初に公開した日時になります。</span>
                    <input
                        type="datetime-local"
                        className={styles.input}
                        value={toLocalInput(values.publishedAt)}
                        onChange={(event) => set('publishedAt', fromLocalInput(event.target.value))}
                    />
                </label>
                {isPublished && (
                    <label className={styles.checkboxField}>
                        <input type="checkbox" checked={bumpRevisedAt} onChange={(event) => setBumpRevisedAt(event.target.checked)} />
                        <span>
                            更新日を今日にする
                            <span className={styles.hint}>誤字の修正など、内容が変わらない更新のときは外してください。</span>
                        </span>
                    </label>
                )}
            </details>

            {saved && (
                <section className={styles.dangerZone}>
                    <button type="button" className={styles.dangerButton} onClick={remove}>この記事を削除する</button>
                </section>
            )}
        </div>
    );
}
