-- 成約コーチ AI フリーミアム用テーブル
-- Supabaseの SQL Editor で実行してください

-- プロフィール（auth.usersと自動連携）
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'none',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 利用記録（1日1回制限のチェック用）
CREATE TABLE public.usage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  used_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_usage_user_date ON usage_records(user_id, used_date);

-- ロープレスコア履歴（ダッシュボード用）
CREATE TABLE public.roleplay_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  overall_score INT NOT NULL,
  category_scores JSONB NOT NULL DEFAULT '[]',
  summary TEXT,                           -- AI総評
  strengths JSONB DEFAULT '[]',           -- 良かった点のリスト
  improvements JSONB DEFAULT '[]',        -- 改善点のリスト
  difficulty TEXT,
  industry TEXT,
  scene TEXT,
  customer_type TEXT,                     -- 顧客タイプ（individual/owner/manager/staff）
  product TEXT,                           -- 商材名
  conversation_log JSONB,                 -- 会話ログ [{role, content}, ...]
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_scores_user_date ON roleplay_scores(user_id, created_at DESC);
CREATE INDEX idx_scores_industry ON roleplay_scores(industry) WHERE industry IS NOT NULL;
CREATE INDEX idx_scores_difficulty ON roleplay_scores(difficulty) WHERE difficulty IS NOT NULL;
CREATE INDEX idx_scores_user_industry ON roleplay_scores(user_id, industry, created_at DESC);

-- updated_at 自動更新トリガー（汎用関数）
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_roleplay_scores_updated_at
  BEFORE UPDATE ON public.roleplay_scores
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ユーザー作成時に自動でprofileを作るトリガー
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email) VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS（Row Level Security）
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE roleplay_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users read own usage" ON usage_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own usage" ON usage_records FOR INSERT WITH CHECK (auth.uid() = user_id);

-- roleplay_scores RLS policies
CREATE POLICY "Users can read own scores" ON roleplay_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scores" ON roleplay_scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own scores" ON roleplay_scores FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
-- DELETE policy intentionally omitted to prevent score history deletion
-- Share link (/api/score/[id]) uses service role key to bypass RLS

-- =============================================
-- 解約防止 + 紹介プログラム用テーブル
-- =============================================

-- profilesにカラム追加（一時停止・エンゲージメント管理・リバーストライアル）
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS pause_start TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS pause_resume_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS engagement_score INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS email_unsubscribed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ;

-- 解約理由ログ（分析・改善用）
CREATE TABLE public.cancel_reasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  reason_detail TEXT,
  offer_type TEXT,
  outcome TEXT NOT NULL CHECK (outcome IN ('accepted', 'rejected', 'dismissed')),
  stripe_coupon_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_cancel_reasons_user ON cancel_reasons(user_id);

-- エンゲージメントイベント（行動追跡）
CREATE TABLE public.engagement_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'roleplay_start', 'roleplay_complete', 'score_view',
    'worksheet_edit', 'coach_view', 'login',
    'billing_visit', 'settings_visit'
  )),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_engagement_user_date ON engagement_events(user_id, created_at);

-- 紹介コード（1ユーザー1コード）
CREATE TABLE public.referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_referral_code ON referral_codes(code);

-- 紹介コンバージョン追跡
CREATE TABLE public.referral_conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'signed_up' CHECK (status IN ('signed_up', 'converted_pro', 'rewarded')),
  referrer_coupon_id TEXT,
  referee_coupon_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  converted_at TIMESTAMPTZ,
  rewarded_at TIMESTAMPTZ,
  UNIQUE(referrer_id, referee_id)
);
CREATE INDEX idx_referral_referrer ON referral_conversions(referrer_id);
CREATE INDEX idx_referral_referee ON referral_conversions(referee_id);

