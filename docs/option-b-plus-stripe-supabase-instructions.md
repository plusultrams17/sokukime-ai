# Option B+ 実装指示書 — Stripe & Supabase 設定

> **重要**: このドキュメントは、買い切り廃止・Pro一本化・ローンチキャンペーン実装に伴い、Miki が手動で実行する必要がある設定手順をまとめたものです。コード変更はすでに Claude が別タスクで実施しています。

---

## 🎯 ゴール

1. **買い切りプログラム (¥9,800)** を停止し、既存購入者の権利は保護
2. **Pro プラン (¥2,980/月)** に一本化
3. **ローンチキャンペーン** `launch2026_67off`（初月 ¥980、2ヶ月目以降は通常価格）を有効化

---

## 1. Stripe 設定（必須）

### Step 1-1: 新しいクーポン作成

Stripe Dashboard → Products → Coupons → **Create coupon**

| 項目 | 値 |
|---|---|
| **ID** | `launch2026_67off` |
| **Name** | ローンチ記念 初月¥980（67%OFF） |
| **Type** | Fixed amount discount |
| **Amount off** | `2000` |
| **Currency** | JPY |
| **Duration** | Repeating |
| **Duration in months** | `1`（初月のみ） |
| **Redemption limit** | （任意）`100` 回まで |
| **Redeem by** | `2026-05-10 23:59 JST` |

> **計算**: ¥2,980（通常）− ¥2,000（割引）= ¥980（初月）
> 2ヶ月目以降は自動的に通常の ¥2,980 に戻ります

### Step 1-2: 既存の買い切り商品を「Archive」する

Stripe Dashboard → Products → **成約5ステップ攻略プログラム（買い切り）** を開く

1. **Archive product** をクリック（削除ではなくアーカイブ）
2. 新規購入は不可になるが、既存購入者の履歴は保持される
3. `STRIPE_PROGRAM_PRICE_ID` 環境変数は **削除しない**（Webhook が過去のイベントを処理する可能性があるため残す）

### Step 1-3: プロモーションコード公開設定

Stripe Dashboard → Products → Promotion codes → **Create promotion code**

| 項目 | 値 |
|---|---|
| **Coupon** | `launch2026_67off` |
| **Code** | `LAUNCH980`（ユーザーが入力できる簡単なコード） |
| **Max redemptions** | `100` |
| **Customer-facing** | ✅ Yes |
| **First-time customer only** | ✅ Yes |

> **ポイント**: Checkout 画面で自動適用するため、コード入力不要の仕組みも同時に実装（コード側で対応済み）

### Step 1-4: Webhook エンドポイントの確認

以下のイベントが購読されていることを確認：
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `customer.subscription.trial_will_end`
- `invoice.payment_failed`
- `invoice.payment_action_required`
- `invoice.paid`
- `checkout.session.expired`

> **変更不要**: `webhook/route.ts` の buy-once 処理は残したまま（既存購入者保護のため）

---

## 2. Supabase 設定（確認のみ）

### Step 2-1: 既存の program_purchases テーブル確認

SQL Editor で実行：

```sql
-- 既存の買い切り購入者リストを確認
SELECT
  pp.user_id,
  pp.program_slug,
  pp.amount,
  pp.completed_at,
  p.email,
  p.plan,
  p.subscription_status
FROM program_purchases pp
JOIN profiles p ON p.id = pp.user_id
WHERE pp.status = 'completed'
ORDER BY pp.completed_at DESC;
```

**期待される結果:**
- 既存購入者がいる場合: `subscription_status = 'program'` になっているはず
- ゼロ件の場合: 今回の変更でリスクなし（最もクリーンな状態）

### Step 2-2: 既存購入者保護ロジックの確認（変更不要）

`src/lib/lessons/access.ts` の `getPurchaseStatus()` が以下の順序でチェックしていることを確認：

