# 成約コーチ AI — 収益自動化戦略 & 収益予測

## 1. 収益の仕組み（Revenue Mechanics）

### ビジネスモデル
- **フリーミアム SaaS**（Freemium → Pro ¥2,980/月 or ¥29,800/年）
- 7日間無料トライアル → 自動課金
- 年額プランで **LTV 2倍**（ProfitWell 37,000社データ）

### 収益方程式
```
MRR = Pro会員数 × ¥2,980
ARR = MRR × 12
年間売上 = ARR + (年額契約数 × ¥29,800)
```

### 単位経済性（Unit Economics）
| 指標 | 目標値 | 根拠 |
|------|--------|------|
| CAC（顧客獲得コスト） | ¥0〜5,000 | SEO/コンテンツマーケティング主導 |
| LTV（月額） | ¥35,760 | ¥2,980 × 12ヶ月（平均継続期間） |
| LTV（年額） | ¥59,600 | ¥29,800 × 2年 |
| LTV:CAC比 | >7:1 | SaaS理想値3:1以上 |
| Payback Period | 0ヶ月 | 初月から黒字 |

---

## 2. 自動化システム一覧（全12カテゴリ）

### A. ユーザー獲得（Acquisition）
| システム | 状態 | 説明 |
|----------|------|------|
| SEOブログ（15記事+） | ✅ 完了 | 営業関連キーワードで有機流入 |
| 無料ツール4種 | ✅ 完了 | 診断/スクリプト/切り返し/計算 |
| 業種別LPページ | ✅ 完了 | 8業種のSEOランディングページ |
| Social Proof Stats | ✅ 完了 | 動的ユーザー数表示 |
| リファラルプログラム | ✅ 完了 | ¥1,000 OFF 自動クーポン |
| GA4イベントトラッキング | ✅ 完了 | 30+ カスタムイベント |
| 無料ツールEmailゲート | ✅ 完了 | ツール結果をメールキャプチャで開放 |
| リード獲得API | ✅ 完了 | beta_signups保存 + GA4追跡 |
| プログラマティックSEO | ✅ 完了 | 20テンプレート×AI記事生成スクリプト |

### B. アクティベーション（Activation）
| システム | 状態 | 説明 |
|----------|------|------|
| Welcome Email | ✅ 完了 | 登録直後に学習導線メール |
| Pre-activation Day3 | ✅ 完了 | 未ロープレユーザーに促進 |
| First/Third Roleplay Email | ✅ 完了 | 行動後の強化メール |
| Aha Moment Tracking | ✅ 完了 | スコア改善時の感動検知 |
| Endowed Progress Bar | ✅ 完了 | Lv.1から開始（完了率+79%） |
| リバーストライアル | ✅ 完了 | 新規全員7日間Pro体験（自動ダウングレード） |
| リバーストライアルUI | ✅ 完了 | ダッシュボードに残日数表示 |

### C. コンバージョン（Revenue）
| システム | 状態 | 説明 |
|----------|------|------|
| Loss-Framed Upgrade Modal | ✅ 完了 | Kahneman損失回避フレーミング |
| Annual Default Pricing | ✅ 完了 | 年額をデフォルト表示 |
| Tax-Inclusive Pricing | ✅ 完了 | 総額表示法準拠 |
| Price Anchoring | ✅ 完了 | 研修¥50,000 vs Pro ¥2,980 |
| First-Person CTA Copy | ✅ 完了 | +90%コンバージョン（Unbounce） |
| Trial Urgency Display | ✅ 完了 | 動的終了日表示 |
| Power User Upgrade Email | ✅ 完了 | 3日連続利用ユーザー自動検知 |
| Checkout Abandonment Email | ✅ 完了 | Stripe webhook + 自動送信 |
| Score Trigger Upsell | ✅ 完了 | スコア表示時のPro訴求 |

### D. リテンション（Retention）
| システム | 状態 | 説明 |
|----------|------|------|
| Streak Display + Shield | ✅ 完了 | 連続日数表示/Proは1日免除 |
| Weekly Progress Digest | ✅ 完了 | Pro向け週次進捗メール |
| Pro Onboarding (Day 1/3/7) | ✅ 完了 | Pro初期定着メール |
| Pro Value Reinforcement | ✅ 完了 | ROI換算表示 |
| Milestone Celebration | ✅ 完了 | Aランク達成時の祝賀UI |
| Invoice/Receipt Link | ✅ 完了 | 法人チャーン防止 |
| Settings Page | ✅ 完了 | メール通知/アカウント管理 |
| NPS Survey (Day 14) | ✅ 完了 | 自動NPS調査 + フィードバック収集 |
| ヘルススコア監視 | ✅ 完了 | エンゲージメント0-100スコア（4指標加重） |
| At-risk介入メール | ✅ 完了 | スコア50未満+5日非活動で自動ナッジ |
| 月額→年額メール | ✅ 完了 | Pro90日目で年額プラン提案 |

