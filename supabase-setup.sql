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

CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users read own usage" ON usage_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own usage" ON usage_records FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 解約防止 + 紹介プログラム用テーブル
-- =============================================

-- profilesにカラム追加（一時停止・エンゲージメント管理）
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS pause_start TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS pause_resume_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS engagement_score INTEGER DEFAULT 0;

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
