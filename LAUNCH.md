# 🚀 ローンチチェックリスト（1人目の有料ユーザー獲得まで）

このドキュメントは「成約コーチ AI」を本番稼働させて1人目の有料ユーザー（Pro会員 ¥2,980/月）を獲得するまでに必要な**ユーザーの手動作業**を全てまとめています。

コード実装は完了済み。あとは外部サービスの設定とコンテンツ発信です。

---

## 📋 全体の進め方

| フェーズ | 作業 | 所要時間 |
|---|---|---|
| **Phase 1** | 本番環境の構築（Supabase/Stripe/Vercel/Resend） | 2時間 |
| **Phase 2** | 動作確認（E2Eスモークテスト） | 30分 |
| **Phase 3** | 集客の立ち上げ（Search Console/X/ブログ） | 1時間 |
| **Phase 4** | 1人目獲得を待つ（日々の投稿とSEO） | 継続 |

---

# Phase 1: 本番環境構築

## ✅ 1-1. Supabase マイグレーション実行

**場所**: Supabase SQL Editor
**所要**: 2分

1. https://supabase.com/dashboard/project/_/sql/new を開く
2. `migrations/001_enhance_roleplay_scores.sql` の中身を全部コピーして貼り付け
3. **Run** をクリック
4. 確認:
   ```sql
   SELECT column_name FROM information_schema.columns
   WHERE table_schema = 'public' AND table_name = 'roleplay_scores';
   ```
   → `summary`, `strengths`, `improvements`, `customer_type`, `product`, `conversation_log`, `updated_at` が含まれていればOK

## ✅ 1-2. Stripe商品の作成

**場所**: ローカル（Node実行）
**所要**: 5分

### 準備
1. https://dashboard.stripe.com/apikeys にアクセス
2. **Secret key** をコピー（`sk_test_...` または `sk_live_...`）
3. `.env.local` に追記：
   ```bash
   STRIPE_SECRET_KEY=sk_test_xxxxx
   ```

### 実行
```bash
node scripts/setup-stripe-products.mjs
```

出力される `STRIPE_PRO_PRICE_ID` `STRIPE_PRO_ANNUAL_PRICE_ID` `STRIPE_PROGRAM_PRICE_ID` を `.env.local` に追加。

### Webhook設定
1. https://dashboard.stripe.com/webhooks で「+エンドポイントを追加」
2. URL: `https://<your-domain>/api/webhooks/stripe`
3. イベント選択:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. **署名シークレット** をコピーして `.env.local` に:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

## ✅ 1-3. Resend メール設定

**場所**: https://resend.com
**所要**: 10分

1. アカウント作成 → API Key 発行
2. 送信元ドメインを追加（DNS設定必須）
   - DKIMレコード3つ、SPFレコード1つを設定
3. `.env.local` に追加:
   ```bash
   RESEND_API_KEY=re_xxxxx
   RESEND_FROM_EMAIL=成約コーチ AI <onboarding@your-domain.com>
   ```

> ⚠️ DNS未設定なら `onboarding@resend.dev`（Resendデフォルト）で暫定運用可能。1人目獲得までは後回しでOK。

## ✅ 1-4. Google Analytics 4 / Clarity

**所要**: 15分

### GA4
1. https://analytics.google.com で新規プロパティ作成
2. ウェブストリーム追加 → **測定ID**（`G-XXXXXXXXXX`）をコピー
3. `.env.local`:
   ```bash
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

### Microsoft Clarity（ヒートマップ・セッション記録、無料）
1. https://clarity.microsoft.com でプロジェクト作成
2. **プロジェクトID** をコピー
3. `.env.local`:
   ```bash
   NEXT_PUBLIC_CLARITY_PROJECT_ID=xxxxxxxxxx
   ```

## ✅ 1-5. Vercel 本番デプロイ

**場所**: https://vercel.com
**所要**: 20分

### 環境変数の設定

Vercel Dashboard → Settings → Environment Variables で **全環境（Production/Preview/Development）** に以下を設定：

#### 必須（これがないと壊れる）
| Key | 説明 | 取得元 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 公開キー | 同上 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase サービスロール | 同上（⚠️サーバー専用） |
| `ANTHROPIC_API_KEY` | Claude API キー | https://console.anthropic.com/settings/keys |
| `STRIPE_SECRET_KEY` | Stripe 秘密鍵 | Stripe Dashboard → API keys |
| `STRIPE_WEBHOOK_SECRET` | Webhook 署名検証 | Stripe → Webhooks → Signing secret |
| `STRIPE_PRO_PRICE_ID` | Pro月額価格ID | セットアップスクリプトの出力 |
| `STRIPE_PRO_ANNUAL_PRICE_ID` | Pro年額価格ID | 同上 |
| `NEXT_PUBLIC_APP_URL` | 本番ドメイン | `https://seiyaku-coach.com` |

#### 推奨（あった方が良い）
| Key | 説明 | 未設定時の影響 |
|---|---|---|
| `RESEND_API_KEY` | メール送信 | 登録完了メール等が飛ばない |
| `RESEND_FROM_EMAIL` | 送信元 | resend.dev になる |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 | 計測不能 |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Clarity | ヒートマップ不可 |
| `CRON_SECRET` | Vercel Cron 認証 | 一部バッチが動かない |
| `UNSUBSCRIBE_SECRET` | 配信停止リンク署名 | 既定値で動くが推奨 |
| `ADMIN_EMAIL` | /admin アクセス許可 | 管理画面アクセス不可 |
| `ADMIN_SECRET` | /admin 認証 | 同上 |

