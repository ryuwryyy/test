# 円環の理へ

顔写真をアップロードすると、AI が「円環の理に導かれた姿」（女神風イラスト）を生成し、SNS でシェアできる非公式ファンメイドサイト。

## しくみ

```
[ブラウザ] 写真を 1024px に縮小 → POST /api/generate
[API]      OpenAI 画像編集 (gpt-image-2) → Vercel Blob に PNG 保存 → id を返す
[/r/{id}]  結果ページ。X / LINE / Facebook / リンク共有 / 画像保存
[/r/{id}/opengraph-image]  生成画像入りの OGP 画像 (1200x630) を next/og で動的生成
```

- 元の顔写真はどこにも保存しない。生成画像だけを公開 URL で保存する（シェアと OGP に必要なため）。
- 公式画像は同梱していない。プロンプトで見た目の特徴だけを指示している（`lib/site.ts` の `PROMPT`）。

## ローカルで動かす

```bash
cp .env.example .env.local   # 値を入れる
npm install
npm run dev
```

## デプロイ (Vercel)

1. リポジトリを Import（Root Directory は空のまま）
2. Storage → Blob ストアを作成して接続（`BLOB_STORE_ID` か `BLOB_READ_WRITE_TOKEN` が自動で入る）
3. `OPENAI_API_KEY` を環境変数に設定（独自ドメインを使う場合は `NEXT_PUBLIC_SITE_URL` も）

## 公開前に検討したいこと

- レート制限：生成 1 回ごとに API 料金がかかるので、IP ごとの制限（Upstash Ratelimit など）を入れるのがおすすめ
- 生成画像の削除依頼への対応窓口