### E. チャーン防止（Anti-Churn）
| システム | 状態 | 説明 |
|----------|------|------|
| Cancel Flow + Save Offer | ✅ 完了 | 一時停止提案/理由収集 |
| Inactive Reminder (7日) | ✅ 完了 | 非アクティブユーザーメール |
| Dunning (Day 0/4/7) | ✅ 完了 | 支払い失敗回復メール3段階 |
| Winback (Day 7/30) | ✅ 完了 | 解約後のウィンバックメール |
| Pause Resume Notification | ✅ 完了 | 一時停止再開前通知 |

### F. 運用監視（Operations）
| システム | 状態 | 説明 |
|----------|------|------|
| Admin Revenue Dashboard | ✅ 完了 | リアルタイムKPIダッシュボード |
| Admin Metrics API | ✅ 完了 | MRR/Churn/CVR/Email実績 |
| Cookie Consent | ✅ 完了 | APPI/GA4準拠 |
| Rate Limiting | ✅ 完了 | OpenAIコスト保護 |
| Changelog Page | ✅ 完了 | ユーザーへの機能告知 |
| 週次管理者レポート | ✅ 完了 | 毎週月曜にMRR/KPIメール自動送信 |

---

## 3. 収益予測（Revenue Projections）

### 前提条件
- **月間新規登録**: SEO + 無料ツール + リファラルで月20-50人（初期）
- **Free → Trial CVR**: 10-15%（ProfitWell SaaS平均）
- **Trial → Paid CVR**: 40-60%（SaaS平均25-60%、B2C向けは高め）
- **月次チャーン率**: 5-8%（SaaS平均5-7%）
- **ARPU**: ¥2,980/月

### Phase 1: ローンチ〜3ヶ月目（基盤構築）
| 月 | 新規登録 | Trial開始 | Pro転換 | 累計Pro | MRR |
|----|----------|-----------|---------|---------|-----|
| 1 | 30 | 4 | 2 | 2 | ¥5,960 |
| 2 | 40 | 5 | 3 | 5 | ¥14,900 |
| 3 | 50 | 7 | 4 | 8 | ¥23,840 |

**Phase 1 目標**: MRR ¥20,000（Pro 7人）

### Phase 2: 4〜6ヶ月目（成長加速）
| 月 | 新規登録 | Trial開始 | Pro転換 | Churn | 累計Pro | MRR |
|----|----------|-----------|---------|-------|---------|-----|
| 4 | 60 | 8 | 5 | 0 | 13 | ¥38,740 |
| 5 | 80 | 10 | 6 | 1 | 18 | ¥53,640 |
| 6 | 100 | 13 | 7 | 1 | 24 | ¥71,520 |

**Phase 2 目標**: MRR ¥70,000（Pro 24人）

### Phase 3: 7〜12ヶ月目（スケーリング）
| 月 | 新規登録 | Trial開始 | Pro転換 | Churn | 累計Pro | MRR |
|----|----------|-----------|---------|-------|---------|-----|
| 7 | 120 | 15 | 9 | 1 | 32 | ¥95,360 |
| 8 | 150 | 19 | 11 | 2 | 41 | ¥122,180 |
| 9 | 180 | 23 | 13 | 2 | 52 | ¥154,960 |
| 10 | 200 | 25 | 15 | 3 | 64 | ¥190,720 |
| 11 | 220 | 28 | 17 | 3 | 78 | ¥232,440 |
| 12 | 250 | 31 | 19 | 4 | 93 | ¥277,140 |

**Phase 3 目標**: MRR ¥250,000+（Pro 85人+）

### 年間収益サマリー
| 期間 | MRR範囲 | ARR換算 | 累計売上（概算） |
|------|---------|---------|-----------------|
| Year 1 | ¥5,960 → ¥277,140 | ¥3,325,680 | ¥1,200,000 |
| Year 2（予測） | ¥277,140 → ¥800,000 | ¥9,600,000 | ¥6,000,000 |

---

## 4. 収益を最大化するレバー（Revenue Levers）

### 即効性の高い施策（1-3ヶ月で効果）
1. **SEOコンテンツ拡充** — 営業系キーワード記事を月4本追加 → 有機流入+50%
2. **X/Twitter運用** — 営業Tips投稿 → 認知拡大
3. **リファラル促進** — 既存ユーザーの紹介率を上げる通知強化
4. **NPS改善ループ** — Detractorの声を即座にプロダクト改善に反映

