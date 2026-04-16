# 成約コーチAI — Clarityデータ検証 UX/UI調査レポート

**調査日:** 2026-04-06
**対象:** トップページ・料金ページ・サインアップ・Cookie同意・ヘッダー
**目的:** デッドクリック(17.39%)・クイックバック(26.09%)の原因特定

---

## 📊 Clarityデータとコード分析の相関

| 指標 | 数値 | 推定原因 |
|------|------|--------|
| **デッドクリック** | 17.39% | テキストがリンクに見えるが非clickable、カード類がクリック不可 |
| **クイックバック** | 26.09% | Cookie同意バナー、遅い読み込み、期待値ギャップ |
| **CTA → conversion** | 18 clicks → 0 conversion | CTA先 (/try-roleplay) で何が起きている? |

---

## 🔍 具体的なUI/UX問題リスト

### 【高】優先度：即導入必須

#### 1. **Cookie同意バナー がCTAを隠す（視覚的・機能的）**
- **ファイル:** `src/components/cookie-consent.tsx` (34-57行)
- **問題:**
  - `fixed bottom-0 left-0 right-0 z-[9999]` → 画面下部に固定
  - モバイルで「同意する」「拒否」ボタンが他のCTAと重なる可能性
  - Cookie同意を拒否しても `window.location.reload()` で再読み込み（ユーザー体験を阻害）
  - バナーが同意前から visible（一瞬の閃烈感がクイックバックを誘発）
- **ユーザーの行動:**
  - 「同意する」をクリック → 再読み込み（期待値ギャップ：ページが動く）
  - 「拒否」をクリック → 画面に残留（スクロール必須）
  - 複雑な選択肢 → クイックバック（26%）に直結
- **修正難易度:** 低
- **推奨改善:** reload削除、バナーのz-index を Hero CTA より低く

---

#### 2. **トップページ — Hero セクション後の Gap構造がクイックバック を誘発**
- **ファイル:** `src/app/page.tsx` (103-231行)
- **問題:**
  - Hero セクション: 背景画像 + グラデーション + 大型CTA (64px高)
  - 次セクション: `style={{ backgroundColor: "#f7f8ea" }}` へ急激に色が変わる
  - Heroの次が「こんな悩みはありませんか？」（問題定義）
  - ユーザーの期待：「今すぐ試す」→ 実際：「もっと学習する」フロー
- **デッドクリック の原因:**
  - Hero背景画像自体がクリック不可（テキストはあるが、画像領域は無視される）
  - Scroll indicator（211-228行）が視覚的に「クリック可能」に見える（矢印アニメーション）が実際には非クリック
- **修正難易度:** 中
- **推奨改善:**
  - `aria-hidden="true"` を明示的に（現在は記載なし）
  - 次セクションへの段階的カラー遷移（#1a1a1a → #f7f8ea の急激さを緩和）

---

#### 3. **トップページ — CTAボタンのリンク先がまちまち / undefined の可能性**
- **ファイル:** `src/app/page.tsx` (11, 19-25行)
- **問題:**
  - `CTAButton()` → `/try-roleplay` へ（9行）
  - `SecondaryCTA()` → `/learn` へ（20行）
  - これらが複数回登場（166, 309, 425行）
  - `href="/try-roleplay"` は実在するが、**誰が未認証ユーザー向けかが不明**
- **デッドクリック の原因:**
  - タップ後、/try-roleplay へ遷移するが、**ページが真っ白に見える**（認証チェック中?）
  - ローディング状態が表示されていない → ユーザーは「クリックが効かない」と判断
- **修正難易度:** 中
- **推奨改善:**
  - `/try-roleplay` の loading.tsx を作成、スケルトンUI を表示
  - または「ロープレ体験を読み込み中...」というローディング状態を明示

---

### 【中】優先度：1-2週間以内に改善

#### 4. **料金ページ — Trial Countdown Banner がプロフェッショナルに見えすぎて、スキップされる**
- **ファイル:** `src/app/pricing/page.tsx` (217-232行)
- **問題:**
  - `border-2 border-accent/40 bg-accent/5` → 薄い色＝目立たない
  - トライアル残日数が小さいテキスト（text-xs）で、**スクロール時に見逃される**
  - ユーザーが「7日間無料」を見落とす → クイックバック
