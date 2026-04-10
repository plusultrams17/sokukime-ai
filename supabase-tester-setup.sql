-- =============================================
-- テスター招待コード機能
-- Supabase の SQL Editor で実行してください
-- =============================================

-- 1. profiles にテスター関連カラムを追加
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_tester BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS tester_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS tester_code TEXT;

CREATE INDEX IF NOT EXISTS idx_profiles_is_tester ON public.profiles(is_tester) WHERE is_tester = TRUE;

-- 2. テスター招待コードマスター
CREATE TABLE IF NOT EXISTS public.tester_codes (
  code TEXT PRIMARY KEY,
  description TEXT NOT NULL DEFAULT '',
  duration_days INTEGER, -- NULL = 無期限
  max_uses INTEGER,      -- NULL = 無制限
  current_uses INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. テスターコード使用履歴
CREATE TABLE IF NOT EXISTS public.tester_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  code TEXT NOT NULL REFERENCES tester_codes(code) ON DELETE CASCADE,
  redeemed_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- NULL = 無期限
  UNIQUE(user_id, code) -- 同じユーザーは同じコードを1回のみ
);
CREATE INDEX IF NOT EXISTS idx_tester_redemptions_user ON public.tester_redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_tester_redemptions_code ON public.tester_redemptions(code);

-- 4. RLS
ALTER TABLE public.tester_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tester_redemptions ENABLE ROW LEVEL SECURITY;

-- tester_codes: 誰でも有効なコードを照会可能（コード検証用）。INSERT/UPDATE/DELETEはservice roleキー経由のみ
DROP POLICY IF EXISTS "Anyone can read active tester codes" ON public.tester_codes;
CREATE POLICY "Anyone can read active tester codes" ON public.tester_codes
  FOR SELECT USING (active = TRUE);

-- tester_redemptions: ユーザーは自分の引き換え履歴のみ閲覧可能。INSERT/UPDATEはservice roleキー経由
DROP POLICY IF EXISTS "Users read own redemptions" ON public.tester_redemptions;
CREATE POLICY "Users read own redemptions" ON public.tester_redemptions
  FOR SELECT USING (auth.uid() = user_id);

-- 5. 初期コードを投入（既存があれば DO NOTHING）
INSERT INTO public.tester_codes (code, description, duration_days, max_uses, active) VALUES
  ('TESTER14', 'バグ・UXフィードバック収集用（14日間）', 14, 50, TRUE),
  ('FRIEND90', '友人・知人向けの長期トライアル（90日間）', 90, 30, TRUE),
  ('VIP', 'アンバサダー・関係者向けの永続アクセス', NULL, 20, TRUE),
  ('DEMO7', '商談中の見込み客向け体験コード（7日間）', 7, 100, TRUE)
ON CONFLICT (code) DO NOTHING;

-- =============================================
-- 確認用クエリ（実行後に手動でチェック可能）
-- =============================================
-- SELECT * FROM tester_codes;
-- SELECT id, email, plan, is_tester, tester_code, tester_expires_at FROM profiles WHERE is_tester = TRUE;
