# Analytics セットアップガイド

## 1. GA4（Google Analytics 4）設定

### 1-1. GA4プロパティの作成（未作成の場合）
1. [analytics.google.com](https://analytics.google.com) にアクセス
2. 「管理」→「プロパティを作成」
3. プロパティ名: `成約コーチ AI`、タイムゾーン: `日本`、通貨: `JPY`
4. ウェブストリームを追加 → 測定ID（`G-XXXXXXXXXX`）を取得
5. `.env.local` の `NEXT_PUBLIC_GA_MEASUREMENT_ID` に設定

### 1-2. カスタムディメンションの登録
GA4管理画面 →「カスタム定義」→「カスタムディメンションを作成」で以下を登録:

| ディメンション名 | イベントパラメータ名 | 範囲 |
|---|---|---|
| 業種 | industry | イベント |
| 難易度 | difficulty | イベント |
| トリガー | trigger | イベント |
| プラン | plan | イベント |
| 課金種別 | billing | イベント |

### 1-3. キーイベント（コンバージョン）の設定
GA4管理画面 →「キーイベント」→「新しいキーイベント」で以下を登録:

| イベント名 | 説明 |
|---|---|
| `checkout_complete` | Stripe決済完了（最重要） |
| `checkout_start` | Stripe決済ページへの遷移 |
| `roleplay_start` | ロープレ開始 |
| `roleplay_complete` | ロープレ完了 |
| `upgrade_prompt_clicked` | アップグレード誘導クリック |

### 1-4. ファネルレポートの作成
GA4 →「探索」→「ファネルデータ探索」で以下のファネルを作成:

**メインファネル:**
1. `roleplay_start` → `roleplay_complete` → `score_view` → `pricing_page_view` → `checkout_start` → `checkout_complete`

**アップグレードファネル:**
1. `upgrade_prompt_shown` → `upgrade_prompt_clicked` → `pricing_page_view` → `checkout_start` → `checkout_complete`

### 1-5. 実装済みGA4カスタムイベント一覧

| イベント名 | 発火タイミング | パラメータ |
|---|---|---|
| `roleplay_start` | ロープレ開始 | industry, difficulty |
| `roleplay_complete` | ロープレ完了 | industry, difficulty, total_score |
| `score_view` | スコア画面表示 | industry, difficulty, total_score |
| `pricing_page_view` | 料金ページ閲覧 | industry, difficulty |
| `checkout_start` | Stripe決済遷移 | industry, difficulty, billing, plan, currency |
| `checkout_complete` | 決済完了 | industry, difficulty, plan, currency |
| `upgrade_prompt_shown` | アップグレード誘導表示 | trigger, industry, difficulty |
| `upgrade_prompt_clicked` | アップグレード誘導クリック | trigger, industry, difficulty |

---

## 2. Microsoft Clarity 設定

### 2-1. Clarityプロジェクトの作成
1. [clarity.microsoft.com](https://clarity.microsoft.com) にアクセス（Microsoftアカウントでログイン）
2. 「Add new project」をクリック
3. プロジェクト名: `成約コーチ AI`
4. サイトURL: `https://seiyaku-coach.vercel.app`（本番URL）
5. カテゴリ: `Education / Training`
6. プロジェクト作成後、「Settings」→「Overview」でプロジェクトIDを確認
7. `.env.local` の `NEXT_PUBLIC_CLARITY_PROJECT_ID` に設定

### 2-2. Clarityで確認すべき項目
- **セッション録画**: ユーザーがスコア画面でどこをタップしているか
- **ヒートマップ**: 料金ページのどの部分が最もクリックされているか
- **スクロールマップ**: 料金ページのFAQまで読まれているか
- **Dead Clicks**: ブラーされたスコアをタップしようとして反応しないケースがないか
- **Rage Clicks**: ユーザーがフラストレーションを感じている箇所

### 2-3. Clarityフィルタ設定（推奨）
- **カスタムタグ**: GA4イベントと連携して、コンバージョンしたユーザーのセッションだけをフィルタ
- **ページフィルタ**: `/roleplay`, `/pricing` を重点監視

---

## 3. GA4 + Clarity連携

Clarity管理画面 →「Settings」→「Google Analytics integration」で GA4と連携すると:
- Clarityのセッション録画をGA4のユーザーセグメントでフィルタ可能
- コンバージョンしたユーザー vs しなかったユーザーの行動比較が可能

---

## 4. デプロイ後の動作確認チェックリスト

### GA4リアルタイムレポートで確認
- [ ] `/roleplay` ページを開き、ロープレを開始 → `roleplay_start` が発火
- [ ] ロープレを完了 → `roleplay_complete` + `score_view` が発火
- [ ] `/pricing` ページを開く → `pricing_page_view` が発火
- [ ] Proプランボタンをクリック → `checkout_start` が発火
- [ ] スコア画面のブラー部分をタップ → `upgrade_prompt_clicked` が発火

### Clarityで確認
- [ ] Clarityダッシュボードにセッションデータが記録されている
- [ ] ヒートマップが正しく表示される
- [ ] セッション録画が再生できる

### ブラウザDevToolsで確認
```javascript
// コンソールでdataLayerを確認
window.dataLayer.filter(e => e.event)
```