### 中期施策（3-6ヶ月）
1. **法人プラン** — チーム5人以上で¥12,800/月（1人¥2,560）
2. **年額プラン促進** — 年額比率30%以上でLTV+40%
3. **パートナーシップ** — 営業研修会社とのアフィリエイト連携

### 長期施策（6-12ヶ月）
1. **エンタープライズ** — 大手営業チーム向けカスタム価格
2. **API/プラットフォーム** — CRM連携（Salesforce/HubSpot）
3. **認定資格** — 「成約コーチ認定」資格で差別化

---

## 5. 自動運用フロー（Claude Operations）

### 日次自動実行（Vercel Cron: 毎日0:00 UTC）
```
Cron実行 → 16カテゴリのメール自動送信
  ├─ 1. トライアル期限通知 (3段階)
  ├─ 2. トライアル終了通知
  ├─ 3. 非アクティブリマインダー
  ├─ 4. 未ロープレDay3通知
  ├─ 5. 一時停止再開通知
  ├─ 6. 支払い失敗フォローアップ (Day4/7)
  ├─ 7. ウィンバック (Day7/30)
  ├─ 8. パワーユーザーアップグレード
  ├─ 9. 紹介ナッジ
  ├─ 10. 週次ダイジェスト
  ├─ 11. Pro オンボーディング (Day1/3/7)
  ├─ 12. NPS調査 (Day14)
  ├─ 13. At-riskヘルススコア介入
  ├─ 14. 月額→年額アップグレード (90日目)
  ├─ 15. リバーストライアル期限切れ（自動ダウングレード）
  └─ 16. 週次管理者レベニューレポート（月曜のみ）
```

### リアルタイム自動実行（Stripe Webhook）
```
Stripe Event → Webhook処理
  ├─ checkout.session.completed → Pro化 + Welcome Email + リファラル報酬
  ├─ customer.subscription.updated → ステータス更新 + 一時停止検知
  ├─ customer.subscription.deleted → 解約 + キャンセルメール + WB起点
  ├─ invoice.payment_failed → Past Due化 + ダニングメール起点
  ├─ invoice.paid → 回復 + ダニング記録クリア + GA4追跡
  ├─ checkout.session.expired → チェックアウト離脱メール
  ├─ trial_will_end → トライアル終了3日前通知
  └─ payment_action_required → 支払いアクション要求メール
```

### 監視ダッシュボード（/admin）
```
Admin Dashboard → リアルタイムKPI
  ├─ MRR / ARR
  ├─ ユーザー数 (Total/Pro/Trial/Free/PastDue)
  ├─ WAU / MAU
  ├─ CVR (Free→Pro)
  ├─ Churn Rate
  ├─ Email Performance (30日)
  ├─ Referral Stats
  └─ Revenue Milestones
```

---

## 6. 必要な環境変数

| 変数名 | 用途 | 必須 |
|--------|------|------|
| `ADMIN_SECRET` | 管理ダッシュボード認証 | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Admin | ✅ |
| `STRIPE_SECRET_KEY` | Stripe API | ✅ |
| `STRIPE_WEBHOOK_SECRET` | Webhook署名検証 | ✅ |
| `OPENAI_API_KEY` | AI機能 | ✅ |
| `RESEND_API_KEY` | メール送信 | ✅ |
| `CRON_SECRET` | Cron認証 | ✅ |
| `GA4_MEASUREMENT_PROTOCOL_SECRET` | GA4サーバーサイド | 推奨 |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4クライアント | 推奨 |
| `ADMIN_EMAIL` | 週次レポート送信先 | 推奨 |

---

## 7. SQL Migration（NPS テーブル追加）

```sql
-- Supabase SQL Editor で実行
CREATE TABLE IF NOT EXISTS public.nps_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  score INT NOT NULL CHECK (score >= 0 AND score <= 10),
  category TEXT NOT NULL CHECK (category IN ('detractor', 'passive', 'promoter')),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_nps_responses_user ON nps_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_nps_responses_category ON nps_responses(category);
```

---

## 8. 結論

全16カテゴリ・55+の自動化システムが稼働中。人手を介さず、以下のサイクルが24時間回り続けます：

```
SEO/リファラル/リードキャプチャで集客
  → リバーストライアルで即Pro体験
    → 行動トリガーでPro継続転換
      → ヘルススコア監視でリテンション
        → NPS/フィードバックで改善
          → At-risk介入+チャーン防止で離脱阻止
            → ウィンバック+月額→年額で収益最大化
              → 週次レポートで運用監視
```

**1年後の現実的な目標**: MRR ¥250,000〜300,000（Pro 85-100人）
**達成条件**: 月間新規登録100人+、Trial CVR 12%+、Paid CVR 50%+、月次Churn 5%以下