-- RLS for new tables
ALTER TABLE cancel_reasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_conversions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users insert own cancel reasons" ON cancel_reasons FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users read own cancel reasons" ON cancel_reasons FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own engagement" ON engagement_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users read own engagement" ON engagement_events FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users read own referral code" ON referral_codes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own referral code" ON referral_codes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anyone can lookup referral code" ON referral_codes FOR SELECT USING (true);

CREATE POLICY "Referrers read own conversions" ON referral_conversions FOR SELECT USING (auth.uid() = referrer_id);

-- ── 業種いいね (Industry Likes) ──
CREATE TABLE public.industry_likes (
  slug TEXT PRIMARY KEY,
  like_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.industry_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read likes" ON industry_likes FOR SELECT USING (true);

-- アトミックいいねインクリメント関数
CREATE OR REPLACE FUNCTION increment_industry_like(industry_slug TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  INSERT INTO public.industry_likes (slug, like_count, updated_at)
  VALUES (industry_slug, 1, now())
  ON CONFLICT (slug)
  DO UPDATE SET like_count = industry_likes.like_count + 1, updated_at = now()
  RETURNING like_count INTO new_count;
  RETURN new_count;
END;
$$;

-- アトミックいいね解除（デクリメント）関数
CREATE OR REPLACE FUNCTION decrement_industry_like(industry_slug TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE public.industry_likes
  SET like_count = GREATEST(like_count - 1, 0), updated_at = now()
  WHERE slug = industry_slug
  RETURNING like_count INTO new_count;
  -- 行が存在しない場合は 0 を返す
  IF new_count IS NULL THEN
    RETURN 0;
  END IF;
  RETURN new_count;
END;
$$;

-- =============================================
-- フィードバック（NPS + 自由記述）
-- =============================================

CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  nps_score INTEGER NOT NULL CHECK (nps_score >= 0 AND nps_score <= 10),
  comment TEXT DEFAULT '',
  roleplay_score INTEGER,
  page TEXT DEFAULT 'roleplay',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_feedback_user ON feedback(user_id);
CREATE INDEX idx_feedback_created ON feedback(created_at);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users insert own feedback" ON feedback FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users read own feedback" ON feedback FOR SELECT USING (auth.uid() = user_id);

-- =============================================
-- ベータテスター募集（メールのみ・認証不要）
-- =============================================

CREATE TABLE public.beta_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_beta_signups_email ON beta_signups(email);
ALTER TABLE beta_signups ENABLE ROW LEVEL SECURITY;
-- API route uses service role key (bypasses RLS). No public policies needed.

-- =============================================
-- ユーザーレビュー（利用者の声）
-- =============================================

CREATE TABLE public.user_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  role TEXT DEFAULT '',
  review_text TEXT NOT NULL,
  roleplay_score INTEGER,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_user_reviews_approved ON user_reviews(is_approved, created_at);

ALTER TABLE user_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users insert own review" ON user_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users read own review" ON user_reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can read approved reviews" ON user_reviews FOR SELECT USING (is_approved = true);

-- =============================================
-- 課金直後アンケート（決め手は何でしたか？）
-- =============================================
CREATE TABLE public.post_payment_surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  answer TEXT NOT NULL CHECK (answer IN ('unlimited', 'score_detail', 'ai_advice', 'price', 'other')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- API route uses service role key (bypasses RLS). No public policies needed.

-- =============================================
-- オンボーディングメール送信記録
-- =============================================
CREATE TABLE public.onboarding_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_onboarding_emails_user ON onboarding_emails(user_id);
CREATE INDEX idx_onboarding_emails_user_type ON onboarding_emails(user_id, email_type);
-- API route uses service role key (bypasses RLS). No public policies needed.

-- If table already exists with old CHECK constraint, run this migration:
-- ALTER TABLE onboarding_emails DROP CONSTRAINT IF EXISTS onboarding_emails_email_type_check;
-- ALTER TABLE onboarding_emails DROP CONSTRAINT IF EXISTS onboarding_emails_user_id_email_type_key;
-- CREATE INDEX IF NOT EXISTS idx_onboarding_emails_user_type ON onboarding_emails(user_id, email_type);

-- =============================================
-- NPS (Net Promoter Score) 回答記録
-- =============================================
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
-- API route uses service role key (bypasses RLS). No public policies needed.

-- =============================================
-- A/Bテスト基盤
-- =============================================

-- A/Bテスト定義
CREATE TABLE IF NOT EXISTS public.ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_name TEXT NOT NULL UNIQUE,
  email_type TEXT NOT NULL,
  variants JSONB NOT NULL DEFAULT '[]',
  traffic_split JSONB NOT NULL DEFAULT '{"control": 50, "variant": 50}',
  is_active BOOLEAN DEFAULT true,
  winner TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_ab_tests_active ON ab_tests(is_active, email_type);

-- onboarding_emailsにA/Bバリアント追跡カラム追加
ALTER TABLE public.onboarding_emails
  ADD COLUMN IF NOT EXISTS ab_test_id UUID REFERENCES ab_tests(id),
  ADD COLUMN IF NOT EXISTS ab_variant TEXT;

-- A/Bテスト結果（開封・クリック等のコンバージョン追跡）
CREATE TABLE IF NOT EXISTS public.ab_test_conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ab_test_id UUID NOT NULL REFERENCES ab_tests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  variant TEXT NOT NULL,
  conversion_type TEXT NOT NULL CHECK (conversion_type IN ('sent', 'opened', 'clicked', 'converted')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ab_conversions_test ON ab_test_conversions(ab_test_id, variant);

-- =============================================
-- ヘルススコア履歴（予測的チャーン検知用）
-- =============================================
CREATE TABLE IF NOT EXISTS public.health_score_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  recency_score INTEGER NOT NULL,
  frequency_score INTEGER NOT NULL,
  breadth_score INTEGER NOT NULL,
  improvement_score INTEGER NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('healthy', 'at_risk', 'critical')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_health_history_user ON health_score_history(user_id, created_at DESC);

-- =============================================
-- Cronログ監視
-- =============================================
CREATE TABLE IF NOT EXISTS public.cron_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'partial_failure', 'failure')),
  duration_ms INTEGER NOT NULL,
  results JSONB NOT NULL DEFAULT '{}',
  error_details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_cron_logs_job ON cron_logs(job_name, created_at DESC);

-- =============================================
-- CRM Webhookイベントログ
-- =============================================
CREATE TABLE IF NOT EXISTS public.crm_webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'skipped')),
  response_code INTEGER,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_crm_webhook_event ON crm_webhook_logs(event_type, created_at DESC);

-- =============================================
-- 教材プログラム購入記録
-- =============================================
CREATE TABLE IF NOT EXISTS public.program_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_slug TEXT NOT NULL DEFAULT 'five-step-master',
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_checkout_session_id TEXT,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'jpy',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_program_purchases_user ON program_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_program_purchases_stripe ON program_purchases(stripe_payment_intent_id);

ALTER TABLE program_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own program purchases" ON program_purchases FOR SELECT USING (auth.uid() = user_id);
-- Insert/update handled by service role key in webhook

-- =============================================
-- 高度なダニング（Stripeリトライ追跡）
-- =============================================
CREATE TABLE IF NOT EXISTS public.dunning_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_invoice_id TEXT NOT NULL,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  amount INTEGER NOT NULL,
  failure_reason TEXT,
  next_retry_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_dunning_user ON dunning_attempts(user_id, created_at DESC);

-- =============================================
-- 業界インサイト（Industry Insights）
-- =============================================

-- インサイト記事マスター
CREATE TABLE IF NOT EXISTS public.insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type TEXT NOT NULL CHECK (source_type IN ('google_news', 'semantic_scholar')),
  source_id TEXT NOT NULL UNIQUE,
  source_url TEXT,
  title_original TEXT NOT NULL,
  title_ja TEXT,
  summary_ja TEXT,
  sales_angle TEXT,
  industries TEXT[] NOT NULL DEFAULT '{}',
  published_date TIMESTAMPTZ,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  metadata JSONB DEFAULT '{}'
);
CREATE INDEX IF NOT EXISTS idx_insights_published ON insights(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_insights_industries ON insights USING GIN(industries);
CREATE INDEX IF NOT EXISTS idx_insights_status ON insights(status, published_date DESC);

ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
-- All authenticated users can read active insights
CREATE POLICY "Authenticated users read active insights" ON insights
  FOR SELECT USING (auth.role() = 'authenticated' AND status = 'active');

-- ユーザー業界設定
CREATE TABLE IF NOT EXISTS public.user_industry_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  primary_industry TEXT NOT NULL,
  secondary_industries TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_industry_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own industry preferences" ON user_industry_preferences
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own industry preferences" ON user_industry_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own industry preferences" ON user_industry_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- インサイトインタラクション（閲覧・保存・変換・共有追跡）
CREATE TABLE IF NOT EXISTS public.insight_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  insight_id UUID NOT NULL REFERENCES insights(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('view', 'save', 'unsave', 'convert', 'share')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_insight_interactions_user ON insight_interactions(user_id, action);
CREATE INDEX IF NOT EXISTS idx_insight_interactions_insight ON insight_interactions(insight_id);

ALTER TABLE insight_interactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own insight interactions" ON insight_interactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own insight interactions" ON insight_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- インサイト利用制限（Freeユーザー: 3回/日）
CREATE TABLE IF NOT EXISTS public.insight_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  used_date DATE NOT NULL DEFAULT CURRENT_DATE,
  action TEXT NOT NULL DEFAULT 'view',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_insight_usage_user_date ON insight_usage(user_id, used_date);

ALTER TABLE insight_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own insight usage" ON insight_usage
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own insight usage" ON insight_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- セールストーク変換キャッシュ
CREATE TABLE IF NOT EXISTS public.sales_talk_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  insight_id UUID NOT NULL REFERENCES insights(id) ON DELETE CASCADE,
  industry_slug TEXT NOT NULL,
  product_hash TEXT NOT NULL,
  talk_script TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(insight_id, industry_slug, product_hash)
);
CREATE INDEX IF NOT EXISTS idx_sales_talk_cache_lookup ON sales_talk_cache(insight_id, industry_slug);

ALTER TABLE sales_talk_cache ENABLE ROW LEVEL SECURITY;
-- All authenticated users can read cache (shared resource)
CREATE POLICY "Authenticated users read sales talk cache" ON sales_talk_cache
  FOR SELECT USING (auth.role() = 'authenticated');

-- =============================================
-- 法人チームプラン（Organizations & Team Members）
-- =============================================

-- 組織テーブル
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan_type TEXT DEFAULT 'team' CHECK (plan_type IN ('team')),
  max_members INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- チームメンバー
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(org_id, user_id)
);

