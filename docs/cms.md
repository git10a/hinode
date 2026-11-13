# HINODE CMS（記事の管理画面）

作成日: 2026-11-13

ブログ記事を自前で管理するための仕組み。どこラン（`git10a/dokorun` の `feat/article-cms`）の記事CMSを移植した。
microCMS の置き換えが目的だが、**本番の切り替えはまだしていない**。下の「本番への切り替え手順」を済ませるまで、サイトはこれまでどおり microCMS から記事を読む。

## できること

- `/admin` … パスワードでログインして、記事の一覧・新規作成・編集・下書き保存・公開・非公開・削除
- 本文エディタ … 見出し・太字・リンク・リスト・引用・表のボタン、横に並ぶプレビュー、画像の貼り付け・ドロップ・選択
- 記事ごとの設定 … タイトル（H1）、URL、説明文（meta description）、サムネイル、検索結果用のタイトル、SNS用のタイトル・説明・画像（OGP）、公開日
- 下書きの共有プレビュー … `/blog/preview/<トークン>`。URLを知っている人だけが見られる
- 体裁チェック … 保存前から画面に出る。必須項目（タイトル・説明文・本文）が欠けていると公開できない
- 公開の反映 … 公開・更新するとページを作り直す。デプロイは要らない
- AIエージェントの入稿 … `npm run article:push -- <ファイル>` で下書きを登録。**公開は人が管理画面から行う**

## 本文の書き方

1行が1ブロックになる。HTMLは使えない（書いても文字として表示される）。

| 書き方 | 表示 |
|---|---|
| `## 見出し` / `### 小見出し` | 見出し（目次に載る）。大見出し（H1）は記事タイトルだけ |
| `**太字**` | 太字 |
| `[文字](URL)` | リンク。`/schedule` のようなサイト内パスも書ける |
| `![画像の説明](URL "キャプション")` | 画像。説明（alt）は必ず書く。キャプションは省略可 |
| `- 項目` / `1. 項目` | 箇条書き / 番号付き |
| `> 引用` | 引用 |
| `---` | 区切り線 |
| `\| 列 \| 列 \|` | 表。2行目を `\|---\|---\|` にすると1行目が見出し行 |
| YouTubeのURLだけの行 | 動画の埋め込み |

画像は管理画面から入れる。ブラウザ側で縮小してからアップロードされる（本文は長辺1440pxのWebP、サムネイル・OGPは長辺1600pxのJPEG）。URLの末尾に寸法が入り、表示時に幅・高さ・遅延読み込みが自動で付く。

microCMS から取り込んだ既存記事は、本文をHTMLのまま保存している（検索順位がついているので中身を変えないため）。管理画面ではHTMLのまま編集する。

## AIエージェントの入稿

`docs/drafts/<id>.md` のようなファイルを用意する。先頭の `---` で囲んだ部分が設定、その下が本文。

```md
---
id: asa-run-fuyu-fukusou
title: 冬の朝ランは何を着る？気温別の服装
description: 冬の朝ランの服装を、気温ごとに実際の開催で着ているものから紹介します。……
---
## 気温5度の日
本文……
```

```bash
npm run article:push -- docs/drafts/asa-run-fuyu-fukusou.md
```

- 使えるキー: `id`（省略時はファイル名）、`title`、`description`、`seoTitle`、`ogTitle`、`ogDescription`、`thumbnail`、`ogImage`（画像はアップロード済みの `/media/...` のURL）
- 登録されるのは下書きだけ。すでに公開済みの記事は上書きできない（管理画面で編集する）
- 実行すると、編集画面とプレビューのURL、体裁チェックの結果が出る
- 送り先は `.env.local` の `CMS_BASE_URL`、認証は `CMS_API_TOKEN`

## ローカルで動かす

Node.js 24 を使う。

```bash
npm run cms:migrate
```

```bash
npm run dev:cms
```

- `http://localhost:3002/admin` を開く。`wrangler.local.jsonc`（D1 と R2 つきの設定）で動き、データは `.wrangler/state` に保存される
- `.env.local` に `ADMIN_PASSWORD`、`ADMIN_SESSION_SECRET`（32文字以上）、`CMS_API_TOKEN`（32文字以上）、`CMS_BASE_URL=http://localhost:3002` が要る（`.env.example` 参照）
- `npm run cms:import` で microCMS の公開記事をローカルの CMS に取り込める
- `npm run dev`（next dev）と `npm run dev:vinext` には D1 が無いので、記事は microCMS から読まれ、`/admin` は「データベースが設定されていません」と出る

## しくみ

| 役割 | 場所 |
|---|---|
| 記事の読み込み元の切り替え（D1 → 無ければ microCMS） | `lib/blogSource.js` |
| 記事の読み書き・公開のルール | `lib/cms/articles.js`、`migrations/0001_cms.sql` |
| 本文の記法 → HTML | `lib/cms/markup.js` |
| 体裁チェック | `lib/cms/checks.js` |
| ログイン・トークン・回数制限 | `lib/cms/auth.js` |
| 画像の検証と保存キー | `lib/cms/media.js`、`lib/cms/imageSize.js` |
| API | `app/api/cms/*`（login / logout / articles / drafts / upload） |
| 画像の配信 | `app/media/[...key]/route.js`（R2 から読む） |
| 管理画面 | `app/admin/*`、`components/admin/*` |
| 下書きプレビュー | `app/blog/preview/[token]/page.js` |

