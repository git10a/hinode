-- 記事CMS。id は記事URL（/blog/<id>）にそのまま使う。
CREATE TABLE articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    seo_title TEXT,
    og_title TEXT,
    og_description TEXT,
    -- 画像は {"url","width","height"} のJSON
    og_image TEXT,
    thumbnail TEXT,
    body TEXT NOT NULL DEFAULT '',
    -- 'markup': CMSの軽量記法 / 'html': microCMSから取り込んだ既存記事のHTML
    body_format TEXT NOT NULL DEFAULT 'markup' CHECK (body_format IN ('markup', 'html')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    -- 日時はISO 8601文字列
    published_at TEXT,
    revised_at TEXT,
    preview_token TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE INDEX articles_status_published ON articles (status, published_at);

-- ログイン試行の回数制限用
CREATE TABLE login_attempts (
    ip TEXT NOT NULL,
    attempted_at INTEGER NOT NULL
);

CREATE INDEX login_attempts_ip ON login_attempts (ip, attempted_at);