-- 招待
CREATE TABLE IF NOT EXISTS public.team_invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'member',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  invited_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '7 days')
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_team_members_org ON team_members(org_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_token ON team_invitations(token);
CREATE INDEX IF NOT EXISTS idx_team_invitations_org ON team_invitations(org_id);

-- RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;

-- Organizations: owner can do everything, members can read
CREATE POLICY "Org owner full access" ON organizations
  FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Team members read org" ON organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.org_id = organizations.id
      AND team_members.user_id = auth.uid()
    )
  );

-- Team members: org owner/admin can manage, members can read own org
CREATE POLICY "Team members read own org members" ON team_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members AS tm
      WHERE tm.org_id = team_members.org_id
      AND tm.user_id = auth.uid()
    )
  );
CREATE POLICY "Org owner manages members" ON team_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM organizations
      WHERE organizations.id = team_members.org_id
      AND organizations.owner_id = auth.uid()
    )
  );
CREATE POLICY "Org admin manages members" ON team_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM team_members AS tm
      WHERE tm.org_id = team_members.org_id
      AND tm.user_id = auth.uid()
      AND tm.role IN ('owner', 'admin')
    )
  );

-- Invitations: org owner/admin can manage, anyone can read by token
CREATE POLICY "Org owner manages invitations" ON team_invitations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM organizations
      WHERE organizations.id = team_invitations.org_id
      AND organizations.owner_id = auth.uid()
    )
  );
