-- =============================================
-- profiles にチェックアウト時のクーポンID追跡カラム追加
-- Supabase SQL Editor で実行してください
-- =============================================
-- 目的: どのキャンペーンクーポン経由でProに転換したかを
--       Supabaseだけで集計できるようにする

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS checkout_coupon_id TEXT,
  ADD COLUMN IF NOT EXISTS checkout_coupon_applied_at TIMESTAMPTZ;

COMMENT ON COLUMN public.profiles.checkout_coupon_id IS
  'Stripe Checkout 時に適用されたクーポンID（acquisition campaign tracking）';
COMMENT ON COLUMN public.profiles.checkout_coupon_applied_at IS
  'チェックアウトクーポン適用日時（キャンペーン効果測定用）';

-- 集計を高速化するためのインデックス（NULL値は除外）
CREATE INDEX IF NOT EXISTS idx_profiles_checkout_coupon
  ON public.profiles(checkout_coupon_id)
  WHERE checkout_coupon_id IS NOT NULL;

-- =============================================
-- 使用確認クエリ例:
-- =============================================
-- SELECT checkout_coupon_id, COUNT(*) as users
-- FROM profiles
-- WHERE checkout_coupon_id IS NOT NULL
-- GROUP BY checkout_coupon_id
-- ORDER BY users DESC;
