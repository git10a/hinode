# HINODE Cloudflare 移行

## アカウント移動（2026-09-26）

RUNDE と同じ Cloudflare アカウントが Workers 無料枠（1日10万リクエスト・アカウント共通）を分け合っていたため、HINODE を `hinode.run@gmail.com` のアカウント（`cd288c7e5f37d2adce330bd0aab52f6f`）へ移した。Worker 名・DNS レコード・Route・www→apex の 308 転送は同じ構成で再現し、Vercel（レジストラ）のネームサーバーを `bayan.ns.cloudflare.com` / `sky.ns.cloudflare.com` に変更した。以下の 09-23 の記述のうち、旧アカウントとネームサーバー（marek/may）に関する部分は移動前のもの。

## 本番構成（2026-09-23）

- `hinode-run.com` の権威 DNS は Cloudflare（`marek.ns.cloudflare.com`、`may.ns.cloudflare.com`）。ゾーンは Active。
- 本番サイトは Cloudflare Worker `hinode-migration-preview` に `hinode-run.com/*` の Route で割り当てた。Worker 名は移行時の名前のまま。`www.hinode-run.com` は Cloudflare の Redirect Rule で apex へ 308 転送し、パスとクエリを維持する。
- apex と `www` の Proxied A レコードは Cloudflare が originless 構成向けに案内する予約アドレス `192.0.2.0` / `192.0.2.1` を使用する。Worker とリダイレクトが本番リクエストを処理する。ワイルドカード A も旧 Vercel IP から同じ予約アドレスに変更したが、ワイルドカードは DNS only で公開サービスには使わない。
- `corp.hinode-run.com` の Cloudflare Pages 用 CNAME、Resend の `send` MX/TXT と `resend._domainkey` TXT、Google 所有権 TXT、CAA は維持した。Vercel 経由で購入したドメインの登録・更新は引き続き Vercel/Name.com にある。Cloudflare Registrar への移管は追加の更新料が発生するため未実施。
- 旧 Vercel `hinode` プロジェクトと `hinode-run.com` / `www.hinode-run.com` の接続は、古い DNS キャッシュを使う利用者のため一時的に残す。GitHub リポジトリとの接続は解除済みで、新しいコミットは Vercel に自動デプロイされない。DNS キャッシュの切り替わりを確認後に、Vercel プロジェクトからドメインを外す。

## デプロイと秘密値

- `main` への push と手動実行で GitHub Actions `Deploy HINODE to Cloudflare Workers` が Node.js 24、`npm ci`、`npm run build:vinext`、`npm run deploy:vinext` を実行する。初回の本番デプロイは [run 35850801707](https://github.com/git10a/hinode/actions/runs/35850801707) で成功した。
- GitHub Actions の `CLOUDFLARE_API_TOKEN` は `Hinode.run@gmail.com's Account` の `Workers Scripts:Edit` に限定したトークン（2026-09-26 に差し替え。以前は RUNDE と共有の `Tomtom211997@gmail.com's Account` 用）。対象アカウント内の他 Worker も編集できる権限なので、漏えい時は失効・再発行する。
- microCMS、Strava、GA4、Resend、問い合わせメール設定は Worker の秘密値に登録済み。Resend は `hinode-run.com` の Sending access に限定した新キー「HINODE Cloudflare Contact Form」を使う。既存の Vercel 用 Resend キーは残している。GA4 サービスアカウントの新しい鍵も登録済み。鍵のローカル原本は Downloads にあり、所有者のみ読み取り可能。
- `wrangler.jsonc` にドメインは記載せず、Cloudflare ダッシュボード側で Route と Redirect Rule を管理する。

## 切り替え時の確認

- 移行前、公開サイトマップの 54 ルートについて Vercel と Worker プレビューの HTTP 200、タイトル、主見出しが一致。Strava イベント表示と GA4 人気記事表示も一致。
- Cloudflare edge を直接指定した本番 HTTPS で `/`、`/blog`、`/schedule`、`/contact`、`/sitemap.xml`、`/robots.txt` は 200。`www` はパスとクエリを維持する 308。HTTPS 証明書も有効。
- 本番ホストの問い合わせ API は実送信で `200 {"ok":true}`、異なる Origin は 403。プレビューの実送信は Resend 側で `Delivered` を確認済み。microCMS Webhook の正しい署名と不正署名、Strava スケジュールもプレビューで確認済み。
- Cloudflare の権威 DNS と 1.1.1.1 / 8.8.8.8 で Cloudflare NS と apex / www の Cloudflare IP を確認。`send` MX と `corp` CNAME も確認。

## 残る運用整理

1. DNS キャッシュが Cloudflare へ切り替わったら、Vercel プロジェクトの apex / www 接続を解除する。ローカル macOS の resolver は切り替え直後も旧 Vercel IP を返していたため、キャッシュ保持中の接続解除は避ける。
2. Cloudflare の Custom Domain は既存 A レコードと衝突して登録できなかった。現在の Worker Route と予約アドレスで本番は動作する。将来 Custom Domain に変更する場合は、A レコード削除と新ドメイン作成の間に DNS 不在の時間を作らない手順を準備する。
3. `*.hinode-run.com` の未使用レコードと `_domainconnect` の Vercel CNAME は後で用途を確認して整理する。ドメイン登録を Vercel に残す間は `_domainconnect` を安易に削除しない。

## ローカル確認

Node.js 24 を使用する。

```sh
npm ci
npm run build
npm run build:vinext
npm run lint
```

開発用環境変数は Git に含めない。`dist/server` はビルド生成物。