CREATE POLICY "Org admin manages invitations" ON team_invitations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.org_id = team_invitations.org_id
      AND team_members.user_id = auth.uid()
      AND team_members.role IN ('owner', 'admin')
    )
  );
CREATE POLICY "Anyone can read invitation by token" ON team_invitations
  FOR SELECT USING (true);

-- ヘルパー関数: ユーザーがチームメンバーかどうかを返す（Pro相当アクセス判定用）
CREATE OR REPLACE FUNCTION public.is_team_member(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.team_members tm
    JOIN public.organizations o ON o.id = tm.org_id
    WHERE tm.user_id = check_user_id
    AND o.stripe_subscription_id IS NOT NULL
  );
END;
$$;

-- =============================================
-- KPI分析ダッシュボード
-- =============================================

-- 月次KPIスナップショット
CREATE TABLE IF NOT EXISTS public.monthly_kpi_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  month DATE NOT NULL UNIQUE,
  mau INTEGER DEFAULT 0,
  mrr INTEGER DEFAULT 0,
  churn_rate DECIMAL(5,2) DEFAULT 0,
  cvr DECIMAL(5,2) DEFAULT 0,
  ltv INTEGER DEFAULT 0,
  nps_score DECIMAL(4,1) DEFAULT 0,
  free_users INTEGER DEFAULT 0,
  pro_users INTEGER DEFAULT 0,
  new_signups INTEGER DEFAULT 0,
  churned_users INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- コンバージョンファネル