#### オプション
| Key | 説明 |
|---|---|
| `STRIPE_PROGRAM_PRICE_ID` | 教育プログラム販売用 |
| `STRIPE_TEAM_PRICE_ID` | チームプラン販売用 |
| `CRM_WEBHOOK_URL` / `CRM_WEBHOOK_SECRET` | 外部CRM連携時 |

### ドメイン接続
1. Vercel → Settings → Domains → カスタムドメイン追加
2. DNS（お名前.com等）でAレコード or CNAMEをVercel向けに設定
3. HTTPS自動発行まで待つ（5〜15分）

---

# Phase 2: 動作確認（E2Eスモークテスト）

**所要**: 30分 / 手動で本番を触る

## テストシナリオ（1セッションで完結）

1. ✅ `https://your-domain.com` にアクセス → ヒーローが表示される
2. ✅ 「今すぐ試す」CTA → `/try-roleplay` に遷移
3. ✅ 業種・難易度・シーンを選択 → 「ロープレを始める」
4. ✅ `/try-roleplay/chat` でAIと会話（5往復程度）
5. ✅ 「スコアを見る」→ ゲストスコア画面
6. ✅ 「無料登録して無制限化」→ `/login`
7. ✅ メールで新規登録 → `/roleplay` にリダイレクト
8. ✅ 本登録後のロープレ完了 → ダッシュボードにスコア履歴が保存される
9. ✅ 2回目ロープレで「1日1回制限」表示 → 料金ページへ誘導
10. ✅ 月額Pro選択 → Stripe Checkout遷移
11. ✅ テストカード `4242 4242 4242 4242` で決済 → Webhook経由で `profiles.plan='pro'` に更新
12. ✅ `/roleplay` に戻る → 無制限で使える

### よくある詰まりポイント

| 症状 | 原因 | 対処 |
|---|---|---|
| 「Service unavailable」 | Supabase env vars未設定 | Vercelの環境変数確認 |
| Chat APIが失敗 | `ANTHROPIC_API_KEY` 未設定 | 設定して再デプロイ |
| Checkoutが「料金プラン設定に問題」 | `STRIPE_PRO_PRICE_ID` 未設定 | セットアップスクリプト実行 |
| Webhook失敗 | 署名シークレット不一致 | `STRIPE_WEBHOOK_SECRET` を再設定 |
| Pro化されない | Webhook未配信 | Stripe Dashboardで手動リトライ |

---

# Phase 3: 集客の立ち上げ

**所要**: 1時間

## ✅ 3-1. Google Search Console

1. https://search.google.com/search-console
2. プロパティ追加（ドメインプロパティ推奨）→ DNS TXTレコード認証
3. サイトマップ送信: `https://your-domain.com/sitemap.xml`
4. 主要URLを「URL検査」→「インデックス登録をリクエスト」:
   - `/`
   - `/pricing`
   - `/try-roleplay`
   - `/blog`
   - `/learn`

## ✅ 3-2. X（Twitter）アカウント準備

- アカウントプロフィール整備（ヘッダー画像、bio、プロフ画像）
- 固定ツイート作成（サービス紹介 + LP リンク）
- 初回X投稿の実施（content-writer agent が作成した5投稿のドラフトを使用）

## ✅ 3-3. 初回ブログ記事の公開

週次コンテンツカレンダーで生成された記事を `src/content/blog/*.mdx` に配置（タスク#7）。
公開後、Search Consoleで該当URLのインデックス登録をリクエスト。

## ✅ 3-4. LP → Try-Roleplay フローのCTR確認

- Clarityでセッション録画を見て離脱ポイント特定
- GA4の `cta_clicked` イベントでCTRを測定
- 1週間データ取得後、低CTRセクションを改善

---

# Phase 4: 1人目獲得を待つ（日々の運用）

## 毎日（15分）
- X投稿1本（content-writer agentの在庫を消化）
- GA4チェック：訪問者数、`try_roleplay_start`、`signup_completed`、`checkout_complete`

## 週1回（1時間）
- ブログ記事1本公開
- weekly-marketing-plannerエージェント起動 → 次週プラン作成
- Clarityでセッション録画を5件視聴

## 月1回
- Stripe Dashboardで実売上確認
- 解約率（churn rate）計算
- Supabase `profiles.plan='pro'` 人数カウント

---

# 📊 KPI定義

| KPI | 目標（1人目まで） | 目標（月10人まで） |
|---|---|---|
| 日次訪問者 | 50人 | 300人 |
| `/try-roleplay` 開始率 | 15% | 20% |
| ロープレ完了率 | 60% | 70% |
| ゲスト→Signup率 | 10% | 15% |
| Free→Pro転換率 | 3% | 5% |

---

# 🆘 トラブルシューティング

### 「Stripeの決済が通らない」
→ 本番キー（`sk_live_...`）が設定されているか確認。テストキーだと本番カードで失敗します。

### 「サインアップしたのにメールが来ない」
→ Supabase Dashboard → Authentication → Email Templates の「Confirm signup」が有効か確認。
→ 迷惑メールフォルダも確認。

### 「ダッシュボードが真っ白」
→ ブラウザコンソールでエラー確認。多くは Supabase RLS ポリシーか環境変数未設定。

### 「AIの応答が遅い/止まる」
→ Anthropic APIのレート制限か、クレジット切れ。`console.anthropic.com` で確認。

---

# 🎯 次のマイルストーン

- [ ] **MS1**: 1人目の無料登録ユーザー
- [ ] **MS2**: 1人目の有料ユーザー（これがLevel 1のゴール）
- [ ] **MS3**: MRR ¥30,000（10人×¥2,980）
- [ ] **MS4**: MRR ¥100,000（約34人）
- [ ] **MS5**: MRR ¥300,000（約100人）

---

最終更新: 2026-04-05