読み込み元は「D1 に公開記事が1件以上あれば D1、そうでなければ microCMS」。D1 のバインディングが無い、テーブルが無い、記事を取り込んでいない、のどれでも microCMS に落ちる。

守っていること:

- `/admin`、`/api/cms/`、`/blog/preview/` は `robots.txt` で除外し、ページには noindex を付けている。サイトマップにも入らない
- パスワードとトークンの照合は定数時間比較。セッションCookieは HttpOnly・SameSite=Lax・（https では）Secure
- ログインは同じIPから15分に5回失敗すると止まる
- Cookieで認証する書き込みは、同じサイトからの送信だけ受け付ける
- 画像は中身を読んで形式と寸法を確かめる（JPEG・PNG・WebP・GIF、5MBまで）
- 新形式の本文は HTML を解釈しない。HTML形式は取り込みのときにしか作れない

## 本番への切り替え手順

上から順に実行する。HINODE の Cloudflare アカウント（`docs/cloudflare-migration.md`）で行うこと。
以下の `wrangler` は、デプロイスクリプトと同じ `XDG_CONFIG_HOME=~/.wrangler-hinode` と `CLOUDFLARE_ACCOUNT_ID` を指定して実行する。

1. **D1 を作る**

   ```bash
   npx wrangler d1 create hinode-cms
   ```

2. **R2 を作る**

   ```bash
   npx wrangler r2 bucket create hinode-media
   ```

3. **`wrangler.jsonc` にバインディングを足す**（1 で表示された `database_id` を入れる）。`wrangler.local.jsonc` の `d1_databases` と `r2_buckets` を写し、`database_id` だけ本物にする

4. **テーブルを作る**

   ```bash
   npx wrangler d1 migrations apply DB --remote
   ```

5. **秘密値を登録する**（Worker 名は `hinode-migration-preview`）。値はパスワード管理に保存する

   ```bash
   npx wrangler secret put ADMIN_PASSWORD --name hinode-migration-preview
   ```

   ```bash
   npx wrangler secret put ADMIN_SESSION_SECRET --name hinode-migration-preview
   ```

   ```bash
   npx wrangler secret put CMS_API_TOKEN --name hinode-migration-preview
   ```

6. **3 の変更を main に入れてデプロイする**。この時点では D1 が空なので、表示は microCMS のまま変わらない。`https://hinode-run.com/admin` にログインできることを確かめる

7. **既存記事を取り込む**（`CMS_BASE_URL` と `ADMIN_PASSWORD` を本番の値にして実行）

   ```bash
   CMS_BASE_URL=https://hinode-run.com ADMIN_PASSWORD=<本番のパスワード> npm run cms:import
   ```

   取り込みが終わった時点で、読み込み元が D1 に切り替わる。途中で止まった場合はもう一度実行すれば続きから入る

8. **確認する**。管理画面に21件並んでいること、記事ページ・`/blog`・`/sitemap.xml` が今までと同じであることを数ページで確かめる（全ページの巡回はしない）

9. **後片付け（別の変更として）**: microCMS の Webhook を止め、`lib/microcms.js`・`microcms-js-sdk`・`app/api/revalidate`・`lib/blogContentUpdates.js` の `CORRECTIONS`（本文に直接反映できる）を外す。microCMS のデータは、しばらく消さずに残す

戻したいときは、D1 の `articles` を空にすれば microCMS に戻る。

```bash
npx wrangler d1 execute DB --remote --command "DELETE FROM articles"
```

## 無料枠への影響（見積もり）

直近90日の検索流入は約1.2万クリック（1日130前後）。この規模では、どれも上限から遠い。

| | 無料枠 | 使う量の目安 |
|---|---|---|
| D1 読み取り | 500万行/日 | ページを作り直すたびに記事数ぶん（数十行）。1日数千行 |
| D1 書き込み | 10万行/日 | 保存1回で1行、ログイン失敗で1行 |
| R2 容量 | 10GB | 画像1枚 100〜300KB。年150本×3枚でも 150MB 前後 |
| R2 操作 | 書き100万回/月、読み1,000万回/月 | 画像の表示1回で読み1回（キャッシュに乗れば減る） |
| Worker リクエスト | 10万回/日（アカウント共通） | 画像は Worker 経由で返すので、表示1回ごとに1リクエスト増える |

画像を Worker 経由で返しているのは、DNS の変更を不要にするため。本番では vinext の CDN アダプターがブラウザ向けのキャッシュ指定を「毎回確認」に書き換えるので、ブラウザは表示のたびに確認のリクエストを送る（中身が同じなら 304 で本体は送らない）。Cloudflare のエッジ側でどこまでキャッシュされるかは、本番で未確認。リクエスト数が気になるようになったら、R2 に独自ドメインを割り当てて直接配信に変える。