CREATE TABLE IF NOT EXISTS public.conversion_funnel (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  step TEXT NOT NULL CHECK (step IN ('visit', 'signup', 'first_roleplay', 'second_roleplay', 'pricing_view', 'checkout_start', 'payment_complete')),
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_conversion_funnel_step ON conversion_funnel(step, created_at);
CREATE INDEX IF NOT EXISTS idx_conversion_funnel_user ON conversion_funnel(user_id);

-- RLS for KPI tables (admin-only via service role key)
-- No public policies needed — accessed via service role key in API routes

-- =============================================
-- スコア統計ヘルパー関数
-- =============================================

-- ユーザーの直近N件のスコア平均を取得
CREATE OR REPLACE FUNCTION public.get_user_avg_score(
  target_user_id UUID,
  last_n INTEGER DEFAULT 10
)
RETURNS NUMERIC
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  avg_val NUMERIC;
BEGIN
  SELECT AVG(overall_score) INTO avg_val
  FROM (
    SELECT overall_score
    FROM public.roleplay_scores
    WHERE user_id = target_user_id
    ORDER BY created_at DESC
    LIMIT last_n
  ) AS recent;
  RETURN COALESCE(avg_val, 0);
END;
$$;

-- ユーザーのカテゴリ別平均スコアを取得（弱点分析用）
CREATE OR REPLACE FUNCTION public.get_user_category_averages(
  target_user_id UUID,
  last_n INTEGER DEFAULT 10
)
RETURNS TABLE(category_name TEXT, avg_score NUMERIC)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    cat->>'name' AS category_name,
    ROUND(AVG((cat->>'score')::NUMERIC), 1) AS avg_score
  FROM (
    SELECT category_scores
    FROM public.roleplay_scores
    WHERE user_id = target_user_id
    ORDER BY created_at DESC
    LIMIT last_n
  ) AS recent,
  LATERAL jsonb_array_elements(recent.category_scores) AS cat
  GROUP BY cat->>'name'
  ORDER BY avg_score ASC;
END;
$$;