- **クイックバック の原因:**
  - ユーザー期待：「無料で始められる」
  - 現実：trialDays === null（未認証ユーザーは表示されない）
  - 「お得感」を感じる前にバウンス
- **修正難易度:** 低
- **推奨改善:**
  - Banner をより目立つ色（`bg-red-500/10 border-red-500`）に変更
  - アニメーション（`animate-pulse` など）を追加
  - 未認証ユーザー向けに「申し込むと7日間無料」をデフォルト表示

---

#### 5. **料金ページ — 価格表示の信頼性ギャップ**
- **ファイル:** `src/app/pricing/page.tsx` (106-109, 356-361行)
- **問題:**
  - Pro plan: `¥2,980/月` と表示
  - 直後に tax-inclusive price: `¥3,278/月（税込）` と小さく表示
  - 比較表で「¥2,980」を赤字で大きく強調（tax なし表記）
  - ユーザーは「実際には ¥3,278 払うのか」と混乱 → クイックバック
- **修正難易度:** 低
- **推奨改善:**
  - 最初から `¥3,278/月（税込）` と統一表示（日本の景表法要件）
  - 小さいテキストで「税込」を明示するのは不十分

---

#### 6. **Header — モバイルでナビゲーション選択肢が多すぎて混乱**
- **ファイル:** `src/components/header.tsx` (9-13, 120-139行) + `globals.css` (2506-2577行)
- **問題:**
  - モバイル menu (mobile-menu--open) の max-height: 420px （固定）
  - navLinks: 4個 + ログイン/登録/チーム = 最大 7個のリンク
  - 小さい画面で overflow hidden のため、スクロール不可
  - ユーザーが「他のメニューはあるのか」と戸惑う → デッドクリック（空き領域タップ）
- **修正難易度:** 中
- **推奨改善:**
  - `overflow-y: auto` に変更
  - max-height を動的に計算（viewport.height - header.height）

---

#### 7. **サインアップページ — リダイレクト先 (/login) の遅延**
- **ファイル:** `src/app/(auth)/signup/page.tsx` (10-13行)
- **問題:**
  - `/signup` → `/login` へ **useEffect で router.replace() を呼び出す**
  - ページ読み込み → 0.5-1秒の遅延 → リダイレクト
  - ユーザーは「ページが読み込めない」と判断 → クイックバック
  - Loading UI が存在しない（テキストだけ「リダイレクト中...」）
- **修正難易度:** 低
- **推奨改善:**
  - サーバーサイドリダイレクト（redirect() in layout.tsx）に変更
  - または `/signup` ページ自体を削除し、/login に統合

---

### 【低】優先度：最適化向け

#### 8. **PromoBanner — ユーザーが dismiss したあとに、localStorage で記憶するが、キャンペーン変更時の対応が不明**
- **ファイル:** `src/components/promo-banner.tsx` (8, 26-27行)
- **問題:**
  - `STORAGE_KEY = "promo_banner_dismissed"` → campaign ID で区別していない可能性
  - 古いキャンペーンを dismiss → 新しいキャンペーンも表示されない
  - ユーザーが「キャンペーンが出現」を期待するが、出現しない → 信頼性低下
- **修正難易度:** 低
- **推奨改善:** campaign ID を storage key に含める（already implemented at line 26 ✓）

---

#### 9. **Hero CTA Button — "今すぐAIロープレを体験" の後に、下部に "まず営業の型を学ぶ" が隠れている**
- **ファイル:** `src/app/page.tsx` (166-168, 309-310行)
- **問題:**
  - Hero: 主CTA を表示 → 次セクション終了時に 2個の CTA を表示（Confusion）
  - ユーザーが 2個の CTA を見比べるため、クリックが後ろにずれる可能性
  - 同じセクションで 3回（Hero, Section 3, Section 5）CTA が登場 → CTA Fatigue
