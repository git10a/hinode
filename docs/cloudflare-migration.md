# HINODE Cloudflare 移行

## 現在の状態（2026-09-23）

- Next.js 16 / React 19 / vinext を使う Workers 版を用意した。既存の Next.js ビルドも通る。
- Workers のローカル実行で `/`、`/blog`、`/schedule`、`/contact`、`/sitemap.xml`、`/robots.txt` が 200。問い合わせの不正入力は 400、microCMS の不正署名は 401。公開プレビューでも正しい署名の検証用 Webhook が 200 と `skipped` を返した。
- プレビュー Worker: `https://hinode-migration-preview.tomtom211997.workers.dev`。microCMS と Strava の 7 項目は登録済み。公開サイトのサイトマップにある 54 ルートについて、Vercel 本番とプレビューの HTTP 200、タイトル、主見出しが一致した。日程ページに表示される Strava イベントの日時とリンクも一致した。
- 問い合わせ送信とブログの GA4 人気記事用の 5 項目は未登録。Vercel の `Sensitive` 設定から値を読み戻せないため、元の値または新しい認証情報が必要。現時点で問い合わせの実送信は未確認。ブログの「おすすめ記事」は GA4 が使えず本番と別の記事を表示している。
- `hinode-run.com` の Cloudflare ゾーンは `pending`。ドメインは Vercel から購入・管理されている（登録事業者は Name.com）。現在の NS は `ns1.vercel-dns.com` と `ns2.vercel-dns.com`。Cloudflare の割り当て NS は `marek.ns.cloudflare.com` と `may.ns.cloudflare.com`。NS の変更は Vercel のドメイン管理画面から行える。
- 公開サイトは Vercel から 200 を返している。移行の検証が終わるまで維持する。
- Cloudflare には旧 `hinode-web` Worker がある。現在の移行プレビューとは別で、公開ドメインへの割り当てはない。切り替え前に整理するが、検証が終わるまで消さない。

## DNS の引き継ぎ

- Cloudflare ゾーンには 15 件のレコードが取り込まれている。`corp` の CNAME (`hinode-corporate.pages.dev`)、`send` の MX/TXT、`resend._domainkey` の DKIM、Google サイト所有権 TXT、3 件の CAA は Vercel DNS と照合済み。
- Cloudflare 側にある `hinode-run.com`、`www`、ワイルドカードの A レコードは旧ホスティング先を指している。Worker のカスタムドメイン登録は apex の既存 A レコードと衝突して拒否された。切り替え前に旧 Web レコードを整理し、apex を Worker に接続する。`www` の転送も別途設定する。
- `corp.hinode-run.com` は別の Cloudflare Pages サイトなので、その CNAME を維持する。メール送信用の MX/TXT/DKIM も維持する。
- 親ゾーンに DNSSEC の DS レコードは見つからなかった。切り替え直前に再確認する。

## 作業の順序

1. 問い合わせ送信に必要な Resend の API キー、送信元・送信先アドレス、ブログの人気記事表示に必要な GA4 のプロパティ ID とサービスアカウント認証情報をプレビュー Worker に登録する。
2. プレビューで主要ページ、ブログ個別記事、Strava の次回予定、問い合わせの実送信、microCMS の更新通知とキャッシュ更新を確認する。画像表示とレイアウトも本番と比較する。
3. Cloudflare DNS の既存 15 件を再確認し、Worker 用の Web レコードと `www` の転送を準備する。
4. Vercel のドメイン管理画面で NS を Cloudflare の割り当て先へ変更し、ゾーンが `active` になったことを確認する。Workers の Custom Domain に `hinode-run.com` を登録し、`www` の転送も設定する。
5. 複数の公開 DNS リゾルバーで権威 NS と Web/メールレコードを確認し、HTTPS、全主要ページ、API、Webhook、問い合わせ実送信を本番ドメインで確認する。
6. GitHub から Workers への自動デプロイを設定して更新経路を固定する。その後、Vercel の旧ホスティングプロジェクトを停止する。ドメイン登録も Vercel から移す場合は、Cloudflare Registrar への移管を別途行う。

## ローカル確認

Node.js 24 を使用する。

```sh
npm ci
npm run build
npm run build:vinext
npm run lint
```

ローカル Workers 実行では、Wrangler が参照する `dist/server/.dev.vars` に開発用の環境変数を置く。これは Git に含めず、確認後に削除する。`dist/server` はビルド生成物。
