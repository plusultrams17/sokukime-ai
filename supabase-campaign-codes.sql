-- =============================================
-- キャンペーンコード: TRIAL1DAY / TRIAL14DAY
-- Supabase の SQL Editor で実行してください
-- =============================================
--
-- このファイルは冪等（何度実行しても安全）です。
-- 既存の tester_codes / tester_redemptions / profiles テーブルを前提にしています。
-- まだ作成していない場合は先に supabase-tester-setup.sql を実行してください。

-- ------------------------------------------------------------
-- 1. tester_codes に access_tier カラムを追加（存在しない場合のみ）
--    既存コード は 'full' にデフォルト設定される
-- ------------------------------------------------------------
ALTER TABLE public.tester_codes
  ADD COLUMN IF NOT EXISTS access_tier TEXT NOT NULL DEFAULT 'full'
  CHECK (access_tier IN ('basic', 'intermediate', 'full'));

-- ------------------------------------------------------------
-- 2. キャンペーンコード を登録
--    - TRIAL1DAY : 1日間 Pro / 先着100名
--    - TRIAL14DAY: 14日間 Pro / 先着100名
--    すべての学習プログラム (全22レッスン) にアクセス可能 = access_tier='full'
-- ------------------------------------------------------------
INSERT INTO public.tester_codes
  (code, description, duration_days, max_uses, active, access_tier)
VALUES
  ('TRIAL1DAY',  'キャンペーン: 1日間Proプラン (全22レッスン・AIロープレ無制限)',  1, 100, TRUE, 'full'),
  ('TRIAL14DAY', 'キャンペーン: 14日間Proプラン (全22レッスン・AIロープレ無制限)', 14, 100, TRUE, 'full')
ON CONFLICT (code) DO UPDATE SET
  description   = EXCLUDED.description,
  duration_days = EXCLUDED.duration_days,
  max_uses      = EXCLUDED.max_uses,
  active        = EXCLUDED.active,
  access_tier   = EXCLUDED.access_tier;

-- ------------------------------------------------------------
-- 3. 既存テスターの残留バグをクリーンアップ
--    既存の /api/activate は trial_ends_at=null を書き込んでいたため、
--    tester_expires_at を過ぎても plan='pro' が残り、永続アクセスになっていた。
--    この UPDATE は「有効期限がセットされている既存テスター」について
--    trial_ends_at=tester_expires_at を書き戻すことで、
--    cron の reverse-trial 失効ジョブが正常に降格できるようにする。
--
--    条件:
--    - is_tester = TRUE
--    - tester_expires_at IS NOT NULL            (有限期限のテスター)
--    - trial_ends_at IS NULL                    (過去の activate で null 書き込み)
--    - stripe_subscription_id IS NULL           (Stripe 経由で課金していない)
--
--    ※ Stripe 経由で有料購入している人 や 無期限コード(VIP)を使っている人 は対象外。
-- ------------------------------------------------------------
UPDATE public.profiles
SET trial_ends_at = tester_expires_at
WHERE is_tester = TRUE
  AND tester_expires_at IS NOT NULL
  AND trial_ends_at IS NULL
  AND stripe_subscription_id IS NULL;

-- ------------------------------------------------------------
-- 4. 確認用クエリ
-- ------------------------------------------------------------
-- SELECT code, description, duration_days, max_uses, current_uses, active, access_tier
--   FROM public.tester_codes
--  ORDER BY code;
--
-- SELECT id, email, plan, subscription_status, is_tester, tester_code,
--        tester_expires_at, trial_ends_at, stripe_subscription_id
--   FROM public.profiles
--  WHERE is_tester = TRUE
--  ORDER BY tester_expires_at DESC NULLS LAST;