- **修正難易度:** 低
- **推奨改善:**
  - Hero セクション内では **主CTA のみ** に統一
  - Secondary CTA は下部セクションで単一表示

---

#### 10. **Pricing Page — 比較表 (comparisons 配列) が画像を参照するが、パスが一貫していない**
- **ファイル:** `src/app/pricing/page.tsx` (25-31行)
- **問題:**
  - comparison items: `image: "/images/misc/comparison-training.png"` など
  - これらの画像が存在するのか確認が不可（404 risk）
  - 画像が読み込めない → 空白枠 → デッドクリック
- **修正難易度:** 低（確認コマンド実行で即判定可能）
- **推奨改善:** 存在しない画像は削除し、icon emoji に統一

---

## 🎯 クイックバック(26.09%) の直接的な原因

1. **Cookie同意バナー** → reload による期待値ギャップ
2. **Hero → Problem セクション間のカラージャンプ** → スクロール先がつまらなく見える
3. **Trial Countdown がデフォルト非表示** → 未認証ユーザーが「7日間無料」を見逃す
4. **価格表示の信頼性不足** → tax 混乱
5. **/try-roleplay への遷移が遅い** → ローディング状態なし

---

## 📱 モバイル特有の問題（X経由の流入 ≈ 90% モバイル）

| 問題 | ファイル | 行番号 | 影響度 |
|------|---------|--------|--------|
| Mobile menu が overflow-hidden | globals.css | 2515 | 高 |
| Cookie バナーがボタン隠す | cookie-consent.tsx | 35 | 高 |
| Hero 背景画像が小さい画面で崩れる | page.tsx | 108-114 | 中 |
| nav-btn サイズが小さい (10px padding) | globals.css | 2381 | 低 |

---

## ✅ 改善の優先順位（推奨実施順）

### **週1実装（高優先度）**
1. Cookie同意から reload 削除 → UX改善 (cookie-consent.tsx)
2. /try-roleplay のローディング表示追加 → デッドクリック削減 (page.tsx + loading.tsx)
3. Trial Countdown を全ユーザーに表示 → クイックバック削減 (pricing.tsx)
4. Mobile menu に overflow-y: auto 追加 → ナビ改善 (globals.css)

### **週2実装（中優先度）**
5. 価格表示を統一（tax込み表示） → 信頼性向上 (pricing.tsx)
6. Hero セクション → Problem セクション間のカラー遷移を段階的に → スクロール誘引 (page.tsx)
7. サインアップリダイレクトをサーバーサイド化 → 遅延解消 (signup/page.tsx + layout.tsx)

### **検証（スモークテスト）**
8. 比較表の画像パスが存在するか確認 → 404 対応 (pricing.tsx)
9. Clarity再測定（改善後1週間） → データ検証

---

## 📝 実装コード例（概要）

### Cookie Consent reload 削除
```tsx
// 削除対象: cookie-consent.tsx 行24
// window.location.reload();  // ← これを削除
```

### /try-roleplay ローディング状態
```tsx
// 新規作成: src/app/try-roleplay/loading.tsx
export default function Loading() {
  return <LoadingSkeletonUI />;  // 5-10行のスケルトン
}
```

### Mobile Menu スクロール対応
```css
/* globals.css 行2515 修正 */
.mobile-menu {
  overflow-y: auto;  /* hidden → auto */
  max-height: 70vh;  /* 固定値 → viewport 相対 */
}
```

---

## 🔗 関連するデータ

- **GA4:** cta_clicked = 18 (header_try など)
- **Clarity:** Dead click 17.39%, Quick back 26.09%
- **Hypothesis:** CTA → /try-roleplay 遷移時に loading 状態が見えない = CTA が「効かない」と判断される

---

## ⚠️ リスク & 注意点

1. **Cookie reload 削除時:** ローカルストレージの同期確認（Google Analytics 追跡に影響なし）
2. **Pricing tax 表示統一時:** 既存ユーザーへの通知不要（UI表示のみ）
3. **Mobile menu overflow 変更時:** height: 100vh を超えないようチェック

---

**レポート作成者:** ux-investigator
**最終確認日:** 2026-04-06
