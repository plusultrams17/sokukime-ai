# 成約コーチAI — プロジェクト規約

## スタック
- Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript 5
- Supabase (Auth: Google OAuth only + PostgreSQL)
- Stripe (JPY, 即時課金, 無料トライアルなし)
- OpenAI gpt-4o-mini (チャット/コーチ), Anthropic claude-sonnet (スコア/インサイト)

## 4プラン構成 (Source of Truth)
| プラン | 月額 | ロープレ | スコア | レッスン |
|--------|------|----------|--------|----------|
| Free | ¥0 | 累計5回(生涯) | 1カテゴリ | 基本3レッスン |
| Starter | ¥990 | 月30回 | 全5カテゴリ | 全22レッスン |
| Pro | ¥1,980 | 月60回 | 全5カテゴリ | 全22レッスン |
| Master | ¥4,980 | 月200回 | 全5カテゴリ | 全22レッスン |

- `isPaid`: `plan === "starter" || plan === "pro" || plan === "master"`
- 7日間無料トライアルは廃止済み
- 買い切りプログラムは販売終了済み
- キャンペーンは全停止中（インフラは残存）

## 品質基準

### UIの一貫性
- ダークテーマ + オレンジアクセント (#f97316) を維持
- テンプレ的なAIデザインを避ける（紫グラデ、白カード並び、装飾絵文字はNG）
- SmartHR/freee のような抑制されたプロフェッショナルなトーン

### 機能の実動作
- スタブやモックで誤魔化さない — 実際に動作するコードを書く
- エッジケース（0件、上限到達、ネットワークエラー等）を処理する
- エラー時にユーザーへのフィードバックを必ず表示する

## コンプライアンスNGワード

以下の表現はuser-facingテキストで**使用禁止**:

### 景表法リスク（優良誤認・有利誤認）
- 「確実に」「絶対に」「必ず」+ 成果表現 → 「〜が期待できます」「〜につながります」
- 「人気No.1」「業界最安」（根拠データなし）→ 「おすすめ」
- 「期間限定」（実際に期限がない場合）→ 削除 or 実際の期限を明記
- 「今だけ」「今だけお得」（常設の場合）→ 削除
- 「誰でも簡単に」+ 高成果 → 「〜できるよう設計されています」

### 商標リスク
- 「即決営業」→ 「成約メソッド」「成約5ステップメソッド」
- 「堀口」→ 使用禁止（src/内に残存させない）
- 「即決クロージング」→ 「クロージング」

### 推奨表現パターン
- 「〜した方もいます」（個人の感想として）
- 「平均67% (n=150, 2024年自社調査)」（根拠付記）
- 「〜の向上が期待できます」（結果保証しない）

## コード規約

### Next.js 16 必須パターン
- `useSearchParams()` は必ず `<Suspense>` でラップ
- Server Component の `cookies()` は `await` 必須
- Middleware は deprecated 警告が出るが動作する

### Supabase/Stripe パターン
- Admin クライアントは Lazy initialization（ビルド時エラー回避）
- Webhook は `@supabase/supabase-js` + service role key（RLSバイパス）
- 使用量トラッキングはロープレ開始レベル（API呼び出し単位ではない）

### セキュリティ
- `NEXT_PUBLIC_` 以外の環境変数をクライアントに露出させない
- Stripe webhook は署名検証必須
- ユーザー入力はサニタイズしてからAI APIに送信

## エージェント運用ルール

**必読**:
- `.claude/AGENTS_RULES.md` — 26エージェントの階層・発火ルール・衝突時優先順位を定めた憲法
- `.claude/DEEP_THINKING_FEASIBILITY.md` — Deep Thinking System の絶対達成可能性証明書

### Layer 0: Deep Thinking Pipeline（2026-04-16 追加）⭐新設

重要意思決定・新規戦略・新規施策の前に**必ず通過**させるパイプライン:
- `problem-prophet` — Pre-mortem で失敗シナリオ10件事前予言
- `failure-archaeologist` — 先人の失敗を Web で調査・パターン抽出
- `deep-analyst` — MECE + Why-Why 5段 + JTBD で仮説3本
- `strategy-architect` — Option A/B/C を必ず3案・定量比較
- `devils-advocate` — Red Team で10+反論を強制
- `five-why-enforcer` — 5-Why + What Else 計10問の最終ゲート（**拒否権保持**）
- `execution-detailer` — 1h粒度分解 + Gherkin AC + Rollback Plan

### 既存の専門エージェント（2026-04-16 先行追加）
- `sns-funnel-architect` — SNS→LP→有料CTAの1本道ファネル設計（L2企画）
- `new-visitor-simulator` — 新人/中堅/経営者ペルソナで3秒・5秒・3クリックルール検証（L4監査・Proactive）
- `cta-path-enforcer` — 有料CTAまでのクリック数自動計測・3クリック超え警告（L4監査・Proactive）

### 事前予測型ワークフローの原則
1. **「絶対達成したい」と言われたら** → Pipeline 0 全件 + 5重安全装置チェック
2. **新規戦略立案** → Pipeline 0（problem-prophet → failure-archaeologist → ... → execution-detailer）
3. **新規ページ追加前** → `new-visitor-simulator` + `cta-path-enforcer` 事前事後
4. **SNS投稿作成前** → `sns-funnel-architect` で着地設計 → `sns-buzz-scriptwriter`
5. **ヘッダー/フッター変更時** → `cta-path-enforcer` 自動発火
6. **衝突時優先順位**: Deep Thinking差戻し > 法令 > コンプライアンス > Red Team反論 > 機能 > 新規訪問者体験 > CRO > 既存ユーザー便利さ
7. **SNS集客期（2026-04〜）**: 新規訪問者体験 > 既存ユーザー便利さ（ポリシー）

詳細は `.claude/AGENTS_RULES.md` と `.claude/DEEP_THINKING_FEASIBILITY.md` を参照。
