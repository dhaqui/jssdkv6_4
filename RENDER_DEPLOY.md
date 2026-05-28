# Render へのデプロイ手順

## 前提条件

- [Render アカウント](https://render.com) を作成済みであること
- [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/) で Sandbox アプリを作成し、**Client ID** と **Client Secret** を取得済みであること

---

## デプロイ手順

### 方法 1 — render.yaml を使う（推奨）

1. このリポジトリを GitHub / GitLab にプッシュする
2. Render Dashboard → **New** → **Blueprint** を選択
3. リポジトリを選び、`render.yaml` が自動検出されることを確認して **Apply**
4. 環境変数の入力を求められるので設定する（下記参照）

### 方法 2 — 手動で Web Service を作成する

1. Render Dashboard → **New** → **Web Service**
2. リポジトリを接続
3. 以下を設定する

| 項目 | 値 |
|------|-----|
| **Environment** | `Node` |
| **Build Command** | `cd server/node && npm install --include=dev && npm run build && cd ../../client/prebuiltPages/react && npm install --include=dev && npm run build && cd ../../../client/components/paypalPayments/oneTimePayment/typescript && npm install --include=dev && npm run build` |
| **Start Command** | `cd server/node && NODE_ENV=production node dist/src/server.js` |

---

## 環境変数の設定

Render Dashboard の **Environment** タブで以下を設定してください。

| 変数名 | 説明 |
|--------|------|
| `PAYPAL_SANDBOX_CLIENT_ID` | PayPal Sandbox の Client ID |
| `PAYPAL_SANDBOX_CLIENT_SECRET` | PayPal Sandbox の Client Secret |
| `DOMAINS` | （任意）Fastlane を使う場合: カンマ区切りのドメイン名 例: `your-app.onrender.com` |

> **Note**: `PORT` は Render が自動的に設定します。手動で設定する必要はありません。

---

## ローカルで動作確認する場合

```bash
# .env ファイルを作成
cp .env.sample .env
# .env に PAYPAL_SANDBOX_CLIENT_ID と PAYPAL_SANDBOX_CLIENT_SECRET を入力

# サーバー起動
cd server/node
npm install
npm start

# ブラウザで確認
open http://localhost:8080
```

---

## デプロイ後の確認

デプロイ完了後、Render が発行する URL（例: `https://paypal-v6-sdk-demo.onrender.com`）にアクセスすると、各種決済フローのデモページが表示されます。

利用可能なデモ:

- PayPal ボタン（ゲスト決済）
- Card Fields（クレジットカード入力）
- Venmo
- Google Pay
- Apple Pay
- Pay Later メッセージ
- Fastlane
- その他