```typescript
1. program_purchases レコードあり → purchased: true, tier: 'full'（永続）
2. testers テーブルに有効レコード → purchased: tier === 'full'
3. profiles.plan='pro' かつ subscription_status='active' → purchased: true
```

`subscription_status='program'` のユーザーは **ステップ1で必ず true** を返すため、Pro機能を永続的に使えます。

### Step 2-3: 既存購入者への感謝メール送信（任意・推奨）

もし買い切り購入者がいる場合は、SQL で該当ユーザーをリストアップし、手動で感謝メール + 「今後もすべての機能を使い続けられます」という安心メールを送ることを推奨。

テンプレート：

```
件名: 【成約コーチAI】買い切りプログラムご購入のお礼と大切なお知らせ

○○様

いつも成約コーチAIをご利用いただきありがとうございます。

この度、サービス体系を見直し、買い切りプログラムの新規販売を終了し、
Proプラン（月額）に一本化させていただきました。

ご購入いただいた○○様は、引き続き以下のすべての機能を
無期限でご利用いただけます：

✓ 全22レッスン（テキスト + 図解）
✓ PDF資料 5種類
✓ AIロープレ 無制限（全5カテゴリ詳細スコア）
✓ 反論切り返し 30パターン
✓ トークスクリプト集
✓ 今後追加される新機能もすべて利用可能

追加のご請求は一切ございません。

ご質問があれば、support@seiyaku-coach.com までお気軽にご連絡ください。

成約コーチAI サポートチーム
```

---

## 3. 環境変数（.env.local & Vercel）

### 削除は不要（既存コードの互換性のため残す）

```
STRIPE_PROGRAM_PRICE_ID=price_xxxxxxxxxx
```

> Archive された Product に紐づいていてOK。Webhook の product_type='program' 分岐を処理するために残す。

### 新規追加は不要

`launch2026_67off` クーポンは `src/lib/promotions.ts` にハードコードされ、`getActivePromotion()` が自動で検出します。

---

## 4. 実装完了後のチェックリスト（Miki 作業）

Claude のコード実装が完了した後、以下を順番に確認：

- [ ] Stripe Dashboard でクーポン `launch2026_67off` が作成されている
- [ ] Stripe Dashboard で旧 "成約5ステップ攻略プログラム" Product が Archive されている
- [ ] `https://seiyaku-coach.vercel.app/program` にアクセス → `/pricing` にリダイレクトされる
- [ ] `https://seiyaku-coach.vercel.app/pricing` にアクセス → ローンチオファーバナー表示
- [ ] `/pricing` の CTA から Stripe Checkout に進むと ¥980 割引が自動適用される
- [ ] 実際に決済テスト（Stripeテストカード 4242...）で申込み → Supabase `profiles.plan='pro'` に更新される
- [ ] Webhook ログに "checkout.session.completed" が正常処理されている
- [ ] 特商法ページから買い切りプログラム欄が消えている
- [ ] Header/Footer/FAQ/メインLP に `/program` への直接リンクが無い
- [ ] 既存の買い切り購入者がいる場合、その人の Pro アクセスが継続していることを確認

---

## 5. ロールバック手順（万が一の場合）

もし重大な問題が発生した場合：

1. Vercel で直前のデプロイに revert
2. Stripe の `launch2026_67off` クーポンを Deactivate
3. Stripe の旧 Product を Unarchive（元に戻す）

---

## 6. 成功指標（実装後 1 週間）

| 指標 | 目標値 |
|---|---|
| `/pricing` CTR（LP → Checkout） | ≥ 5% |
| Checkout → 成約率 | ≥ 30% |
| 初月ユーザー数 | 10-20名 |
| ローンチクーポン使用率 | ≥ 80% |
| カスタマーサポート問い合わせ | 0件（既存購入者からのクレーム） |

---

最終更新: 2026-04-10
実装者: Claude Opus 4.6（自動） + Miki（Stripe/Supabase 手動設定）
